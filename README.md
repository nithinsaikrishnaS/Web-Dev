# AuditPro - Professional Auditing Platform

A comprehensive full-stack auditing web application built with Next.js and Supabase, featuring multi-role functionality for admins, users, suppliers, and auditors.

## Features

### 🔐 Multi-Role Authentication
- **Admin Dashboard**: Manage businesses, users, categories, and audit templates
- **User Portal**: View businesses in your region
- **Supplier Portal**: Manage supply tasks with status tracking
- **Auditor Mobile App**: Complete audits with photo capture and checklist

### 🏢 Business Management
- Dynamic business categories with JSON-driven templates
- Automatic audit task generation on business onboarding
- Region-based business filtering (city/pincode)

### 📋 Audit System
- JSON-driven audit templates with multiple question types
- Photo capture and submission
- Real-time status tracking
- Payout calculation and management

### 🚚 Supply Chain Management
- Task management with status updates (To Do, In Progress, Sent, Delivered)
- Supplier verification system
- Service area management

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Mobile**: React Native with Expo
- **Authentication**: Supabase Auth
- **Payments**: Stripe (for future payout integration)
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd auditpro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Run the SQL scripts in the `scripts/` folder in order:
     - `01-create-tables.sql`
     - `02-create-policies.sql`
     - `03-seed-data.sql`

4. **Configure environment variables**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   Fill in your Supabase credentials and other configuration.

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Set up mobile app** (optional)
   \`\`\`bash
   cd mobile-app
   npm install
   expo start
   \`\`\`

## Database Schema

### Core Tables
- `users` - User profiles with role-based access
- `businesses` - Business information and location data
- `categories` - Business categories with payout amounts
- `audit_templates` - JSON-driven audit checklists
- `audit_tasks` - Assigned audit tasks
- `audit_submissions` - Completed audit reports
- `suppliers` - Supplier profiles and service areas
- `supply_tasks` - Supply chain task management
- `payouts` - Payment tracking and processing

### Key Features
- Row Level Security (RLS) for data protection
- Automatic audit task creation triggers
- JSON-based template system for flexibility
- Region-based data filtering

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Admin APIs
- `GET /api/admin/businesses` - List all businesses
- `POST /api/admin/businesses` - Create new business
- `GET /api/admin/users` - List all users
- `POST /api/admin/categories` - Create category
- `POST /api/admin/templates` - Create audit template

### User APIs
- `GET /api/user/businesses` - Get regional businesses
- `GET /api/user/profile` - Get user profile

### Auditor APIs
- `GET /api/auditor/tasks` - Get assigned tasks
- `POST /api/auditor/submissions` - Submit audit report

## Mobile App

The React Native mobile app is designed specifically for auditors and includes:

- **Authentication**: Secure login for auditors
- **Task Management**: View assigned audit tasks
- **Photo Capture**: Take photos during audits
- **Offline Support**: Work without internet connection
- **Real-time Sync**: Sync data when connected

### Mobile App Setup
\`\`\`bash
cd mobile-app
npm install
expo start
\`\`\`

## Deployment

### Web Application
1. Deploy to Vercel:
   \`\`\`bash
   vercel --prod
   \`\`\`

2. Configure environment variables in Vercel dashboard

### Mobile App
1. Build for production:
   \`\`\`bash
   expo build:android
   expo build:ios
   \`\`\`

2. Submit to app stores

## Security Features

- Row Level Security (RLS) policies
- Role-based access control
- Secure authentication with Supabase Auth
- Data validation and sanitization
- HTTPS enforcement

## Future Enhancements

- [ ] Stripe integration for automated payouts
- [ ] Advanced analytics and reporting
- [ ] Push notifications for mobile app
- [ ] Offline mode for mobile audits
- [ ] Multi-language support
- [ ] Advanced audit template builder
- [ ] Integration with external business databases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**Note**: This is a Proof of Concept (POC) designed to demonstrate the full-stack auditing platform capabilities. The MVP version will include additional features and optimizations based on client feedback.
