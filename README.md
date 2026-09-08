# Felix Yacht - International Yacht Registration Platform

A full-stack web application for global yacht and vessel registrations, flag administration, client instant quotes, and administrative document processing.

## Features

- **Global Registry Services:** Multi-jurisdiction flag registration (Poland, San Marino, Delaware, UK Part 1, Seychelles, Langkawi, etc.).
- **Interactive Registration Engine:** Real-time quote calculators, dynamic fee breakdowns, and qualification checkers.
- **Multilingual Support:** Localized international experience across European and global languages.
- **Client Form Submission:** Structured digital intake forms for boat owners, operators, and vessel specifications.
- **Administrative Portal:** Secure dashboard for client quotes, registration status tracking, revenue management, customer reviews CMS, and Word document generator (.docx) integration.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion
- **State & Data:** TanStack Query, React Router v7, React Hook Form, Zod
- **Backend:** Node.js, Express, TSX
- **Database & Auth:** Firebase / Firestore
- **Document Generation:** docxtemplater, pizzip

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone or extract the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (optional for local dev):
   ```bash
   cp .env.example .env
   ```

### Development

To run the application locally:
```bash
npm run dev
```
The server will start at `http://localhost:3006`.

### Production Build

To build the project for production:
```bash
npm run build
```
To run the production server:
```bash
npm run start
```
