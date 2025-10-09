# Engineering Games

This is a [Next.js](https://nextjs.org) project featuring interactive engineering games and simulations.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Features

- **Interactive Games**: Stack operations, Queue management, Sorting algorithms
- **Engineering Simulations**: Beam mechanics, Circuit analysis, SHM simulation
- **Graph Editor**: Create and visualize graphs with adjacency lists/matrices
- **Subject-based Learning**: CSE, ECE, and Mechanical Engineering topics

## Build for Production

This project is configured for static export to work with Netlify:

```bash
npm run build
```

The static files will be generated in the `out` directory.

## Deploy on Netlify

The project is configured for Netlify deployment with:
- Static export via Next.js
- Proper routing configuration
- Build optimization for static hosting

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
