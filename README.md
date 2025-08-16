# StorySprout 📚✨

An AI-powered web application that creates personalized children's storybooks with custom illustrations. Built with Next.js 15, React 19, and Google's Gemini AI.

## 🌟 Features

### 📖 Story Generation

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
   Create a `.env.local` file in the root directory:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **React**: React 19 with modern hooks and server components
- **UI Components**:
  - HeroUI and Shadcn for primary components
  - Tailwind CSS for styling
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation

### Backend & AI

- **API Routes**: Next.js API routes for server-side logic
- **AI Integration**:
  - Google Gemini 2.5 Pro for story text generation
  - Google Gemini 2.0 Flash Preview for story images generation
- **PDF Generation**: jsPDF for story export

### Development Tools

- **TypeScript**: Full type safety
- **ESLint & Prettier**: Code formatting and linting
- **PostCSS**: CSS processing
- **Tailwind CSS v4**: Latest styling framework

## 🎨 Story Creation Process

### Step 1: Child Details

- Enter child's name and age
- Select appropriate age group for content difficulty

### Step 2: Main Character

- Define the main character type
- Describe appearance and personality traits
- Choose character traits from predefined options

### Step 3: Story Setting

- Select story environment (forest, castle, space, etc.)
- Choose story theme and moral lesson
- Set vocabulary difficulty level

### Step 4: Art Style & Photo

- Choose from multiple art styles
- Optionally upload inspiration images
- Preview style examples

### Step 5: Theme & Message

- Finalize story theme
- Select moral lesson and educational focus
- Choose story length

## 🔧 Configuration

### Environment Variables

```env
# Required for AI features
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Optional: Custom API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Story Parameters

Configure story generation in `constants/story.ts`:

- Story lengths and page counts
- Vocabulary levels
- Age group settings
- Theme options

## 🎯 Features in Detail

### AI Story Generation

- Uses Google's Gemini Pro for creative, age-appropriate storytelling
- Generates complete narratives with proper pacing and character development
- Includes educational elements like vocabulary words and moral lessons
- Creates discussion questions for parent-child interaction

### Image Generation

- Utilizes Google's Gemini 2.0 Flash Preview for illustration creation
- Maintains character consistency across all story pages
- Supports multiple art styles and custom themes
- Fallback to placeholder images if API is unavailable

### Educational Value

- Age-appropriate vocabulary based on selected difficulty
- Moral lessons and character development themes
- Discussion questions for comprehension and engagement
- Activity suggestions for extended learning

## 🔄 Development Workflow

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Code Formatting
pnpm prettier     # Format codebase with Prettier
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for consistent formatting
- Zod for runtime validation

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Generative AI** for powerful AI capabilities
- **Vercel** for Next.js framework and deployment platform
- **HeroUI** and **Shadcn UI** for beautiful, accessible components
- **Tailwind CSS** for utility-first styling
- **Lucide** for comprehensive icon library

## 🆘 Support & Issues

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Abdo12KM/children-storybook-generator/issues) page
2. Create a new issue with detailed description
3. Include environment details and error messages

## 🔮 Future Enhancements

- [ ] Improved image generation quality and consistency across all story pages
- [ ] Advanced character customization
- [ ] User authentication and profiles
- [ ] Saved stories and user libraries
- [ ] Story templates and presets
- [ ] Story sharing and community features
- [ ] Story series and sequels
- [ ] Multi-language support
- [ ] Interactive story elements
- [ ] Voice narration for stories
- [ ] Print-ready formatting options

---

**Built with ❤️ for creating magical stories that inspire young minds**
