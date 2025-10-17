# Test Suite Documentation

This directory contains comprehensive test cases for the PokéDex TCG application.

## Test Files

### 1. pokemonApi.test.ts
Tests for the Pokemon TCG API integration service.

**Test Coverage:**
- Card search functionality
- Filtering by name, type, rarity, supertype, and HP
- Pagination
- Fetching specific cards by ID
- Fetching sets, types, rarities, and subtypes
- Error handling for invalid requests

**Key Test Cases:**
- ✅ Fetch cards with default parameters
- ✅ Search cards by name (e.g., "Pikachu")
- ✅ Filter by single and multiple types
- ✅ Filter by rarity
- ✅ Filter by supertype (Pokémon, Trainer, Energy)
- ✅ Filter by minimum HP
- ✅ Pagination validation
- ✅ Fetch card by specific ID
- ✅ Error handling for invalid card IDs
- ✅ Fetch all available sets
- ✅ Fetch all Pokemon types
- ✅ Fetch all card rarities
- ✅ Fetch all card subtypes

### 2. auth.test.ts
Tests for Supabase authentication functionality.

**Test Coverage:**
- User registration
- Sign in/sign out
- Session management
- Input validation
- Security checks

**Key Test Cases:**
- ✅ Create new user account successfully
- ✅ Validate email format
- ✅ Enforce password strength requirements
- ✅ Prevent duplicate email registration
- ✅ Sign in with valid credentials
- ✅ Reject incorrect password
- ✅ Reject non-existent email
- ✅ Sign out functionality
- ✅ Session retrieval when authenticated
- ✅ Return null session when not authenticated

### 3. database.test.ts
Tests for Supabase database operations and Row Level Security.

**Test Coverage:**
- Favorites management
- Collections CRUD operations
- Collection cards management
- Row Level Security policies
- Data integrity

**Key Test Cases:**
- ✅ Add card to favorites
- ✅ Retrieve user favorites
- ✅ Prevent duplicate favorites
- ✅ Remove card from favorites
- ✅ Create new collection
- ✅ Retrieve user collections
- ✅ Update collection details
- ✅ Add cards to collection with quantity
- ✅ Retrieve cards from collection
- ✅ Update card quantity in collection
- ✅ Remove card from collection
- ✅ Delete collection
- ✅ RLS: Users cannot view other users' favorites
- ✅ RLS: Users cannot modify other users' collections

## Running Tests

### Prerequisites
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @vitest/ui jsdom
```

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test pokemonApi.test.ts
npm test auth.test.ts
npm test database.test.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

## Test Configuration

Create a `vitest.config.ts` file in the root directory:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
```

## Environment Setup

Tests require a `.env.test` file with:
```
VITE_SUPABASE_URL=your_test_supabase_url
VITE_SUPABASE_ANON_KEY=your_test_supabase_anon_key
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Cleanup**: Tests clean up after themselves (delete test data)
3. **Async/Await**: All async operations are properly awaited
4. **Error Testing**: Both success and failure cases are tested
5. **Security**: RLS policies are thoroughly tested
6. **Real API**: Tests use the actual Pokemon TCG API to ensure real-world compatibility

## Notes

- Tests create unique test users to avoid conflicts
- Database tests verify Row Level Security policies
- API tests validate response structure and data integrity
- All tests include proper error handling validation

## Future Enhancements

- Add component unit tests
- Add E2E tests with Playwright or Cypress
- Add performance testing
- Mock API responses for faster testing
- Add accessibility testing
