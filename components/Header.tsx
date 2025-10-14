import React, { useState } from 'react';
import { User, Page, Role } from '../types';
import Button from './ui/Button';
import Logo from './Logo';

interface HeaderProps {
  user: User | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M2 9a3 3 0 0 1 0 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a3 3 0 0 1 0-6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;


const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode; icon?: React.ReactNode }> = ({ page, currentPage, onNavigate, children, icon }) => {
    const navLinkClasses = `flex items-center text-sm font-medium transition-colors p-2 rounded-md hover:bg-accent ${currentPage === page ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground'}`;
    return (
        <button onClick={() => onNavigate(page)} className={navLinkClasses}>
            {icon}
            {children}
        </button>
    );
};

const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

const SunIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const MoonIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;


const Header: React.FC<HeaderProps> = ({ user, currentPage, onNavigate, onLogout, onLoginClick, onSignUpClick, theme, onThemeToggle }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavClick = (page: Page) => {
      onNavigate(page);
      setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10 items-center">
          <button className="flex items-center" onClick={() => onNavigate(Page.HOME)}>
            <Logo />
          </button>
          {/* Desktop Navigation */}
          <nav className="hidden gap-2 md:flex">
             <NavLink page={Page.HOME} currentPage={currentPage} onNavigate={onNavigate} icon={<HomeIcon/>}>Home</NavLink>
            {user?.role === Role.USER && <NavLink page={Page.USER_DASHBOARD} currentPage={currentPage} onNavigate={onNavigate} icon={<TicketIcon/>}>My Bookings</NavLink>}
            {user?.role === Role.ORGANIZER && <NavLink page={Page.ORGANIZER_DASHBOARD} currentPage={currentPage} onNavigate={onNavigate} icon={<CalendarIcon/>}>My Events</NavLink>}
            {user?.role === Role.ADMIN && <NavLink page={Page.ADMIN_DASHBOARD} currentPage={currentPage} onNavigate={onNavigate} icon={<LayoutDashboardIcon/>}>Dashboard</NavLink>}
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" size="icon" onClick={onThemeToggle}>
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Welcome, {user.name}</span>
              <Button variant="secondary" size="sm" onClick={onLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onLoginClick}>Login</Button>
                <Button size="sm" onClick={onSignUpClick}>Sign Up</Button>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
             <Button variant="ghost" size="icon" onClick={onThemeToggle}>
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                <HamburgerIcon />
                <span className="sr-only">Toggle menu</span>
            </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background shadow-lg z-50">
            <nav className="flex flex-col items-stretch gap-2 p-4">
                <NavLink page={Page.HOME} currentPage={currentPage} onNavigate={handleMobileNavClick} icon={<HomeIcon/>}>Home</NavLink>
                {user?.role === Role.USER && <NavLink page={Page.USER_DASHBOARD} currentPage={currentPage} onNavigate={handleMobileNavClick} icon={<TicketIcon/>}>My Bookings</NavLink>}
                {user?.role === Role.ORGANIZER && <NavLink page={Page.ORGANIZER_DASHBOARD} currentPage={currentPage} onNavigate={handleMobileNavClick} icon={<CalendarIcon/>}>My Events</NavLink>}
                {user?.role === Role.ADMIN && <NavLink page={Page.ADMIN_DASHBOARD} currentPage={currentPage} onNavigate={handleMobileNavClick} icon={<LayoutDashboardIcon/>}>Dashboard</NavLink>}
                
                <div className="border-t w-full my-2"></div>

                {user ? (
                    <div className="w-full">
                        <p className="text-sm font-medium px-2 py-2">Welcome, {user.name}</p>
                        <Button variant="secondary" className="w-full" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>Logout</Button>
                    </div>
                ) : (
                    <div className="flex gap-2 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}>Login</Button>
                        <Button className="flex-1" onClick={() => { onSignUpClick(); setMobileMenuOpen(false); }}>Sign Up</Button>
                    </div>
                )}
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;