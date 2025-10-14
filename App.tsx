import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import BookingCard from './components/BookingCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LoginDialog from './components/LoginDialog';
import SignUpDialog, { SignUpFormData } from './components/SignUpDialog';
import CheckoutDialog from './components/CheckoutDialog';
import AttendeesDialog from './components/AttendeesDialog';
import EventDetailsDialog from './components/EventDetailsDialog';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';
import AdminManagementPanel from './components/AdminManagementPanel';
import { Page, User, Event, Role } from './types';
import useEventData from './hooks/useEventData';
import Button from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/Card';
import Input from './components/ui/Input';

const App: React.FC = () => {
  const { users, events, bookings, addEvent, updateEvent, deleteEvent, addBooking, cancelBooking, addUser, approveOrganizer, denyOrganizer } = useEventData();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isEventFormOpen, setEventFormOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isAttendeesOpen, setAttendeesOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  
  const handleLogin = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setLoginOpen(false);
      setToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
      if (user.role === Role.ADMIN) {
        setCurrentPage(Page.ADMIN_DASHBOARD);
      } else if (user.role === Role.ORGANIZER && user.organizerStatus === 'approved') {
        setCurrentPage(Page.ORGANIZER_DASHBOARD);
      } else {
        setCurrentPage(Page.USER_DASHBOARD);
      }
      return true;
    }
    return false;
  };
  
  const handleSignUp = (formData: SignUpFormData): boolean => {
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
          return false;
      }
      const newUser = addUser({ 
          name: formData.name, 
          email: formData.email, 
          passwordHash: formData.password, 
          role: formData.role,
          organizerStatus: formData.organizerStatus,
      });
      setCurrentUser(newUser);
      setSignUpOpen(false);
      setToast({ message: 'Account created successfully!', type: 'success'});
      // All new users, including pending organizers, go to the user dashboard first.
      setCurrentPage(Page.USER_DASHBOARD);
      return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(Page.HOME);
    setToast({ message: 'Logged out successfully.', type: 'success'});
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };
  
  const handleEventSubmit = (eventData: Omit<Event, 'id'> | Event) => {
      if ('id' in eventData) {
          updateEvent(eventData);
          setToast({ message: 'Event updated successfully!', type: 'success'});
      } else {
          addEvent(eventData);
          setToast({ message: 'Event created successfully!', type: 'success'});
      }
      setEventFormOpen(false);
      setEditingEvent(null);
  };
  
  const handleConfirmBooking = () => {
      if(selectedEvent && currentUser) {
          const success = addBooking(selectedEvent, currentUser);
          if (success) {
            setToast({ message: 'Event booked successfully!', type: 'success'});
            setCurrentPage(Page.USER_DASHBOARD);
          } else {
            setToast({ message: 'Failed to book event. No seats available.', type: 'error'});
          }
      }
      setCheckoutOpen(false);
      setSelectedEvent(null);
  };

  const handleCancelBooking = (bookingId: string) => {
      cancelBooking(bookingId);
      setToast({ message: 'Booking cancelled.', type: 'success' });
  }

  const openEventForm = (event: Event | null) => {
      setEditingEvent(event);
      setEventFormOpen(true);
  }
  
  const openCheckout = (event: Event) => {
      if (!currentUser) {
          setLoginOpen(true);
          setToast({ message: 'Please log in to book an event.', type: 'error'});
          return;
      }
      setSelectedEvent(event);
      setDetailsOpen(false); // Close details modal if open
      setCheckoutOpen(true);
  }
  
  const openDetails = (event: Event) => {
      setSelectedEvent(event);
      setDetailsOpen(true);
  };

  const openAttendees = (event: Event) => {
      setSelectedEvent(event);
      setAttendeesOpen(true);
  }
  
  const handleApproveOrganizer = (userId: string) => {
      approveOrganizer(userId);
      setToast({ message: 'Organizer approved successfully.', type: 'success' });
  };

  const handleDenyOrganizer = (userId: string) => {
      denyOrganizer(userId);
      setToast({ message: 'Organizer request denied and user removed.', type: 'success' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.USER_DASHBOARD:
        const userBookings = bookings.filter(b => b.userId === currentUser?.id);
        return (
            <div className="space-y-6">
                 {currentUser?.role === Role.ORGANIZER && currentUser.organizerStatus === 'pending' && (
                    <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <CardHeader>
                            <CardTitle className="text-yellow-800 dark:text-yellow-200">Pending Approval</CardTitle>
                             <CardDescription className="text-yellow-700 dark:text-yellow-300">
                                Your organizer account is currently under review by an administrator. You will be notified once it's approved.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                {userBookings.length > 0 ? (
                    userBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} event={events.find(e => e.id === booking.eventId)} onCancel={handleCancelBooking} setToast={setToast} />
                    ))
                ) : (
                    <p>You have no bookings yet. Go ahead and explore some events!</p>
                )}
            </div>
        );
      case Page.ORGANIZER_DASHBOARD:
        if (currentUser?.role !== Role.ORGANIZER || currentUser.organizerStatus !== 'approved') {
            setCurrentPage(Page.USER_DASHBOARD); // Redirect if not an approved organizer
            return null;
        }
        const organizerEvents = events.filter(e => e.createdBy === currentUser?.id);
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <Button onClick={() => openEventForm(null)}>Create New Event</Button>
                </div>
                {organizerEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizerEvents.map(event => (
                           <Card key={event.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                                </CardContent>
                                <div className="p-6 pt-0 flex gap-2 flex-wrap">
                                    <Button variant="outline" size="sm" onClick={() => openEventForm(event)}>Edit</Button>
                                    <Button variant="secondary" size="sm" onClick={() => openAttendees(event)}>View Attendees</Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>Delete</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p>You haven't created any events yet.</p>
                )}
            </div>
        );
      case Page.ADMIN_DASHBOARD:
        return (
            <div className="space-y-8">
                <AnalyticsDashboard users={users} events={events} bookings={bookings} />
                <AdminManagementPanel users={users} onApprove={handleApproveOrganizer} onDeny={handleDenyOrganizer} />
            </div>
        );
      case Page.HOME:
      default:
        const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];
        const filteredEvents = events.filter(event => {
            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        return (
            <div className="space-y-8">
                 <div className="text-center py-16 px-4 bg-card border rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/30 dark:to-secondary/20"></div>
                    <div className="relative">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Discover & Book Amazing Events</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">From music festivals to tech conferences, find your next experience with EventEase.</p>
                        <div className="mt-8 max-w-xl mx-auto">
                            <Input 
                                type="search" 
                                placeholder="Search by event name or keyword..." 
                                className="w-full text-base h-12 rounded-full bg-background/80 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="mt-6 flex justify-center gap-2 flex-wrap">
                            {categories.map(category => (
                                <Button 
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="rounded-full backdrop-blur-sm"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEvents.map(event => (
                        <EventCard key={event.id} event={event} onBook={openCheckout} onViewDetails={openDetails} />
                    ))}
                </div>
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header 
        user={currentUser} 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        onLoginClick={() => setLoginOpen(true)}
        onSignUpClick={() => setSignUpOpen(true)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <main className="container py-8">
        {renderContent()}
      </main>
      
      {isLoginOpen && <LoginDialog open={isLoginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} onForgotPassword={() => {}} onSignUp={() => {setLoginOpen(false); setSignUpOpen(true);}} />}
      {isSignUpOpen && <SignUpDialog open={isSignUpOpen} onOpenChange={setSignUpOpen} onSignUp={handleSignUp} onLogin={() => {setSignUpOpen(false); setLoginOpen(true);}} />}
      {currentUser?.role === Role.ORGANIZER && <EventForm open={isEventFormOpen} onOpenChange={setEventFormOpen} onSubmit={handleEventSubmit} initialData={editingEvent} organizerId={currentUser.id} />}
      {isCheckoutOpen && selectedEvent && <CheckoutDialog event={selectedEvent} open={isCheckoutOpen} onOpenChange={setCheckoutOpen} onConfirmBooking={handleConfirmBooking} />}
      {isAttendeesOpen && selectedEvent && <AttendeesDialog event={selectedEvent} bookings={bookings} users={users} open={isAttendeesOpen} onOpenChange={setAttendeesOpen} />}
      {isDetailsOpen && selectedEvent && <EventDetailsDialog event={selectedEvent} open={isDetailsOpen} onOpenChange={setDetailsOpen} onBookNow={openCheckout} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Chatbot events={events} />
    </div>
  );
};

export default App;