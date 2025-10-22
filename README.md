# synkkafrica-web_frontend
Next.js based web platforms - Vendor Dashboard, Landing Page, Customer Interface, Admin Panel (Backend &amp; Support)

---

````markdown
# synKKafrica Web Frontend

This is the **Next.js web platform** for **synKafrica**, a lifestyle aggregation service offering **transportation, laundry, restaurant booking, and beach services** through a single unified portal.

The application is structured using the **MVC (Model-View-Controller)** pattern, optimized for scalability, reusability, and rapid team collaboration.

---

## 🧱 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript** – Strong typing
- **Tailwind CSS** – Utility-first styling
- **Zustand** / **Redux Toolkit** – State management
- **Axios** – HTTP client
- **Jest + React Testing Library** – Unit testing
- **Headless UI** / **Shadcn** – UI components
- **ESLint + Prettier** – Linting and code formatting

---

## 🗂️ Folder Structure (MVC)

```bash
synkkafrica-web_frontend/
│
├── app/                 # Routes (App Router) + layout
│   ├── page.tsx         # Home page (View)
│   └── ...
│
├── components/          # Shared and atomic UI components (View)
│
├── controllers/         # Functions that handle logic and events (Controller)
│
├── models/              # Data structures and API contracts (Model)
│
├── services/            # API calls and external service handlers
│
├── utils/               # Constants, formatters, validators
│
├── public/              # Static assets
├── styles/              # Global styles and theme files
├── .env.local           # Local environment variables
├── tailwind.config.js   # Tailwind CSS config
├── next.config.js       # Next.js config
└── README.md
````

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/synkafrica/synkafrica-web_frontend.git
cd synkkafrica-web_frontend

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

> Open `http://localhost:3000` in your browser to view the app.

---

## ✅ Available Scripts

```bash
npm run dev         # Run in development
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run test        # Run unit tests
```

---

## 🔐 Environment Variables

Create a `.env.local` file using the `.env.example` template. Variables include:

```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

---

## 🧠 State Management

Zustand or Redux (depending on final team decision) will manage shared state like:

* Auth status
* Service booking states
* User session and preferences

---

## 🎨 Design System

* Tailwind CSS with pre-defined utilities
* Global theming support
* Component library: Header, Footer, Buttons, Form Controls, Cards
* Components are reusable and follow atomic design principles

---

## 🧪 Testing

```bash
npm run test
```

Unit testing is configured using **Jest** and **React Testing Library**. Test coverage reports can be enabled with:

```bash
npm run test:coverage
```

---

## 🌐 Deployment

* **Vercel** (default target)
* Use `vercel.json` or GitHub actions for continuous deployment
* Automatically integrates with `main` or `production` branch

---

## 🤝 Contributing

* Use feature branches: `feature/<name>`
* Format code before pushing: `npm run lint:fix`
* All code changes must go through Pull Requests with reviews

---
