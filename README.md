# EventEase - AI-Powered Event Booking Platform

EventEase is a modern, responsive, and feature-rich frontend application for discovering, booking, and managing events. It leverages the power of the Google Gemini API to provide intelligent features, such as AI-generated event descriptions and images, creating a seamless experience for both event-goers and organizers.

This project serves as a showcase for building a sophisticated web application with a focus on great UI/UX, responsiveness, and practical AI integration.

## ✨ Key Features

- **AI-Powered Event Creation**: Organizers can automatically generate compelling event descriptions and unique, high-quality event images with a single click.
- **Dynamic Event Discovery**: A beautiful homepage with a powerful search bar and category filters to help users find events instantly.
- **Interactive Event Details**: A comprehensive modal view for each event, showing all necessary information in a clean, accessible layout.
- **AI Chatbot Assistant**: An integrated chatbot, powered by Gemini, helps users find events and get answers to their questions in real-time.
- **Role-Based Dashboards**: Separate, tailored dashboard views for different user roles:
    - **User**: View and manage your event bookings, set reminders, and add events to your calendar.
    - **Organizer**: Create, edit, delete, and manage your own events. View a list of attendees for each event.
    - **Admin**: Access an analytics dashboard with charts and key metrics like total revenue, user count, and event statistics.
- **Light & Dark Mode**: A sleek theme toggle allows users to switch between light and dark modes for comfortable viewing.
- **Fully Responsive Design**: The entire application is mobile-friendly and provides a seamless experience across all devices, from phones to desktops.
- **Modern UI Components**: A consistent and beautiful UI built with custom, reusable components.

## 🚀 Tech Stack

- **Core Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Google Gemini API (@google/genai)](https://ai.google.dev/)
  - `gemini-2.5-flash` for text generation (descriptions, chatbot).
  - `imagen-4.0-generate-001` for image generation.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first CSS framework.
- **Data Visualization**: [Recharts](https://recharts.org/) for the analytics dashboard charts.
- **Project Structure**: ES6 Modules.

## ⚙️ Getting Started

This is a frontend-only application that uses mock data for users, events, and bookings, all managed within the browser's state. There is no backend database connected. All data will reset upon refreshing the page.

### User Roles & Login Credentials

You can log in and test the application using the following mock accounts. The password for all accounts can be any non-empty string (e.g., "password").

| Role      | Email                   | Description                                             |
|-----------|-------------------------|---------------------------------------------------------|
| **User**      | `alice@example.com`     | Can browse and book events. Has a "My Bookings" dashboard.     |
| **Organizer** | `bob@example.com`       | Can create and manage their own events. Has a "My Events" dashboard. |
| **Admin**     | `charlie@example.com`   | Has access to the site-wide analytics dashboard.        |

## 📁 Project Structure

```
.
├── components/         # Reusable React components
│   ├── ui/             # Basic UI elements (Button, Card, Input, etc.)
│   ├── AnalyticsDashboard.tsx
│   ├── BookingCard.tsx
│   ├── Chatbot.tsx
│   ├── EventCard.tsx
│   ├── EventForm.tsx
│   ├── Header.tsx
│   └── ...and more
├── hooks/              # Custom React hooks
│   └── useEventData.ts   # Manages all mock data and state logic
├── services/           # Services for external APIs
│   └── geminiService.ts  # Handles all calls to the Gemini API
├── types.ts            # TypeScript type definitions for the project
├── App.tsx             # Main application component, handles routing and state
├── index.html          # The main HTML file
├── index.tsx           # The entry point of the React application
└── README.md           # This file
```
# eventease
