import React from 'react';

const Logo = () => (
  <div className="flex items-center justify-center" aria-label="EventEase logo">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
      <path d="M14 6L12 4L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 20.0002L12 9.00024" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.3639 12.9998C20.6279 12.9998 22.4639 14.8358 22.4639 17.0998C22.4639 19.3638 20.6279 21.1998 18.3639 21.1998C16.1009 21.1998 14.2649 19.3638 14.2649 17.0998C14.2649 15.5998 15.0639 14.2998 16.2639 13.5998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.63614 13C3.37214 13 1.53613 14.836 1.53613 17.1C1.53613 19.364 3.37214 21.2 5.63614 21.2C7.89914 21.2 9.73513 19.364 9.73513 17.1C9.73513 15.6 8.93614 14.3 7.73614 13.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="ml-2 text-xl font-bold">EventEase</span>
  </div>
);

export default Logo;