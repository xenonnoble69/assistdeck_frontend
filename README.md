# AssistDeck🧱 - AI-Powered Productivity Platform

A modern web application built with Next.js, featuring glassmorphism design and AI-powered productivity tools for students and entrepreneurs.

## 🚀 Features

- **Beautiful Glassmorphism UI**: Modern design with backdrop-blur effects
- **User Authentication**: Secure registration and login system
- **Role-Based Access**: Student and Entrepreneur plans
- **Dashboard**: Personalized productivity dashboard
- **API Integration**: Connected to backend services
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: JWT tokens
- **API**: RESTful endpoints
- **Database**: PostgreSQL

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

## 🔧 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd assistdeck-website
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8081
DATABASE_URL=postgres://assistuser:ASSISTDECK@localhost:5432/assistdeck?sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 API Endpoints

The application connects to the following endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User authentication  
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/role` - Update user role

## 📱 Pages

- **Landing Page** (`/`) - Marketing page with features and pricing
- **Registration** (`/register`) - User signup with role selection
- **Login** (`/login`) - User authentication
- **Dashboard** (`/dashboard`) - User productivity dashboard

## 💰 Pricing Plans

- **Student**: $53/month - Personal goals, AI chat, Basic analytics
- **Entrepreneur**: $170/month - Everything + Team features, Advanced analytics

## 🔒 Authentication Flow

1. User registers with name, email, password, and role selection
2. System creates account via `/api/register`
3. User is automatically logged in via `/api/login`
4. Role is updated via `/api/users/role`
5. JWT token is stored for session management

## 🎨 Design System

- **Primary Color**: #6B21A8 (Deep Purple)
- **Secondary Color**: #8B5CF6 (Soft Purple)
- **Background**: Gradient from slate to purple
- **Glass Effect**: backdrop-blur with white/10 opacity
- **Typography**: Inter font family

## 🔄 Configuration

To change the API URL or database connection:

1. Update `.env.local` file
2. Restart the development server

## 📦 Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
