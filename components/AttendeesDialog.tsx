// FIX: Created AttendeesDialog component for organizers to view event attendees.
import React from 'react';
import { Event, Booking, User } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/Dialog';

interface AttendeesDialogProps {
  event: Event | null;
  bookings: Booking[];
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AttendeesDialog: React.FC<AttendeesDialogProps> = ({ event, bookings, users, open, onOpenChange }) => {
  if (!event) return null;

  const attendees = bookings.filter(b => b.eventId === event.id);
  const totalSeats = event.seatsAvailable + attendees.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendees for "{event.title}"</DialogTitle>
          <DialogDescription>
            {attendees.length} / {totalSeats} seats booked.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto mt-4">
          {attendees.length > 0 ? (
            <ul className="space-y-2">
              {attendees.map(attendee => (
                <li key={attendee.id} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                  <span>{attendee.attendeeName}</span>
                  <span className="text-sm text-muted-foreground">{attendee.attendeeEmail}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">No attendees yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeesDialog;