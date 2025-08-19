# StorySprout 📚✨

An AI-powered web application that creates personalized children's storybooks with custom illustrations. Built with Next.js 15, React 19, Supabase, and Google's Gemini AI.

## 🌟 Features

### � User Authentication & Management

- **Secure Authentication**: Email/password and social login (Google, GitHub) via Supabase Auth
- **User Profiles**: Personalized user accounts with preferences and settings
- **Story Library**: Save, organize, and manage your created stories
- **Collections**: Organize stories into custom folders/collections
- **Public Sharing**: Share stories with secure, shareable links

### �📖 Story Generation

- **Personalized Stories**: Create unique stories tailored to your child's name, age, and preferences
- **AI-Powered Content**: Leverage Google's Gemini AI for high-quality story generation
- **Multiple Story Lengths**: Choose from short (6 pages), medium (12 pages), or long (20 pages) stories
- **Age-Appropriate Content**: Stories adapted for different age groups (2-4, 4-6, 6-8, 8-10 years)
- **Educational Value**: Each story includes moral lessons, vocabulary building, and discussion questions

### 🎨 Visual Customization

- **AI-Generated Illustrations**: Automatic image generation using Google's Gemini 2.0 Flash Preview
- **Multiple Art Styles**: Choose from watercolor, cartoon, realistic, digital art, and more
- **Character Consistency**: Maintains consistent character appearance throughout the story
- **Image Upload Support**: Upload inspiration images to influence the story theme and visuals

### 🎯 Interactive Features

- **Step-by-Step Creation**: Guided 5-step process for story creation
- **Character Customization**: Define main character appearance and personality traits
- **Story Settings**: Choose from various environments (magical forest, space, underwater, etc.)
- **Theme Selection**: Pick themes and moral lessons for educational value
- **Difficulty Levels**: Beginner, intermediate, and advanced vocabulary options

### 📱 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Built-in theme switching with next-themes
- **Progress Tracking**: Visual progress indicator throughout the creation process
- **PDF Export**: Download generated stories as beautifully formatted PDF files
- **Modern UI**: Built with HeroUI and Shadcn UI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Google Generative AI API key
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abdo12KM/children-storybook-generator.git
   cd children-storybook-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Database (PostgreSQL via Supabase)
   DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]

   # Google AI API
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

   # Application URL (for OAuth redirects)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   ```bash
   # Generate and apply database migrations
   pnpm drizzle-kit generate
   pnpm drizzle-kit push
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **React**: React 19 with modern hooks and server components
- **UI Components**:
  - HeroUI for primary components
  - Tailwind CSS for styling
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React hooks and context

### Backend & Database

- **Authentication**: Supabase Auth with social providers
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM with TypeScript
- **API Routes**: Next.js API routes for server-side logic

### AI Integration

- **Story Generation**: Google Gemini 2.5 Pro for text
- **Image Generation**: Google Gemini 2.0 Flash Preview for illustrations
- **PDF Generation**: jsPDF for story export

### Development Tools

- **TypeScript**: Full type safety
- **ESLint & Prettier**: Code formatting and linting
- **Drizzle Kit**: Database migrations and management
- **Tailwind CSS**: Utility-first styling

## �️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── landing/           # Landing page
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   └── create/            # Story creation page
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client configuration
├── services/              # Business logic and API calls
├── db/                    # Database schema and configuration
├── types/                 # TypeScript type definitions
└── constants/             # Application constants
```

## 🔧 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User authentication and profiles
- **stories**: Generated stories with metadata
- **story_images**: Individual page images
- **user_preferences**: User settings and defaults
- **story_collections**: Organization folders
- **story_collection_items**: Many-to-many relationships
- **story_shares**: Public sharing functionality

See `DATABASE.md` for detailed schema documentation.

## 🎯 User Flow

### For New Users

1. **Landing Page**: Learn about StorySprout features
2. **Sign Up**: Create account with email or social login
3. **Dashboard**: Welcome screen with quick start guide
4. **Create Story**: 5-step guided story creation process
5. **Story Library**: View and organize created stories

### For Returning Users

1. **Sign In**: Email/password or social login
2. **Dashboard**: Overview of recent stories and collections
3. **Library**: Browse and search story collection
4. **Create**: Generate new stories
5. **Share**: Share stories with family and friends

## 🔐 Authentication & Security

- **Supabase Auth**: Enterprise-grade authentication
- **Social Providers**: Google and GitHub OAuth
- **Row Level Security**: Database-level security policies
- **Session Management**: Secure session handling
- **Protected Routes**: Middleware-based route protection

## � API Documentation

### Authentication Endpoints

- `POST /api/auth/sync-user` - Sync user data after authentication

### Story Endpoints

- `POST /api/generate-story` - Generate new story with AI
- `POST /api/generate-image` - Generate story illustrations
- `POST /api/stories/save` - Save generated story to database

### Future Endpoints (to be implemented)

- `GET /api/stories` - List user stories
- `GET /api/collections` - List user collections
- `POST /api/stories/share` - Create shareable link

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Environment Setup

### Supabase Setup

1. Create a new Supabase project
2. Copy the project URL and anon key
3. Set up authentication providers (Google, GitHub)
4. Configure database with provided schema

### Google AI Setup

1. Get Google Generative AI API key
2. Enable Gemini models in your Google Cloud project
3. Add API key to environment variables

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check Supabase connection pooling settings

2. **Authentication Issues**
   - Verify Supabase keys are correct
   - Check OAuth redirect URLs

3. **Image Generation Failures**
   - Verify Google AI API key
   - Check API quotas and limits

## � Production Deployment

### Pre-deployment Checklist

Before deploying to production, run the production readiness check:

```bash
pnpm check-production
```

This will scan your codebase for:

- Development-only code (console.log, TODO comments)
- Missing environment variables
- Improper error handling in API routes
- Security vulnerabilities

### Environment Variables for Production

Ensure all required environment variables are set:

```env
# Database
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Deployment Platforms

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Docker Deployment

```bash
# Build production image
docker build -t storyssprout .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.production storyssprout
```

#### Manual Server Deployment

```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Start production server
npm start
```

### Post-deployment Verification

- [ ] Test user registration and login
- [ ] Verify story generation functionality
- [ ] Check image generation capabilities
- [ ] Test PDF download feature
- [ ] Validate email notifications
- [ ] Confirm database connections

### Performance Optimization

- Enable Next.js Image Optimization
- Configure CDN for static assets
- Set up database connection pooling
- Implement proper caching strategies
- Monitor API rate limits

### Security Considerations

- Enable HTTPS/SSL certificates
- Configure proper CORS policies
- Set up rate limiting for API endpoints
- Implement proper input validation
- Enable security headers in Next.js config

## �🔮 Future Enhancements

- [ ] Story templates and presets
- [ ] Advanced story analytics
- [ ] Collaborative story creation
- [ ] Voice narration integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Print-ready formatting
- [ ] Story series and sequels
- [ ] Community story sharing
- [ ] Premium subscription features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for authentication and database infrastructure
- **Google Generative AI** for powerful AI capabilities
- **Vercel** for Next.js framework and deployment platform
- **HeroUI** for beautiful, accessible components
- **Tailwind CSS** for utility-first styling
- **Lucide** for comprehensive icon library

---

**Built with ❤️ for creating magical stories that inspire young minds**
