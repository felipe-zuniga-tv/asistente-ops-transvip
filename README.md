# Transvip Operations Portal

A modern web application built with Next.js 14 for managing Transvip Chile's operations.

## Features

- 🔐 Secure authentication system
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📱 Responsive design for all devices
- 🔄 Real-time updates with SWR
- 🌐 Supabase integration
- 🎭 Role-based access control

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** Supabase
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Data Fetching:** SWR
- **Authentication:** Custom auth with jose
- **Date Handling:** date-fns

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Configure your environment variables in `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `app/` - Next.js 14 app directory containing pages and API routes
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and shared logic
- `types/` - TypeScript type definitions
- `utils/` - Helper functions
- `public/` - Static assets
- `messages/` - Internationalization files
- `supabase/` - Supabase configuration and types

## Development

The project uses several quality tools:

- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting

## Environment Variables

Required environment variables:

- Database configuration
- Authentication secrets
- API endpoints
- Feature flags

See `.env.example` for all required variables.

## License

Private - All rights reserved © Transvip Chile
