import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import Textarea from './ui/Textarea';
import { generateEventDescription, generateEventImage } from '../services/geminiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/Dialog';

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: Omit<Event, 'id'> | Event) => void;
  initialData?: Event | null;
  organizerId: string;
}

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.9 1.9-1.2-3.1L7 3.7l-3.1-1.2L2 7l1.9 1.9-3.1 1.2L3.7 13l-1.2 3.1L7 16l1.9-1.9 1.2 3.1 1.9-1.9 3.1 1.2 1.2-3.1-1.9-1.9L16 7l-3.1-1.2L13 2l-1.9 1.9-1.2-3.1Z"/></svg>
);
const UploadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);


const EventForm: React.FC<EventFormProps> = ({ open, onOpenChange, onSubmit, initialData, organizerId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateTime: '',
    ticketPrice: '',
    seatsAvailable: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const toLocalDateTimeString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (initialData) {
      const localDateTime = toLocalDateTimeString(initialData.date);
      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        location: initialData.location,
        dateTime: localDateTime,
        ticketPrice: String(initialData.ticketPrice),
        seatsAvailable: String(initialData.seatsAvailable),
        imageUrl: initialData.imageUrl,
      });
      setImagePreview(initialData.imageUrl);
    } else {
      setFormData({
        title: '', description: '', category: '', location: '', dateTime: '',
        ticketPrice: '', seatsAvailable: '', imageUrl: ''
      });
      setImagePreview(null);
    }
  }, [initialData, open]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category) {
      alert('Please enter a title and category first.');
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const desc = await generateEventDescription(formData.title, formData.category);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingDesc(false);
    }
  };
  
  const handleGenerateImage = async () => {
    if (!formData.title) {
      alert('Please enter a title first to generate a relevant image.');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateEventImage(formData.title);
      setFormData(prev => ({ ...prev, imageUrl }));
      setImagePreview(imageUrl);
    } catch (error) {
        alert('There was an error generating the image. Please try again.');
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventDateTime = new Date(formData.dateTime);
    const eventData = {
      ...formData,
      ticketPrice: parseFloat(formData.ticketPrice),
      seatsAvailable: parseInt(formData.seatsAvailable, 10),
      date: eventDateTime,
      createdBy: organizerId,
      // Use a placeholder if no image was selected or generated
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.title}/400/250`
    };
    if (initialData) {
        onSubmit({ ...initialData, ...eventData });
    } else {
        onSubmit(eventData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. You can use our AI to generate a compelling description and a unique image.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
            </div>
          </div>
           <div>
              <Label>Event Image</Label>
              <div className="flex items-center gap-4">
                  {imagePreview ? 
                    <img src={imagePreview} alt="Event preview" className="w-48 h-28 object-cover rounded-md" /> :
                    <div className="w-48 h-28 bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-sm">Image Preview</div>
                  }
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="imageUpload" className="w-full cursor-pointer flex items-center justify-center gap-2 h-10 px-4 py-2 border border-input bg-background rounded-md text-sm hover:bg-accent">
                        <UploadIcon className="w-4 h-4"/>
                        <span>Upload Manually</span>
                    </Label>
                     <Button type="button" size="default" variant="secondary" className="w-full" onClick={handleGenerateImage} disabled={isGeneratingImage}>
                        <SparklesIcon className="w-4 h-4 mr-2"/> {isGeneratingImage ? 'Generating...' : 'Generate with AI'}
                      </Button>
                  </div>
                  <Input id="imageUpload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={3} />
              <Button type="button" size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={handleGenerateDescription} disabled={isGeneratingDesc}>
                <SparklesIcon className="w-4 h-4 mr-2"/> {isGeneratingDesc ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateTime">Date & Time</Label>
              <Input id="dateTime" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} required />
            </div>
             <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
              <Input id="ticketPrice" name="ticketPrice" type="number" step="0.01" value={formData.ticketPrice} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="seatsAvailable">Seats Available</Label>
              <Input id="seatsAvailable" name="seatsAvailable" type="number" value={formData.seatsAvailable} onChange={handleChange} required />
            </div>
          </div>
           <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Event'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;