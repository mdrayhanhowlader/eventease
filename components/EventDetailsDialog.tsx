import React from 'react';
import { Event } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import Button from './ui/Button';

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1"><path d="M2 9a3 3 0 0 1 0 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a3 3 0 0 1 0-6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookNow: (event: Event) => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event, open, onOpenChange, onBookNow }) => {
  if (!event) return null;
  const isSoldOut = event.seatsAvailable <= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <div className="overflow-hidden rounded-t-lg relative">
            <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md mb-2">{event.category}</span>
                <DialogTitle className="text-3xl font-bold text-white">{event.title}</DialogTitle>
            </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
                <div className="flex items-start"><CalendarIcon /> <span>{event.date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span></div>
                <div className="flex items-start"><MapPinIcon /> <span>{event.location}</span></div>
            </div>
            <div className="space-y-4">
                <div className="flex items-start"><TicketIcon /> <span>${event.ticketPrice.toFixed(2)} / ticket</span></div>
                <div className="flex items-start"><UsersIcon /> <span>{isSoldOut ? 'Sold Out' : `${event.seatsAvailable} seats remaining`}</span></div>
            </div>
        </div>

        <div className="px-6 pb-6">
            <h4 className="font-semibold mb-2 text-lg">About This Event</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
        </div>

        <DialogFooter className="p-4 bg-secondary/30 dark:bg-secondary/20 rounded-b-lg">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => onBookNow(event)} disabled={isSoldOut}>
            {isSoldOut ? 'Sold Out' : 'Book Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;