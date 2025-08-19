# Database Setup and Schema

This document explains the database schema and setup for the children's storybook generator application using Drizzle ORM and Supabase.

## Schema Overview

### Tables

#### 1. `users`

Stores user authentication and profile information.

- `id` - UUID primary key
- `email` - Unique email address
- `full_name` - User's full name
- `avatar_url` - Profile picture URL
- `created_at`, `updated_at` - Timestamps
- `last_sign_in` - Last login timestamp
- `is_active` - Account status

#### 2. `stories`

Main table for storing generated stories and their metadata.

- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `title` - Story title
- `child_name` - Name of the child the story is for
- `child_age` - Age range of the child
- Story configuration fields (`main_character`, `setting`, `theme`, etc.)
- Generated content (`story_content` as JSONB)
- Metadata (`page_count`, `word_count`, etc.)
- Status flags (`is_public`, `is_favorite`)

#### 3. `story_images`

Stores individual page images for stories.

- `id` - UUID primary key
- `story_id` - Foreign key to stories table
- `page_number` - Page position in the story
- `image_url` - URL to the generated image
- `image_prompt` - AI prompt used to generate the image
- `alt_text` - Accessibility text

#### 4. `user_preferences`

Stores user preferences and default settings.

- Default story generation settings
- UI preferences (theme, language)
- Notification preferences

#### 5. `story_collections`

Organizes stories into collections/folders.

- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `name` - Collection name
- `description` - Optional description
- `color` - UI color theme
- `is_default` - Flag for default collection

#### 6. `story_collection_items`

Junction table for many-to-many relationship between stories and collections.

#### 7. `story_shares`

Manages public sharing of stories with shareable links.

- `share_token` - Unique token for public access
- `expires_at` - Optional expiration date
- `view_count` - Number of times shared story was viewed

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Google AI (existing)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

### 2. Install Dependencies

```bash
pnpm add drizzle-orm postgres drizzle-zod zod nanoid
pnpm add -D drizzle-kit
```

### 3. Generate and Run Migrations

```bash
# Generate migration from schema
pnpm drizzle-kit generate

# Push to database (for development)
pnpm drizzle-kit push

# Or apply migrations (for production)
pnpm drizzle-kit migrate
```

### 4. Database Connection

The database connection is configured in `db/index.ts` using the `DATABASE_URL` environment variable.

## Service Classes

### UserService (`services/user.ts`)

- User CRUD operations
- User preferences management
- Authentication helpers

### DatabaseStoryService (`services/database-story.ts`)

- Story CRUD operations
- Story filtering and pagination
- Story sharing functionality

### CollectionService (`services/collections.ts`)

- Collection management
- Story organization
- Collection statistics

## Usage Examples

### Creating a New User

```typescript
import { UserService } from "@/services";

const newUser = await UserService.createUser({
  email: "user@example.com",
  fullName: "John Doe",
});
```

### Saving a Generated Story

```typescript
import { DatabaseStoryService } from "@/services";

const story = await DatabaseStoryService.createStory({
  userId: "user-id",
  childName: "Alice",
  childAge: "6-8",
  mainCharacter: "brave princess",
  setting: "magical forest",
  theme: "adventure",
  artStyle: "watercolor",
  storyLength: "medium",
  difficulty: "intermediate",
  storyContent: generatedStoryData,
  pageCount: 12,
  wordsPerPage: 60,
  totalWords: 720,
});
```

### Getting User's Stories

```typescript
const stories = await DatabaseStoryService.getUserStories(userId, {
  limit: 10,
  offset: 0,
  theme: "adventure",
  isFavorite: true,
});
```

### Creating a Shareable Link

```typescript
const shareLink = await DatabaseStoryService.createShareLink(storyId, 30); // Expires in 30 days
console.log(`Share URL: /shared/${shareLink.shareToken}`);
```

## Integration with Existing Code

### Updating Story Generation Hook

Modify `hooks/use-story-generator.ts` to save stories to the database after generation:

```typescript
// After successful story generation
const savedStory = await DatabaseStoryService.createStory({
  userId: currentUser.id,
  ...storyData,
  storyContent: generatedStory,
  pageCount: generatedStory.pages.length,
  totalWords: calculateTotalWords(generatedStory),
});
```

### Adding Authentication Context

Create an authentication context to manage user sessions and integrate with the database services.

## Drizzle Studio

For database management and visualization:

```bash
pnpm drizzle-kit studio
```

This opens a web interface at `http://localhost:4983` for browsing and editing database content.

## Migration Management

- All schema changes should be made in `db/schema.ts`
- Run `pnpm drizzle-kit generate` to create migration files
- Migration files are stored in `supabase/migrations/`
- Always backup production data before running migrations

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS on Supabase tables
2. **User Isolation**: All queries should filter by `user_id` to prevent data leakage
3. **Input Validation**: Use Zod schemas for runtime validation
4. **Share Token Security**: Use cryptographically secure tokens for sharing

## Performance Optimization

1. **Indexes**: Add indexes on frequently queried columns
2. **Pagination**: Always use limit/offset for large result sets
3. **Connection Pooling**: Configure connection pooling for production
4. **Query Optimization**: Use joins instead of multiple queries when possible
