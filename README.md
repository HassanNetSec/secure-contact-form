# Secure, Spam-Free Next.js Contact Form
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/HassanNetSec/secure-contact-form)

A modern, high-performance contact form built with Next.js 14, Tailwind CSS, and Nodemailer. This project features an effective "Honeypot" spam defense system designed to keep your inbox clean without requiring CAPTCHAs.

## Features
*   **🛡️ Honeypot Spam Protection:** Catches spam bots using a hidden form field invisible to human users. Bot submissions are rejected server-side, ensuring a seamless experience for real users.
*   **🎨 Modern UI/UX:** A clean and professional design built with Tailwind CSS, featuring gradients, smooth transitions, and icons from Lucide-React.
*   **📱 Fully Responsive:** The layout adapts perfectly to desktops, tablets, and mobile devices.
*   **✅ Real-Time Validation:** Provides instant, user-friendly feedback on form inputs to prevent submission errors and guide the user.
*   **✉️ Nodemailer Backend:** Uses Next.js API Routes for a serverless backend that sends emails securely via Gmail SMTP using Nodemailer.
*   **🚀 Vercel-Ready:** Optimized for easy, one-click deployment on Vercel.

## Tech Stack
*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS
*   **Language:** TypeScript & JavaScript
*   **Icons:** Lucide-React
*   **Backend:** Next.js API Routes (Serverless)
*   **Mail Service:** Nodemailer

## Getting Started

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/HassanNetSec/secure-contact-form.git
cd secure-contact-form
```

### 2. Install Dependencies
```bash
npm install
```
To ensure proper type-checking, especially for Vercel builds, install the types for Nodemailer:
```bash
npm install --save-dev @types/nodemailer
```

### 3. Set Up Environment Variables
Create a file named `.env.local` in the root of your project and add the following variables.

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
RECIPIENT_EMAIL=your-receiving-email@example.com
```

*   `SMTP_USER`: Your Gmail address that will be used to send the emails.
*   `SMTP_PASS`: Your Gmail App Password. **Never use your actual Gmail password.** You can generate an App Password in your Google Account's security settings.
*   `RECIPIENT_EMAIL`: The email address where you want to receive contact form submissions.

**Note:** The backend API in `app/api/contactform/route.js` needs to be updated to use these environment variables. Ensure the `user`, `pass`, and `to` fields in the Nodemailer configuration match these variable names.

## How the Spam Protection Works

This form uses a classic but effective **Honeypot technique** to filter out spam bots without burdening users with CAPTCHAs.

1.  **The Trap:** A form field named `spam_detection` is added to the HTML but is visually hidden from users with CSS.
2.  **The Bait:** Automated spam bots are programmed to fill out every field they find in a form's HTML, including the hidden honeypot field.
3.  **The Catch:** The backend API at `app/api/contactform/route.js` checks if the `spam_detection` field contains any data. If it does, the submission is immediately identified as spam and rejected. No email is sent, saving your SMTP quota and keeping your inbox clean.

## Project Structure
```
/
├── app/
│   ├── api/contactform/route.js # API endpoint for sending email & spam check
│   ├── page.tsx                 # Frontend contact form UI and client-side logic
│   └── layout.tsx               # Root application layout
├── public/                      # Static assets
└── .env.local                   # Stores your secret credentials (not tracked by Git)
```

## Deployment on Vercel

This project is optimized for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the repository into a new Vercel project.
3.  Add your environment variables (`SMTP_USER`, `SMTP_PASS`, `RECIPIENT_EMAIL`) in the Vercel project settings under **Settings > Environment Variables**.
4.  Deploy! Vercel will automatically build and deploy your Next.js application.
