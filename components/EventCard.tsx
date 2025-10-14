import React from 'react';
import { Event } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';

// FIX: Defined the props interface for EventCard.
interface EventCardProps {
  event: Event;
  onBook: (event: Event) => void;
  onViewDetails: (event: Event) => void;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const EventCard: React.FC<EventCardProps> = ({ event, onBook, onViewDetails }) => {
  const isSoldOut = event.seatsAvailable <= 0;
  const day = event.date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = event.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl group border-0 shadow-md rounded-lg">
      <div className="relative overflow-hidden">
        <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute top-4 left-4">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">{event.category}</span>
        </div>
      </div>
      <CardHeader className="flex flex-row items-start pt-4">
         <div className="text-center mr-4">
            <p className="text-sm font-semibold text-primary">{month}</p>
            <p className="text-2xl font-bold">{day}</p>
        </div>
        <div className="flex-1">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{event.title}</CardTitle>
            <CardDescription className="flex items-center pt-1">
                <MapPinIcon /> {event.location}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xl font-bold text-primary">${event.ticketPrice}</span>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(event)}>Details</Button>
            <Button size="sm" onClick={() => onBook(event)} disabled={isSoldOut}>
            {isSoldOut ? 'Sold Out' : 'Book Now'}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;