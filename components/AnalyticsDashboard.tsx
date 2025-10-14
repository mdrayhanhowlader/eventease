
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { User, Event, Booking } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface AnalyticsDashboardProps {
  users: User[];
  events: Event[];
  bookings: Booking[];
}

const AnalyticsCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ users, events, bookings }) => {
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalAmount, 0);
    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const totalEvents = events.length;
    
    const revenueByMonth = bookings.reduce((acc, booking) => {
        const month = booking.bookingDate.toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + booking.totalAmount;
        return acc;
    }, {} as { [key: string]: number });

    const revenueData = Object.keys(revenueByMonth).map(month => ({
        name: month,
        revenue: revenueByMonth[month],
    }));

    const eventsByCategory = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const categoryData = Object.keys(eventsByCategory).map(category => ({
        name: category,
        value: eventsByCategory[category],
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AnalyticsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSignIcon />} />
                <AnalyticsCard title="Total Users" value={totalUsers} icon={<UsersIcon />} />
                <AnalyticsCard title="Total Bookings" value={totalBookings} icon={<CreditCardIcon />} />
                <AnalyticsCard title="Total Events" value={totalEvents} icon={<ActivityIcon />} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Revenue by Month</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Events by Category</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                {/* FIX: Explicitly convert percent to a number to prevent type errors during arithmetic operations, as recharts types can be 'any'. */}
                                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(Number(percent ?? 0) * 100).toFixed(0)}%`}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
