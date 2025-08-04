# Overview

This is Nandi Coffee Advisory - a specialized coffee farming AI assistant designed to help farmers in the Nandi region of Kenya identify and treat plant diseases. The application combines modern web technologies with AI-powered diagnosis capabilities, enabling farmers to upload images, record voice descriptions, or provide text descriptions of symptoms to receive comprehensive disease analysis and treatment recommendations.

The system provides personalized farming guidance, seasonal tips, emergency contact information, and maintains a history of previous diagnoses to help farmers track their crop health over time.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Mobile-First Design**: Responsive design with bottom navigation for mobile optimization

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with tsx for rapid development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Strategy**: In-memory storage implementation for development with interface for easy database integration

## File Storage
- **Object Storage**: Google Cloud Storage for image and audio file storage
- **Upload Strategy**: Direct-to-cloud uploads using presigned URLs
- **File Management**: Uppy.js for robust file upload handling with progress tracking
- **Access Control**: Custom ACL system for object-level permissions

## Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not fully implemented
- **Planned**: Session-based authentication with user profiles
- **Authorization**: Object-level access control with custom ACL policies

## Key Features Architecture
- **Multi-Modal Diagnosis**: Support for image upload, voice recording, and text input with enhanced pattern matching
- **AI Integration**: Advanced AI diagnosis system with confidence scoring and detailed analysis notes for coffee diseases
- **Image Analysis**: AI vision capabilities for plant disease detection with confidence metrics and detailed analysis
- **Text Analysis**: Flexible symptom pattern matching recognizing coffee diseases (Leaf Rust, Berry Disease, Wilt Disease, etc.)
- **Seasonal Guidance**: Context-aware farming tips based on current season
- **History Tracking**: Complete diagnosis history with search and filtering
- **Emergency Contacts**: Quick access to agricultural extension services

## Development Architecture
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reload**: Vite dev server with Express integration
- **Type Safety**: Full-stack TypeScript with shared schema validation using Zod
- **Code Organization**: Clear separation between client, server, and shared code
- **Progressive Web App**: PWA-enabled for Android installation and offline functionality
- **Mobile-First**: Optimized for Android phones with install prompts and native-like experience

# External Dependencies

## Core Infrastructure
- **Database**: Neon Database (PostgreSQL) - serverless database hosting
- **Object Storage**: Google Cloud Storage - file storage and content delivery
- **Development Platform**: Replit - development environment with integrated services

## Frontend Libraries
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **File Uploads**: Uppy.js ecosystem for robust file handling
- **State Management**: TanStack Query for server state synchronization
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side navigation

## Backend Services
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **File Processing**: Google Cloud Storage SDK
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds

## Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Code Quality**: TypeScript strict mode, ESM modules
- **Replit Integration**: Cartographer and runtime error overlay plugins