# SpendSight

SpendSight is a streamlined ad spend profit tracker built for solo founders and digital marketers. It helps users track campaign performance, visualize ROI trends, and export/import campaign data — all through a clean, responsive dashboard.

## Features

- User authentication with Supabase
- Campaign creation, editing, and deletion
- ROI summary and trend visualization
- CSV import/export (Premium users)
- Premium subscription via Stripe
- Demo mode for quick app preview
- Responsive, minimalist UI

## Screenshots

**-Landing Page**

<img width="1122" height="890" alt="SS_LandingPage" src="https://github.com/user-attachments/assets/cb587977-8443-49fa-acf6-03580a81f156" />

**-Demo Dashboard Overview with Campaign Table**

<img width="998" height="917" alt="SS_Demo_Dashboard" src="https://github.com/user-attachments/assets/e9436913-2764-4e59-a10f-3f9d1e33da95" />
<img width="898" height="373" alt="SS_Demo_CampaignTable" src="https://github.com/user-attachments/assets/0a00d8c4-06db-450c-8e25-59d51b38baf6" />

**-Unsubscribed User Dashboard Overview with Campaign Limit**

<img width="1147" height="923" alt="SS_Non-DemoDashboard(Campaign Limit)" src="https://github.com/user-attachments/assets/37e21b28-3de8-4868-b3e9-e3b2fd043620" />

**-Sign Up and Log In Pages**

<img width="1607" height="943" alt="SS_SignUp" src="https://github.com/user-attachments/assets/73c9c405-6775-410a-b69c-81cbf01e9ee1" />
<img width="1633" height="938" alt="SS_LogIn" src="https://github.com/user-attachments/assets/ee4e6c05-9c6d-4e50-9559-3bc64037f314" />

**-Exported Demo CSV**

<img width="1411" height="692" alt="SS_CampaignExport" src="https://github.com/user-attachments/assets/8ec805e0-b900-4282-a5ea-f0addb53ef32" />

**-Stripe Checkout Page**

<img width="1358" height="911" alt="SS_StripeCheckout" src="https://github.com/user-attachments/assets/fcd106d8-87b4-4708-b3b2-cc607bf8a60b" />

## Demo Credentials

Use the demo account to explore the app without signing up:

- **Email:** demo@fakeemail.com  
- **Password:** Demo123!

##  Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS  
- **Backend:** Supabase (PostgreSQL + Auth)  
- **Payments:** Stripe  
- **Hosting:** Vercel  
- **CSV Parsing:** PapaParse  
- **Notifications:** React Hot Toast + Toastify  
- **Tooltips:** React Tooltip

## Getting Started (Local Development)

1. Clone the repository:

   ```bash
   git clone https://github.com/emcg0021/SpendSight.git
   cd SpendSight

2. Install dependencies

<pre> npm install </pre>

3. Create a .env.local file with your keys:

    NEXT_PUBLIC_SUPABASE_URL= your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY= your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY= your_supabase_service_role_key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= your_stripe_publishable_key
    STRIPE_SECRET_KEY= your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET= your_stripe_webhook_secret

4. Run the dev server:

<pre> npm run dev </pre>

##  Deployment

- The app is fully deployed on Vercel with custom domain support.
- If you're deploying it yourself, remember to add your environment variables under Project Settings → Environment Variables in Vercel.

## Additional Documentation
- [Stripe Setup Instructions](Stripe_Setup.md)

##  License

- This project is licensed under the MIT License. Feel free to use and modify it as needed.
