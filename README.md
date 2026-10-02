# P-ELLA Market

A full-stack food & grocery e-commerce web application built with React, Firebase, and Paystack.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS v3 + Framer Motion
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google Sign-In)
- **Payments:** Paystack (inline popup, NGN)
- **Emails:** Mailgun (via Netlify Functions)
- **Hosting:** Netlify

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd pella-market
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a Web App and copy the config values to your `.env` file
4. Enable **Google Sign-In** in Authentication > Sign-in method
5. Create a **Firestore Database** in production mode

### 4. Seed Firestore

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `serviceAccountKey.json` in the project root
4. Run the seed script:

```bash
npm run seed
```

### 5. Paystack Setup

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to Settings > API Keys
3. Copy your **Public Key** to `VITE_PAYSTACK_PUBLIC_KEY` in `.env`
4. Copy your **Secret Key** to `PAYSTACK_SECRET_KEY` in `.env` (Netlify Functions only)

### 6. Mailgun Setup

1. Go to [Mailgun](https://www.mailgun.com/) and create an account
2. Verify your domain or use the sandbox domain
3. Copy your API key and domain to `.env`:
   - `MAILGUN_API_KEY`
   - `MAILGUN_DOMAIN`
   - `MAILGUN_FROM_EMAIL`

### 7. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 8. Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com/) and import your repo
3. Add all environment variables in **Site settings > Environment variables**
4. Deploy!

### 9. Firestore Security Rules

Deploy the included `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

## Features

- Google Sign-In authentication
- Real-time product catalog from Firestore
- Shopping cart with localStorage persistence
- Paystack payment integration
- Order confirmation emails via Mailgun
- Order history and tracking
- Fully responsive design
- Smooth Framer Motion animations
- Toast notifications
- Loading skeletons and empty states

## Project Structure

```
├── netlify/functions/     # Serverless functions (Paystack, Mailgun)
├── public/               # Static assets
├── scripts/              # Seed script
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React contexts (Auth, Cart)
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Firebase & Paystack setup
│   ├── pages/            # Page components
│   ├── utils/            # Helpers & constants
│   └── data/             # Seed product data
├── .env.example          # Environment variable template
├── firestore.rules       # Firestore security rules
└── netlify.toml          # Netlify configuration
```

## License

MIT
# Marketappnew
# MarketAppHMG
