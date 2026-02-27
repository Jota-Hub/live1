import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .gif format allowed!'));
  }
});

// Initialize Database
const db = new Database('livehouse.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL, -- ISO date string YYYY-MM-DD
    title TEXT NOT NULL,
    artists TEXT,
    description TEXT,
    openTime TEXT,
    startTime TEXT,
    ticketPrice TEXT,
    doorPrice TEXT,
    imageUrl TEXT
  );
`);

// Migration: Add doorPrice column if it doesn't exist
try {
  db.prepare('ALTER TABLE events ADD COLUMN doorPrice TEXT').run();
} catch (error) {
  // Column likely already exists
}

// Migration: Add artists column if it doesn't exist
try {
  db.prepare('ALTER TABLE events ADD COLUMN artists TEXT').run();
} catch (error) {
  // Column likely already exists
}

// Seed some initial data if empty
const count = db.prepare('SELECT count(*) as count FROM events').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO events (date, title, artists, description, openTime, startTime, ticketPrice, doorPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  insert.run(today.toISOString().split('T')[0], 'Neon Nights: Synthwave Special', 'The Midnight Runners, Cyber City', 'Featuring The Midnight Runners and Cyber City.', '18:00', '19:00', '¥2,500', '¥3,000');
  insert.run(tomorrow.toISOString().split('T')[0], 'Heavy Metal Thunder', 'Iron Fist, Skull Crusher', 'Loud noises and headbanging. Earplugs recommended.', '17:30', '18:30', '¥3,000', '¥3,500');
  insert.run(nextWeek.toISOString().split('T')[0], 'Jazz & Gin', 'Downtown Quartet', 'Smooth jazz evening with the Downtown Quartet.', '19:00', '20:00', '¥2,000', '¥2,500');
}

async function startServer() {
  const app = express();
  // const PORT = 3000; // Removed hardcoded port

  app.use(express.json());
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // API Routes
  app.post('/api/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    });
  });

  app.get('/api/events', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM events ORDER BY date ASC');
      const events = stmt.all();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.post('/api/events', (req, res) => {
    try {
      const { date, title, artists, description, openTime, startTime, ticketPrice, doorPrice, imageUrl } = req.body;
      const stmt = db.prepare(`
        INSERT INTO events (date, title, artists, description, openTime, startTime, ticketPrice, doorPrice, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(date, title, artists || '', description, openTime, startTime, ticketPrice, doorPrice || '', imageUrl || '');
      res.json({ id: info.lastInsertRowid, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  app.put('/api/events/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { date, title, artists, description, openTime, startTime, ticketPrice, doorPrice, imageUrl } = req.body;
      const stmt = db.prepare(`
        UPDATE events 
        SET date = ?, title = ?, artists = ?, description = ?, openTime = ?, startTime = ?, ticketPrice = ?, doorPrice = ?, imageUrl = ?
        WHERE id = ?
      `);
      stmt.run(date, title, artists || '', description, openTime, startTime, ticketPrice, doorPrice || '', imageUrl || '', id);
      res.json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' });
    }
  });

  app.delete('/api/events/:id', (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('DELETE FROM events WHERE id = ?');
      stmt.run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  });
}

startServer();
