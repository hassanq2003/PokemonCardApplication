// Shim import.meta.env for Jest
(globalThis as Record<string, unknown>).import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: "https://mock.supabase.url",
      VITE_SUPABASE_ANON_KEY: "mock-anon-key",
    },
  },
};