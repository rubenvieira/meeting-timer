# ⏱️ Meeting Timer

<div align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/react--router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=React%20Query&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
  <p><em>A modern, feature-rich meeting timer designed to keep your team on track. Built with React, Vite, Tailwind CSS, and shadcn/ui.</em></p>
</div>

## ✨ Features

- **⏱️ Precision Countdowns**: Custom timer setup for any meeting length to strictly timebox discussions and syncs.
- **⚡ Preset Timers**: A quick-start grid for common meeting formats (e.g., Standups, Pomodoros, 1:1s, brain-storming sessions).
- **🕰️ Timezone Support**: Seamlessly coordinate and select timezones when working across different global teams, backed by `date-fns` and `date-fns-tz`.
- **📜 Timer & Analytics History**: Automatically tracks past meeting durations, maintains session logs, and provides visual charts using `recharts`.
- **🌗 Dark & Light Themes**: Full system and user theme support featuring a modern toggle, supported by `next-themes`.
- **💅 Beautiful UI**: Clean, engaging, glassmorphic aesthetics. Built using robust native components from `shadcn/ui` and Radix Primitives.
- **🔔 Notifications**: Beautiful, accessible, and user-friendly toast alerts powered by `sonner`.
- **✍️ Robust Input & Form Handling**: Highly performant forms built with `react-hook-form` and schema-validated by `zod`.

## 🚀 Getting Started

### Prerequisites

You need Node.js & npm installed - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. **Clone the repository:**
```sh
git clone https://github.com/rubenvieira/meeting-timer.git
cd meeting-timer
```

2. **Install the dependencies:**
```sh
npm install
```

3. **Start the development server:**
```sh
npm run dev
```

Visit the local development URL (usually `http://localhost:5173`) in your browser to see the app running.

## 🛠️ Detailed Tech Stack

### Core Technologies
- **[Vite](https://vitejs.dev/)** - Next-Generation Frontend Tooling
- **[React 18](https://reactjs.org/)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript at Any Scale
- **[Tailwind CSS](https://tailwindcss.com/)** - Rapidly build modern websites strictly via utility classes

### State Management & Data Fetching
- **[TanStack Query (React Query v5)](https://tanstack.com/query/latest)** - Powerful asynchronous state management, caching, and data fetching

### UI & Component Libraries
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible and customizable components built with Radix and Tailwind
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components for building high‑quality design systems
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon toolkit
- **[Recharts](https://recharts.org/)** - A composable charting library built on React components
- **[Sonner](https://sonner.emilkowal.ski/)** - An opinionated, elegant toast component for React

### Form Management & Routing
- **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible, and extensible forms with easy-to-use validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation with static type inference
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing library

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License.
