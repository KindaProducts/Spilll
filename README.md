# Spilll - AI-Powered Lightroom Preset Generator

Spilll is a modern web application that uses AI to generate custom Lightroom presets based on user preferences and uploaded images.

## Features

- AI-powered preset generation
- User account management with email verification
- Secure payment processing with LemonSqueezy
- Responsive design for all devices
- Desktop application for offline use

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Email**: Mailgun
- **Payment**: LemonSqueezy
- **Hosting**: Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Mailgun account
- LemonSqueezy account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/spilll.git
   cd spilll
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your actual credentials.

4. Set up the database:
   ```
   npx prisma migrate dev
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## User Flow

1. User visits the landing page
2. User subscribes to a plan via LemonSqueezy
3. After successful payment, user is redirected to the account creation page
4. User creates an account with email and password
5. Verification email is sent to the user
6. User verifies email by clicking the link
7. User can now log in and access premium features

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with the following settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `build`

### Backend (Render)

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure environment variables
4. Set the build command to `npm install && npm run build`
5. Set the start command to `npm start`

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

### Authentication

- `POST /api/create-account` - Create a new user account
- `POST /api/verify-email` - Verify user email
- `POST /api/resend-verification` - Resend verification email

### Presets

- `POST /api/generate-preset` - Generate a new preset
- `GET /api/presets` - Get user's presets
- `GET /api/presets/:id` - Get a specific preset
- `DELETE /api/presets/:id` - Delete a preset

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [LemonSqueezy](https://www.lemonsqueezy.com/)
- [Mailgun](https://www.mailgun.com/) 