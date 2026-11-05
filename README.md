StudioSpace – Creative Workspace Sharing Platform

Live Website: https://studio-space-client-gules.vercel.app

PROJECT OVERVIEW

StudioSpace is a creative workspace-sharing platform that connects studio owners with individuals and professionals looking for creative spaces. Users can explore studios, view detailed information, make reservations, and manage their bookings. Studio owners can list, update, and manage their creative workspaces.

The platform aims to make finding and booking creative spaces simple, accessible, and convenient.

KEY FEATURES

• Explore Studios: Browse available creative studios across different categories, including photography, music, and other creative workspaces.

• Advanced Search & Filtering: Search studios by name, category, availability, and sorting preferences.

• Studio Details: View detailed studio information, including images, hourly rates, security deposits, capacity, location, amenities, and descriptions.

• User Authentication: Secure user registration and login using Better Auth, with social authentication integration.

• Google Authentication: Integration with Google OAuth for social login and registration.

• Studio Management: Authenticated users can add, edit, view, and delete their own studio listings.

• Image Upload: Upload studio images through ImgBB image hosting integration.

• Booking System: Users can select booking dates and times, view booking summaries, and calculate total booking costs.

• Booking Management: Users can view their reservations, check booking statuses, and cancel pending bookings.

• Booking Conflict Prevention: The system checks existing confirmed reservations to prevent overlapping bookings.

• Protected API: Backend API endpoints use JWT authentication to protect user-specific operations.

• Responsive Interface: Modern user interface with responsive layouts and light/dark theme support.

TECHNOLOGY STACK

Frontend:
• Next.js
• React
• TypeScript
• Tailwind CSS
• shadcn/ui
• Lucide React
• React Hot Toast

Backend:
• Node.js
• Express.js
• MongoDB
• MongoDB Atlas
• Better Auth
• JSON Web Token (JWT)

Authentication & Services:
• Better Auth
• Google OAuth 2.0
• ImgBB API

Deployment:
• Vercel (Frontend)
• Vercel (Backend)

INSTALLATION AND LOCAL SETUP

Follow these instructions to run StudioSpace locally.

Prerequisites:

• Node.js (LTS version recommended)
• npm
• MongoDB Atlas account
• Google Cloud OAuth credentials
• ImgBB API key

1. CLONE THE REPOSITORIES

Clone the frontend repository:

git clone https://github.com/harun-codes/StudioSpace-Client

Clone the backend repository:

git clone https://github.com/harun-codes/StudioSpace-Server

2. INSTALL DEPENDENCIES

Frontend:

cd StudioSpace-Client
npm install

Backend:

cd StudioSpace-Server
npm install

3. CONFIGURE ENVIRONMENT VARIABLES

Create a .env.local file in the frontend project and configure:

NEXT_PUBLIC_API_URL=[http://localhost:5000]
BETTER_AUTH_URL=[http://localhost:3000]
MONGODB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

Configure the backend .env file:

PORT=5000
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=[http://localhost:3000]

Add the ImgBB API key to the environment file used by your image-upload endpoint.

Note: Use the exact environment variable names required by your implementation. Never expose API keys or database credentials in the frontend.

4. RUN THE BACKEND SERVER

Open the backend project terminal and run:

npm run dev

The backend server should run at:

[http://localhost:5000]

5. RUN THE FRONTEND APPLICATION

Open another terminal and run:

npm run dev

The frontend application should run at:

[http://localhost:3000]

Open the local website in your browser to explore StudioSpace.

EXAMINER TEST CREDENTIALS

The following credentials should be completed with your actual working test accounts before submission.

Test User:
Email: YOUR_TEST_USER_EMAIL
Password: YOUR_TEST_USER_PASSWORD

Studio Owner:
Email: YOUR_OWNER_EMAIL
Password: YOUR_OWNER_PASSWORD

Important: Ensure these accounts exist in the deployed application and that their credentials have been tested before submitting.

PROJECT REPOSITORIES

Frontend:
https://github.com/harun-codes/StudioSpace-Client

Backend:\
https://github.com/harun-codes/StudioSpace-Server

LIVE DEPLOYMENT

Visit the deployed StudioSpace application:
https://studio-space-client-gules.vercel.app/

Developed as an academic project to demonstrate full-stack web development, authentication, database management, API integration, and workspace booking functionality.
