
import React from 'react';
import { Event } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import Button from './ui/Button';

interface CheckoutDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmBooking: () => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ event, open, onOpenChange, onConfirmBooking }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>You are about to book a ticket for "{event.title}".</DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Event</span>
            <span className="font-medium">{event.title}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{event.date.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium">{event.location}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">${event.ticketPrice.toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirmBooking}>Confirm & Book</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
