import { supabase } from '../src/lib/supabase';

describe('Authentication', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  describe('Sign Up', () => {
    it('should successfully create a new user account', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
    });

    it('should fail with invalid email format', async () => {
      const { error } = await supabase.auth.signUp({
        email: 'invalid-email',
        password: testPassword,
      });

      expect(error).toBeDefined();
    });

    it('should fail with weak password', async () => {
      const { error } = await supabase.auth.signUp({
        email: `test-${Date.now()}@example.com`,
        password: '123',
      });

      expect(error).toBeDefined();
    });

    it('should prevent duplicate email registration', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      await supabase.auth.signUp({
        email,
        password: testPassword,
      });

      const { error } = await supabase.auth.signUp({
        email,
        password: testPassword,
      });

      expect(error).toBeDefined();
    });
  });

  describe('Sign In', () => {
    beforeAll(async () => {
      await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
    });

    it('should successfully sign in with valid credentials', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      expect(error).toBeNull();
      expect(data.session).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
    });

    it('should fail with incorrect password', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: 'WrongPassword123!',
      });

      expect(error).toBeDefined();
    });

    it('should fail with non-existent email', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: testPassword,
      });

      expect(error).toBeDefined();
    });
  });

  describe('Sign Out', () => {
    it('should successfully sign out', async () => {
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      const { error } = await supabase.auth.signOut();

      expect(error).toBeNull();

      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should retrieve current session', async () => {
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      const { data: { session } } = await supabase.auth.getSession();

      expect(session).toBeDefined();
      expect(session?.user).toBeDefined();
    });

    it('should return null session when not authenticated', async () => {
      await supabase.auth.signOut();

      const { data: { session } } = await supabase.auth.getSession();

      expect(session).toBeNull();
    });
  });
});
