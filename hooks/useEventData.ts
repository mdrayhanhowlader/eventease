import { useState } from 'react';
import { Event, User, Booking, Role } from '../types';

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const initialUsers: User[] = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com', passwordHash: 'hashed_password', role: Role.USER },
  { id: 'user2', name: 'Bob Organizer', email: 'bob@example.com', passwordHash: 'hashed_password', role: Role.ORGANIZER, organizerStatus: 'approved' },
  { id: 'user3', name: 'Charlie Admin', email: 'charlie@example.com', passwordHash: 'hashed_password', role: Role.ADMIN },
];

const initialEvents: Event[] = [
  {
    id: 'event1',
    title: 'Summer Music Festival',
    description: 'Join us for a weekend of live music, food trucks, and fun under the sun. Featuring top artists from around the globe!',
    category: 'Music',
    location: 'Central Park, New York',
    date: new Date('2024-08-15T18:00:00'),
    ticketPrice: 75.00,
    seatsAvailable: 500,
    imageUrl: 'https://picsum.photos/seed/musicfest/400/250',
    createdBy: 'user2',
  },
  {
    id: 'event2',
    title: 'Tech Conference 2024',
    description: 'The biggest tech conference of the year. Explore the future of technology with industry leaders and innovators.',
    category: 'Technology',
    location: 'Moscone Center, San Francisco',
    date: new Date('2024-09-20T09:00:00'),
    ticketPrice: 299.99,
    seatsAvailable: 150,
    imageUrl: 'https://picsum.photos/seed/techconf/400/250',
    createdBy: 'user2',
  },
  {
    id: 'event3',
    title: 'Local Art Exhibition',
    description: 'Discover talented local artists and their stunning creations. A perfect evening for art lovers.',
    category: 'Arts',
    location: 'Downtown Art Gallery',
    date: new Date('2024-07-30T19:00:00'),
    ticketPrice: 25.00,
    seatsAvailable: 0, // Sold out
    imageUrl: 'https://picsum.photos/seed/artshow/400/250',
    createdBy: 'user2',
  },
  {
    id: 'event4',
    title: 'Gourmet Food & Wine Pairing',
    description: 'An exclusive evening of gourmet food and fine wine pairing, guided by a master sommelier.',
    category: 'Food & Drink',
    location: 'The Vineyard Restaurant',
    date: new Date('2024-08-05T19:30:00'),
    ticketPrice: 120.00,
    seatsAvailable: 40,
    imageUrl: 'https://picsum.photos/seed/wine/400/250',
    createdBy: 'user2',
  },
  {
    id: 'event5',
    title: 'Morning Yoga Retreat',
    description: 'Start your day with a rejuvenating yoga session in a peaceful garden setting. All levels welcome.',
    category: 'Wellness',
    location: 'Serenity Gardens',
    date: new Date('2024-08-10T08:00:00'),
    ticketPrice: 30.00,
    seatsAvailable: 25,
    imageUrl: 'https://picsum.photos/seed/yoga/400/250',
    createdBy: 'user2',
  },
  {
    id: 'event6',
    title: 'Startup Pitch Night',
    description: 'Watch the next generation of entrepreneurs pitch their ideas to a panel of venture capitalists.',
    category: 'Business',
    location: 'Innovation Hub',
    date: new Date('2024-09-05T18:00:00'),
    ticketPrice: 15.00,
    seatsAvailable: 100,
    imageUrl: 'https://picsum.photos/seed/startup/400/250',
    createdBy: 'user2',
  },
   {
    id: 'event7',
    title: 'Community Charity Run 5K',
    description: 'Lace up your running shoes for a good cause! All proceeds go to the local children\'s hospital.',
    category: 'Community',
    location: 'Lakeside Park',
    date: new Date('2024-09-15T09:00:00'),
    ticketPrice: 20.00,
    seatsAvailable: 300,
    imageUrl: 'https://picsum.photos/seed/charityrun/400/250',
    createdBy: 'user2',
  },
  {
    id: 'event8',
    title: 'Advanced JavaScript Workshop',
    description: 'Deep dive into advanced JavaScript concepts like asynchronous programming, closures, and performance optimization.',
    category: 'Technology',
    location: 'Online',
    date: new Date('2024-08-22T10:00:00'),
    ticketPrice: 150.00,
    seatsAvailable: 50,
    imageUrl: 'https://picsum.photos/seed/javascript/400/250',
    createdBy: 'user2',
  },
];

const initialBookings: Booking[] = [
    { id: 'booking1', eventId: 'event2', userId: 'user1', bookingDate: new Date(), totalAmount: 299.99, attendeeName: 'Alice', attendeeEmail: 'alice@example.com' }
];

const useEventData = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...eventData, id: generateId() };
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };
  
  const deleteEvent = (eventId: string) => {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setBookings(prev => prev.filter(booking => booking.eventId !== eventId));
  }

  const addBooking = (event: Event, user: User) => {
    if (event.seatsAvailable > 0) {
      const newBooking: Booking = {
        id: generateId(),
        eventId: event.id,
        userId: user.id,
        bookingDate: new Date(),
        totalAmount: event.ticketPrice,
        attendeeName: user.name,
        attendeeEmail: user.email,
      };
      setBookings(prev => [...prev, newBooking]);
      updateEvent({ ...event, seatsAvailable: event.seatsAvailable - 1 });
      return true;
    }
    return false;
  };
  
  const cancelBooking = (bookingId: string) => {
      const bookingToCancel = bookings.find(b => b.id === bookingId);
      if (bookingToCancel) {
          const eventToUpdate = events.find(e => e.id === bookingToCancel.eventId);
          if (eventToUpdate) {
              updateEvent({ ...eventToUpdate, seatsAvailable: eventToUpdate.seatsAvailable + 1 });
          }
          setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
  }

  const addUser = (userData: Omit<User, 'id' | 'passwordHash'> & { passwordHash: string; organizerStatus?: 'pending' | 'approved' }) => {
      const newUser: User = { ...userData, id: generateId() };
      setUsers(prev => [...prev, newUser]);
      return newUser;
  }
  
  const approveOrganizer = (userId: string) => {
      setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, organizerStatus: 'approved' } : user
      ));
  };

  const denyOrganizer = (userId: string) => {
      setUsers(prev => prev.filter(user => user.id !== userId));
  };

  return { users, events, bookings, addEvent, updateEvent, deleteEvent, addBooking, cancelBooking, addUser, approveOrganizer, denyOrganizer };
};

export default useEventData;