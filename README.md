# Intervio - AI-Powered Interview Platform

Intervio is a modern, all-in-one platform designed to revolutionize the hiring process for both candidates and HR professionals. It leverages the power of Generative AI to provide realistic mock interviews, instant performance feedback, and automated resume analysis.

## ✨ Features

- **AI Mock Interviews**: Candidates can practice interviews with an AI voice assistant that asks questions based on selected topics and listens to spoken answers.
- **Instant Feedback & Analysis**: After each answer, the AI provides a detailed analysis, including a quality rating, sentiment analysis, key talking points, and a conversational justification for its assessment.
- **Resume ATS Checker**: Upload a resume and paste a job description to get an instant Applicant Tracking System (ATS) compatibility score, keyword analysis, and actionable suggestions for improvement.
- **Dual Dashboards**:
    - **Candidate Dashboard**: Access mock interviews, the resume checker, and view past interview history.
    - **HR Dashboard**: A dedicated space for HR professionals to schedule mock interviews in bulk for candidates by simply entering their email addresses and selecting topics.
- **Secure Authentication**: Built-in user authentication system powered by Firebase for handling sign-up, login, and user sessions securely.
- **Interview History**: Candidates can review their past interview performance to track their progress over time.
- **Dynamic & Responsive UI**: A modern, attractive, and fully responsive user interface built with the latest web technologies.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    This project is pre-configured to use Firebase. However, you must enable the "Email/Password" sign-in provider in your Firebase project for the authentication to work.
    - Go to your [Firebase Console](https://console.firebase.google.com/).
    - Navigate to **Authentication** > **Sign-in method**.
    - Click on **Email/Password** and enable it.

4. **Environment Variables**
    The project uses a `.env` file for environment variables, primarily for the Firebase configuration. The necessary Firebase client-side keys are already included in `src/lib/firebase.ts`. For Genkit server-side functionality, you may need to add your `GEMINI_API_KEY`.

### Running the Application

This project consists of two main parts: the Next.js frontend and the Genkit AI backend, which run as separate processes.

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

2.  **Start the Genkit development server:**
    In a separate terminal, run the following command to start the Genkit flows, which power the AI features.
    ```bash
    npm run genkit:watch
    ```

## 📂 Project Structure

- **`src/app`**: Contains the pages and layouts of the application, following the Next.js App Router structure.
    - `(auth)`: Route group for authentication pages (login, signup).
    - `app`: Route group for the main application dashboards.
        - `candidate`: Candidate-specific pages.
        - `hr`: HR-specific pages.
        - `history`: Interview history page.
- **`src/components`**: Contains all the reusable React components.
    - `ui`: Auto-generated components from ShadCN UI.
    - `voice-mockup`: Components related to the mock interview feature.
    - `resume-checker`: Components related to the resume analysis feature.
- **`src/ai`**: Contains all the AI-related logic using Genkit.
    - `flows`: Defines the AI workflows, such as generating questions and analyzing answers.
- **`src/lib`**: Contains utility functions and library initializations (e.g., Firebase, `cn` utility).
- **`src/hooks`**: Contains custom React hooks, such as `useAuth` and `useToast`.
- **`public`**: Contains static assets like images and fonts.
