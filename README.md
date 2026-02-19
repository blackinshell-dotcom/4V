# MotoCare Pro Tracker

A comprehensive motorcycle maintenance and service tracking application with AI-powered health insights. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Odometer Tracking**: Log your mileage and view historical data.
- **Maintenance Matrix**: Track service intervals for over 25 components.
- **Visual Alerts**: Dynamic status indicators (Good, Warning, Overdue) based on mileage.
- **Compliance Tracking**: Keep track of license and tax expiry dates.
- **Offline First**: All data is persisted locally in your browser.
- **Undo Support**: Accidental changes can be reverted easily.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **AI Integration**: Google Gemini API (for future health insights)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/motocare-pro-tracker.git
   cd motocare-pro-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/App.tsx`: Main application logic and state management.
- `src/components/`: Reusable UI components.
- `src/constants.ts`: Initial maintenance data and theme configuration.
- `src/types.ts`: TypeScript interfaces and enums.
- `src/geminiService.ts`: Integration with Google Gemini API.

## License

This project is licensed under the MIT License.
