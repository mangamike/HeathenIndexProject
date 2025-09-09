# Heathen Index - Norse Mythology Database

## Overview

Heathen Index is a full-stack Norse mythology database application that allows users to browse, search, and manage entries related to Norse mythology. The application features a clean, responsive interface for exploring deities, places, artifacts, concepts, creatures, and events from Norse culture. Users can search through entries, filter by categories, view detailed information, and add new entries to the database.

**Current Status**: Fully functional and ready for use. The application includes sample Norse mythology entries and all core features are working properly.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Session Management**: Express session middleware with PostgreSQL session store
- **Development**: Hot module replacement and error overlay for enhanced developer experience

### Data Storage
- **Database**: PostgreSQL with Neon serverless database for scalable cloud hosting
- **Schema**: Structured tables for entries and users with proper relationships
- **Migrations**: Drizzle Kit for database schema management and version control
- **Validation**: Shared Zod schemas between frontend and backend for data consistency

### Authentication & Authorization
- **Session-based**: Traditional session management with secure cookie storage
- **User Management**: Basic user registration and login functionality
- **Password Security**: Hashed password storage (implementation pending)

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database for cloud hosting and automatic scaling
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **FontAwesome**: Additional icon library for specific UI elements

### Development Tools
- **Vite**: Build tool with TypeScript support and hot reload
- **Drizzle Kit**: Database migration and schema management tool
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Third-party Integrations
- **Google Fonts**: Web fonts (DM Sans, Geist Mono, Fira Code) for typography
- **Replit Integration**: Development environment integration with banner and cartographer plugins
