
export enum Role {
  USER = 'user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
}

export enum Page {
  HOME = 'home',
  USER_DASHBOARD = 'user_dashboard',
  ORGANIZER_DASHBOARD = 'organizer_dashboard',
  ADMIN_DASHBOARD = 'admin_dashboard',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Storing password hash instead of plain text
  role: Role;
  organizerStatus?: 'pending' | 'approved';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  ticketPrice: number;
  seatsAvailable: number;
  imageUrl: string;
  createdBy: string; // Organizer's user ID
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  bookingDate: Date;
  totalAmount: number;
  attendeeName: string;
  attendeeEmail: string;
}