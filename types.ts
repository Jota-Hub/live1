export interface Event {
  id: number;
  date: string;
  title: string;
  artists?: string;
  description: string;
  openTime: string;
  startTime: string;
  ticketPrice: string;
  doorPrice?: string;
  imageUrl?: string;
}
