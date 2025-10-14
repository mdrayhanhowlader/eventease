import React from 'react';
import { Booking, Event } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';

interface BookingCardProps {
  booking: Booking;
  event?: Event;
  onCancel: (bookingId: string) => void;
  setToast: (toast: { message: string; type: 'success' | 'error' }) => void;
}

const QrCodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h.01"/><path d="M21 12h.01"/><path d="M12 21h.01"/></svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 opacity-70"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 opacity-70"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const BookingCard: React.FC<BookingCardProps> = ({ booking, event, onCancel, setToast }) => {
  if (!event) return null;

  const handleAddToCalendar = () => {
    const formatDateForICS = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startTime = formatDateForICS(event.date);
    // Assuming a 2-hour duration for the event
    const endTime = formatDateForICS(new Date(event.date.getTime() + 2 * 60 * 60 * 1000));

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `UID:${event.id}@eventease.com`,
        `DTSTAMP:${formatDateForICS(new Date())}`,
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSetReminder = async () => {
    if (!('Notification' in window)) {
        setToast({ message: 'This browser does not support desktop notification', type: 'error' });
        return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        setToast({ message: 'Notification permission denied.', type: 'error' });
        return;
    }

    const now = new Date().getTime();
    const eventTime = event.date.getTime();
    const reminderTime = eventTime - (60 * 60 * 1000); // 1 hour before

    if (reminderTime < now) {
        setToast({ message: 'This event is too soon to set a reminder.', type: 'error' });
        return;
    }

    const timeout = reminderTime - now;
    setTimeout(() => {
        new Notification('Event Reminder', {
            body: `Your event "${event.title}" starts in 1 hour at ${event.location}.`,
            icon: '/vite.svg' // You can use a better icon
        });
    }, timeout);
    
    setToast({ message: 'Reminder set successfully!', type: 'success'});
  };

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden shadow-md border-0 rounded-lg">
      <img src={event.imageUrl} alt={event.title} className="h-48 w-full md:h-auto md:w-56 object-cover" />
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <CardDescription className="text-primary font-semibold">{event.category}</CardDescription>
          <CardTitle className="text-2xl mt-1">{event.title}</CardTitle>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
             <p className="flex items-center"><CalendarIcon /> {event.date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
             <p className="flex items-center"><MapPinIcon /> {event.location}</p>
          </div>
           <p className="text-xs text-muted-foreground mt-3">Booked on: {booking.bookingDate.toLocaleDateString()}</p>
        </div>

        <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center p-2 rounded-md bg-secondary cursor-pointer hover:bg-secondary/80">
                <QrCodeIcon />
                <div>
                    <p className="font-semibold text-sm">Your Ticket</p>
                    <p className="text-xs text-muted-foreground">Show QR Code at entry</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleAddToCalendar}>Add to Calendar</Button>
                <Button variant="outline" size="sm" onClick={handleSetReminder}>Set Reminder</Button>
                <Button variant="destructive" size="sm" onClick={() => onCancel(booking.id)}>Cancel Booking</Button>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;