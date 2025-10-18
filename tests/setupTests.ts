(globalThis as any).import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: "https://test.supabase.co",
      VITE_SUPABASE_ANON_KEY: "test-anon-key"
    }
  }
};


import '@testing-library/jest-dom';
