# Manager Bot Support Dashboard

A faithful recreation of the Manager Bot Support dashboard interface using Next.js, React, Tailwind CSS, and shadcn/ui.

## Features

- **Dark Theme**: Modern black theme with subtle gray accents
- **Responsive Layout**: Sidebar navigation with main content area
- **Interactive Components**: 
  - Navigation menu with active states
  - Search bar with quick action buttons
  - Tab navigation (For you, Sales, Money, Automations)
  - Information cards with hover effects
  - User profile section
- **Business Intelligence Cards**:
  - Financial overview with three key metrics
  - Happy Hour suggestion
  - Daily cash snapshot
  - Transaction summary

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles and Tailwind imports
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main dashboard page
├── components/
│   └── ui/
│       └── button.tsx    # shadcn/ui Button component
├── lib/
│   └── utils.ts          # Utility functions
├── tailwind.config.ts    # Tailwind configuration
└── package.json          # Project dependencies
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React

## Design Details

The dashboard accurately recreates:
- Olympia Greek restaurant branding with clover logo
- Left sidebar with navigation and history
- Header with status indicator buttons (Store info, Employee info, Device info)
- Central search interface with contextual quick actions
- Tab-based content filtering
- Business intelligence cards with:
  - Financial metrics display
  - Actionable insights and recommendations
  - Daily operational summaries
- User profile section at bottom of sidebar

## Customization

To customize the dashboard:

1. **Colors**: Edit the CSS variables in `app/globals.css`
2. **Navigation Items**: Modify the `navItems` and `historyItems` arrays in `app/page.tsx`
3. **Business Data**: Update the card content in the main content area
4. **Branding**: Change the logo, business name, and email in the sidebar header

## Building for Production

```bash
npm run build
npm start
```

## License

This project is a design recreation for educational purposes.

