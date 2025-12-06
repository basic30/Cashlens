# 💸 CashLens

Your Privacy-First AI Financial Companion. CashLens helps you track expenses, manage subscriptions, and gain AI-powered financial insights without your data ever leaving your device.

---
<details> 
<summary><strong>📖 Table of Contents</strong></summary>
  
- [✨ Features](#-features)

- [🛠️ Tech Stack](#️-tech-stack)

- [📂 Project Structure](#-project-structure)

- [🚀 Getting Started](#-getting-started)

- [⚙️ Configuration](#️-configuration)

- [☁️ Deployment](#%EF%B8%8F-deployment)

  - [Deploy on Netlify](#option-1-deploy-to-netlify-recommended)
  - [Deploy on AWS Amplify](#option-2-deploy-to-aws-amplify)

- [🔒 Privacy Policy](#-privacy-policy)

- [🤝 Contributing](#-contributing)
</details>

## ✨ Features
CashLens is packed with features designed to give you control over your financial life:

### 📊 Smart Transaction Dashboard
   - Visual Analytics: View monthly spending trends, category distribution (Pie Charts), and daily/weekly breakdowns.

   - Top Merchants: Identify where you spend the most money.

   - Quick Actions: Easily export data to CSV or manage categories.

### 🧠 Financial Insights & AI
   - AI Coach: Receive personalized warnings (e.g., "Food Delivery Overspending") and savings recommendations.

   - Anomaly Detection: Automatically flags suspicious transactions (high value, unusual time, or location).

   - Health Score: Get a credit-score-like rating for your financial health (0-100).

### 💰 Budgeting & Categories
   - Category Management: Edit transaction categories with confidence scores. Supports bulk editing.

   - Budget Alerts: Set custom thresholds (e.g., alert at 80% usage) for specific categories like Food, Travel, or Shopping.

   - Spending Comparison: Compare current spending against historical averages.

### 🔄 Subscription Tracker
   - Recurring Payments: Track Netflix, Spotify, Gym memberships, and more.
 
   - Usage Detection: Identify "Unused" or "Hidden" subscriptions to save money.

   - Reminders: See next payment dates and annual cost projections.

### 📱 Privacy-First SMS Parsing
   - Local Processing: Parses UPI and bank SMS alerts directly in the browser.

   - Zero Data Collection: No financial data is uploaded to external servers.

---

## 🛠️ Tech Stack
### Frontend Core:

- React 18: Component-based UI architecture.

- Vite: Blazing fast build tool and development server.

- Tailwind CSS: Utility-first styling for a modern, dark-mode ready design.

### Data & State:

- Redux Toolkit: State management for complex flows.

- React Router DOM: Client-side routing.

### Visualization & UI:

- Recharts: Interactive and responsive charts.

- Lucide React: Beautiful, consistent iconography.

- Radix UI: Accessible UI primitives for Modals and Popovers.

---

## 📂 Project Structure
The project is organized to ensure scalability and maintainability. Here is an overview of the directory layout:
```md
cashlens/
├── public/                      # Static files
│   ├── _redirects               # SPA routing for Netlify
│   ├── manifest.json            # PWA settings
│   └── robots.txt               # SEO rules
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Buttons, Inputs, Modals, etc.
│   │   ├── AppIcon.jsx
│   │   └── ErrorBoundary.jsx
│   │
│   ├── pages/                   # Route-level screens
│   │   ├── budget-settings/
│   │   ├── category-management/
│   │   ├── financial-insights/
│   │   ├── sms-permission-setup/
│   │   ├── subscription-tracker/
│   │   ├── transaction-dashboard/
│   │   └── NotFound.jsx
│   │
│   ├── styles/                  # Global styles
│   │   ├── index.css
│   │   └── tailwind.css
│   │
│   ├── utils/                   # Helper functions (class merge, formatters, etc.)
│   │
│   ├── App.jsx                  # App root
│   ├── Routes.jsx               # Router config
│   └── index.jsx                # Entry point
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── index.html                   # Main HTML template
├── package.json                 # Dependencies & scripts
├── postcss.config.js            # PostCSS settings
├── tailwind.config.js           # Tailwind config
└── vite.config.mjs              # Vite configuration
```
---

## 🚀 Getting Started
Follow these instructions to run the project locally.

### Prerequisites
‣ Node.js (v16 or higher)

‣ npm or yarn

### Installation
1. Clone the repository
```
git clone https://github.com/yourusername/cashlens.git
cd cashlens
```
2. Install dependencies
```
npm install
```
3. Start the development server
```
npm run start
```
The app should now be running at `http://localhost:4028`.

---

## ⚙️ Configuration
Create a `.env` file in the root directory. You can use the provided template as a base.

`Code snippet`
```
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_OPENAI_API_KEY=your_openai_key  # Optional: For live AI features
Note: Since this is a client-side app, ensure your API keys have appropriate usage limits if exposed.
```
---
## ☁️ Deployment
You can deploy CashLens to any static hosting provider. Below are instructions for **Netlify** and **AWS**.

### Option 1: Deploy to Netlify (Recommended)
Netlify is the easiest way to deploy this project because it handles the `_redirects` automatically.

1.  **Push your code** to GitHub/GitLab/Bitbucket.

2.  Log in to [Netlify](https://www.netlify.com).

3.  Click **"Add new site" → "Import an existing project"**.

4.  Select your Git provider and choose the **CashLens** repository.

5.  Configure Build Settings:

      - **Base directory:** `/` (leave empty)

      - **Build command:** `npm run build`

      - **Publish directory:** `build` (Note: Your `vite.config.mjs` sets output to `build`, not `dist`).

6.  Click **Deploy Site**.

The included `public/_redirects` file handles Single Page Application (SPA) routing automatically.

### Option 2: Deploy to AWS Amplify
AWS Amplify allows you to host full-stack apps easily.

 1. Log in to the **AWS Console** and search for **AWS Amplify**.

 2. Click **"Create new app"** (or "Host web app").

 3. Select **GitHub** (or your provider) and authorize AWS.

 4. Select the **CashLens** repository and branch (main).

 5. **Build Settings:** Amplify should auto-detect the settings, but verify:

`YAML`
```
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
```
(Ensure `baseDirectory` is set to `build`).

6. Click **Save and Deploy**.

### Important: Fix Routing for SPA (React Router)

 1. Once deployed, go to **App settings > Rewrites and redirects** in the Amplify console.

 2. Click **Edit**.

 3. Add the following rule **at the top of the list**:

     - **Source address:** `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`

     - **Target address:** `/index.html`

     - **Type:** `200 (Rewrite)`

 4. Save. This ensures refreshing a page like `/budget-settings` works correctly.
---
## 👨‍💻 Meet the Team

<div align="center">
  <table>
    <tr>
      <!-- Sneha -->
      <td align="center" style="padding: 20px;">
        <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; margin-bottom:8px;">
          <img src="https://i.ibb.co/zWw45FTJ/cropped-circle-image.png"
               style="width:100%; height:100%; object-fit:cover;">
        </div>
        <b>Sneha Majumder</b><br>
        <i>Project Leader</i><br>
        <a href="https://github.com/SnehaMs325">GitHub</a> |
        <a href="https://linkedin.com/in/sneha-majumder-tech001">LinkedIn</a>
      </td>
      <!-- Snahasish -->
      <td align="center" style="padding: 20px;">
        <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; margin-bottom:8px;">
          <img src="https://i.ibb.co/FLKgTN95/snahasish-2.png"
               style="width:100%; height:100%; object-fit:cover;">
        </div>
        <b>Snahasish Dey</b><br>
        <i>Frontend Developer</i><br>
        <a href="https://github.com/basic30">GitHub</a> |
        <a href="https://linkedin.com/in/snahasish-dey-959510328">LinkedIn</a>
      </td>
      <!-- Srijit -->
      <td align="center" style="padding: 20px;">
        <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; margin-bottom:8px;">
          <img src="https://i.ibb.co/zhzC3bYQ/srijit.png"
               style="width:100%; height:100%; object-fit:cover;">
        </div>
        <b>Srijit Bhattacharya</b><br>
        <i>Full-Stack Developer</i><br>
        <a href="https://github.com/Sidibo">GitHub</a> |
        <a href="https://linkedin.com/in/srijit-bhattacharya-46a9b4327">LinkedIn</a>
      </td>
      <!-- Sania -->
      <td align="center" style="padding: 20px;">
        <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; margin-bottom:8px;">
          <img src="https://i.ibb.co/S4k46Ggd/sania.png"
               style="width:100%; height:100%; object-fit:cover;">
        </div>
        <b>Sania Ghosh</b><br>
        <i>UI & UX Designer</i><br>
        <a href="https://github.com/Sania2805">GitHub</a> |
        <a href="https://linkedin.com/in/sania-ghosh-81311832b">LinkedIn</a>
      </td>
    </tr>
  </table>
</div>

---

## 🔒 Privacy Policy
CashLens is architected with a **Local-First** philosophy:

 1. **Local Processing:** All data parsing (SMS, inputs) happens within the user's browser memory.

 2. **No Cloud Storage:** By default, we do not store your transaction history on our servers.

 3. **Transparency:** The codebase is open for audit to ensure no hidden data exfiltration occurs.
---
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

 1. Fork the project

 2. Create your feature branch (`git checkout -b feature/AmazingFeature`)

 3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

 4. Push to the branch (`git push origin feature/AmazingFeature`)

 5. Open a Pull Request
---
Made with ❤️ by [CashLens](https://cashlens-v1.netlify.app)
