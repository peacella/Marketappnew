const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  mailgun: {
    apiKey: import.meta.env.VITE_MAILGUN_API_KEY || "",
    domain: import.meta.env.VITE_MAILGUN_DOMAIN || "",
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  },
};

export default config;
