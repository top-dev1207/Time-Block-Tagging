# TimeROI - Executive Time Management Platform

Transform your time into strategic value with data-driven time analytics and optimization for executives and business leaders.

## 🎯 Overview

TimeROI is a comprehensive time management platform designed specifically for executives who need to optimize their time allocation and maximize their strategic impact. The platform integrates with Google Calendar to provide real-time insights into time investment patterns.

## 🚀 Key Features

### Time Value Framework
- **£10K Activities**: Transformational, strategic planning, vision setting
- **£1K Activities**: High-leverage leadership, key client meetings, team coaching
- **£100 Activities**: Operational oversight, process improvement
- **£10 Activities**: Administrative tasks, low-value activities

### 3R Analysis Framework
- **Revenue (REV)**: Activities that directly generate income
- **Recovery (REC)**: Essential recharge and reflection time
- **Relationships (REL)**: Building and maintaining key connections

### Core Functionality
- ✅ Google Calendar integration with OAuth 2.0
- ✅ Real-time time block categorization and tagging
- ✅ Executive dashboard with ROI analytics
- ✅ Weekly trend analysis and insights
- ✅ Goal setting and progress tracking
- ✅ Secure authentication with NextAuth.js

## 🛠 Technology Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **FullCalendar** - Calendar interface
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations

### Backend
- **NextAuth.js** - Authentication system
- **Prisma** - Database ORM
- **PostgreSQL** - Database (hosted on Supabase)
- **Google Calendar API** - Calendar integration

### State Management
- **Zustand** - Global state management
- **React Hook Form + Zod** - Form handling and validation

## 🎨 Brand Identity

- **Primary Color**: #102C46 (Deep Blue)
- **Design Philosophy**: Executive, premium, data-driven
- **UI/UX**: Clean, professional, analytics-focused

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd time-block-tagging
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create `.env` file with the following variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-url"
   DIRECT_URL="your-direct-postgresql-url"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth & Calendar
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## 📋 Usage

### For Beta Testers (CFOs and Executives)

1. **Access the platform** - Navigate directly to the signup page
2. **Create account** - Register with your executive email
3. **Connect Google Calendar** - Authorize calendar access for time tracking
4. **Start tagging activities** - Categorize your time blocks by value tier and 3R framework
5. **Review insights** - Analyze your time ROI on the dashboard
6. **Set goals** - Define target time allocation for different activity types

### Key Workflows

1. **Time Block Analysis**
   - Import calendar events automatically
   - Tag each event with value tier (£10K, £1K, £100, £10)
   - Categorize by 3R framework (Revenue, Recovery, Relationships)

2. **Dashboard Insights**
   - View time allocation pie charts
   - Track weekly trends
   - Monitor goal progress
   - Export reports for stakeholders

3. **Goal Management**
   - Set weekly hour targets for each value tier
   - Track progress against strategic objectives
   - Receive optimization recommendations

## 🗂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # Authentication endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── calendar/         # Calendar components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── google-calendar.ts # Google Calendar API
│   └── prisma.ts         # Database client
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🧪 Beta Testing Program

We're currently onboarding select CFOs and executives for beta testing. Beta testers will:

- Get early access to new features
- Provide feedback on data insights and analytics
- Help shape the product roadmap
- Receive priority support

## 📊 Analytics & Insights

The platform provides comprehensive analytics including:

- **Time Investment ROI** - Quantify the value of your time allocation
- **Strategic Time %** - Track time spent on high-value activities
- **3R Balance** - Monitor revenue, recovery, and relationship time
- **Weekly Trends** - Identify patterns and optimization opportunities
- **Goal Progress** - Track against strategic time allocation targets

## 🔒 Security & Privacy

- OAuth 2.0 integration with Google
- Secure session management with NextAuth.js
- Data encryption at rest and in transit
- GDPR-compliant data handling
- Executive-grade security standards

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core MVP functionality
- ✅ Google Calendar integration
- ✅ Basic analytics dashboard
- ✅ User authentication

### Phase 2 (Next)
- 🔄 Mobile app development
- 🔄 Advanced AI recommendations
- 🔄 Team collaboration features
- 🔄 Enhanced reporting

### Phase 3 (Future)
- 🚀 Multi-calendar support
- 🚀 Integration with productivity tools
- 🚀 Predictive analytics
- 🚀 Executive coaching insights

## 🤝 Contributing

This is a private beta project. For bug reports or feature requests, please contact the development team.

## 📞 Support

For beta testers and early users:
- Email: support@timeroi.com
- Priority support for CFOs and executive users

---

**TimeROI** - Where Time Meets Strategy
*Developed for executives who understand that time is their most valuable asset.*