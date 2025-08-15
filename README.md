# AI-Powered Personalized Children's Storybook Generator

A web application that allows users to create unique, personalized children's storybooks. By providing a few simple inputs (character name, theme, moral), the app uses generative AI to write a story, generate illustrations, and compile a downloadable PDF.

---

## 🌟 Key Features

- **Simple & Fun Personalization:** An intuitive, multi-step form guides users through story creation.
- **AI-Generated Story Content:** Uses a powerful LLM (e.g., Google Gemini) to write page-by-page story content.
- **AI-Generated Illustrations:** Creates page illustrations via a text-to-image model (e.g., Stable Diffusion).
- **Multiple Art Styles:** Choose from styles like Cartoon, Watercolor, or Fantasy.
- **Instant PDF Generation:** Compiles text and images into a high-quality, downloadable PDF.
- **Fully Responsive UI:** Works on desktop and mobile devices.

---

## ⚙️ How It Works

The system coordinates frontend and backend services to generate text and images, then compiles them into a PDF:

1. **The Story Wizard:** User fills a form with:
   - Main character's name
   - Friend/sidekick
   - Setting
   - Moral or lesson
   - Chosen art style
2. **API Request:** Frontend posts data to `/api/generate-story`.
3. **Text Generation:** Backend creates a meta-prompt and calls an LLM (via Vercel AI SDK / Google Gemini) returning structured JSON: story pages + image prompts.
4. **Image Generation:** For each page, backend calls `/api/generate-images` to create illustrations.
5. **Data Aggregation:** Backend combines story text and image URLs into a final JSON response.
6. **PDF Compilation & Download:** Frontend renders a PDF using `@react-pdf/renderer` or `jsPDF` and offers a download link.

---

## 🛠️ Tech Stack & Architecture

This project uses a modern full-stack TypeScript architecture.

### Frontend

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** HeroUI or Shadcn
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **State Management:** TanStack Query
- **PDF Generation:** @react-pdf/renderer or jsPDF

### Backend

- **Environment:** Node.js (Next.js API routes)
- **AI Text Generation:** Vercel AI SDK + Google Gemini
- **AI Image Generation:** Stability AI (Stable Diffusion) or Gemini

### Deployment

- **Platform:** Vercel

---

## 🧠 Elevating the Project: Novelty & Advanced Features

The core idea exists elsewhere; the novelty here is the execution — solving real UX problems and adding thoughtful features. Below are three angles to make the project stand out; pick one or combine them.

### 1) Character Consistency

Problem: AI-generated illustrations often show inconsistent character appearances. Solution: generate a structured `character_sheet` alongside the story and inject it into every image prompt to keep appearances consistent across pages.

Example: prepend "who has curly red hair, bright green eyes, and wears a yellow raincoat with blue boots" to every image prompt for "Lily." This creates a cohesive character pipeline.

### 2) Photo-to-Story Personalization

Allow users to upload an image (toy, drawing, photo). Use a vision-capable model (e.g., Gemini Vision) to describe the image and seed the story. This enables deep personalization and multi-modal input.

### 3) Educational Companion

Prompt the LLM for additional structured outputs: key vocabulary (3–5 words), discussion questions (2–3), and an activity idea. Render these as special pages in the PDF (Activity Corner), using different templates in `@react-pdf/renderer`.

---

## 🔮 Future Enhancements

- **User Accounts & Gallery:** Save generated books to user profiles.
- **Interactive Preview:** Use `<PDFViewer>` to preview books before download.
- **More Customization:** Page count, character traits, photo uploads.
- **"Surprise Me" Feature:** Quickly generate an idea for the user.
- **Physical Printing:** Integrate with print-on-demand services.
