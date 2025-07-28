# AI Development Rules for Timer Dashboard

This document provides guidelines for the AI assistant to follow when developing and modifying this application. The goal is to maintain a clean, consistent, and maintainable codebase.

## Tech Stack Overview

This project is a modern web application built with the following technologies:

-   **Framework**: React (v18) with Vite for a fast development experience.
-   **Language**: TypeScript for type safety and improved developer experience.
-   **UI Components**: shadcn/ui, a collection of beautifully designed components built on top of Radix UI primitives.
-   **Styling**: Tailwind CSS for a utility-first styling approach. Custom theme variables are defined in `src/index.css`.
-   **Routing**: React Router (`react-router-dom`) for all client-side routing.
-   **Data Fetching**: TanStack Query (`@tanstack/react-query`) for managing server state, caching, and asynchronous operations.
-   **Forms**: React Hook Form (`react-hook-form`) for building performant and flexible forms.
-   **Schema Validation**: Zod for defining schemas and validating data, especially with forms.
-   **Icons**: Lucide React for a comprehensive and consistent set of icons.
-   **Notifications**: Sonner for simple and elegant toast notifications.
-   **Date & Time**: `date-fns` and `date-fns-tz` for reliable date and time manipulation.

## Library Usage and Coding Conventions

### 1. Component Strategy

-   **Primary Choice**: Always prioritize using components from the `shadcn/ui` library (`src/components/ui`). These are the building blocks of our UI.
-   **Custom Components**: If a `shadcn/ui` component is not suitable, create a new, single-purpose component in the `src/components` directory.
-   **No Direct Edits**: Do **not** modify the files inside `src/components/ui` directly. If a variation is needed, wrap the `shadcn/ui` component in a new custom component.
-   **File Structure**: Each component must be in its own file.

### 2. Styling

-   **Tailwind CSS Only**: All styling must be done using Tailwind CSS utility classes.
-   **Theme Variables**: Use the predefined CSS variables for colors, fonts, and spacing defined in `src/index.css` and configured in `tailwind.config.ts`. For example, use `bg-primary` instead of a hardcoded color class.
-   **Responsiveness**: All components and layouts must be responsive and work well on all screen sizes, from mobile to desktop.

### 3. State Management

-   **Local State**: Use React's `useState` and `useReducer` hooks for component-level state.
-   **Server State**: Use TanStack Query (`@tanstack/react-query`) for fetching, caching, and updating data from an API. Do not use `useEffect` for data fetching.

### 4. Forms

-   **Forms**: Use `react-hook-form` for handling all forms.
-   **Validation**: Use `zod` to define validation schemas and connect them to `react-hook-form` using `@hookform/resolvers`.

### 5. Routing and Pages

-   **Router**: Use `react-router-dom` for all navigation.
-   **Route Definitions**: All routes should be defined in `src/App.tsx`.
-   **Page Components**: Create a new file in `src/pages` for each new page/route.

### 6. Icons

-   **Icon Library**: Exclusively use icons from the `lucide-react` package. This ensures visual consistency.

### 7. Notifications

-   **Toasts**: Use the `sonner` library for all user-facing toast notifications. It is already set up in `App.tsx`.

### 8. Code Quality

-   **TypeScript**: Use TypeScript everywhere. Avoid using `any` unless absolutely necessary.
-   **File Naming**: Use PascalCase for component files (e.g., `MyComponent.tsx`) and kebab-case for other files (e.g., `api-client.ts`).
-   **Directory Structure**:
    -   `src/pages`: For top-level page components.
    -   `src/components`: For reusable custom components.
    -   `src/components/ui`: For `shadcn/ui` components (do not modify).
    -   `src/hooks`: For custom React hooks.
    -   `src/lib`: For utility functions and library configurations.