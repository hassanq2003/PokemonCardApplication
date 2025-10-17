# PokéDex TCG - Pokemon Card Search & Collection Manager

A modern, feature-rich web application for searching, viewing, and managing Pokemon Trading Card Game (TCG) collections.

## Features

### 🔍 Advanced Search
- Search Pokemon cards by name with autocomplete-like functionality
- Filter by multiple types (Fire, Water, Grass, etc.)
- Filter by rarity (Common, Rare, Holo, etc.)
- Filter by supertype (Pokémon, Trainer, Energy)
- Filter by subtypes (Basic, Stage 1, Stage 2, EX, GX, etc.)
- Filter by set and release date
- Filter by minimum HP value
- Pagination support for browsing thousands of cards

### 💖 Favorites System
- Save your favorite Pokemon cards
- Quick access to all favorited cards
- One-click favorite/unfavorite toggle
- Persistent storage in database

### 📚 Collections Management
- Create multiple collections to organize your cards
- Add cards to collections with quantity tracking
- View all cards in a specific collection
- Update card quantities
- Delete collections when no longer needed
- Public/private collection visibility options

### 🔐 Authentication
- Secure user registration and login
- Email/password authentication via Supabase
- Session management with persistent login
- Row Level Security (RLS) ensuring data privacy

### 🎨 Beautiful UI/UX
- Modern, responsive design with Tailwind CSS
- Smooth animations and transitions
- Card hover effects with action buttons
- Loading states and skeleton screens
- Mobile-friendly responsive layout
- Gradient backgrounds and shadows
- Type-based color coding for Pokemon types

### 📊 Detailed Card Information
- Full card details modal with:
  - High-resolution card images
  - HP, types, and supertype
  - Abilities with descriptions
  - Attacks with energy costs and damage
  - Weaknesses and resistances
  - Set information and card number
  - Rarity and artist information
  - Market prices (when available)
  - Flavor text

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Real-time subscriptions (future enhancement)

### API
- **Pokemon TCG API v2** - Official Pokemon card data
  - Access to 20,000+ cards
  - Real-time set updates
  - Comprehensive card information
  - Advanced search queries

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pokedex-tcg
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Building for Production
```bash
npm run build
npm run preview
```

## Project Structure

```
pokedex-tcg/
├── src/
│   ├── components/        # React components
│   │   ├── AuthModal.tsx           # Login/signup modal
│   │   ├── PokemonCard.tsx         # Card display component
│   │   ├── SearchFilters.tsx       # Advanced search filters
│   │   ├── CardDetailsModal.tsx    # Detailed card view
│   │   └── CollectionModal.tsx     # Add to collection modal
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx         # Authentication state
│   ├── lib/              # Core libraries
│   │   └── supabase.ts             # Supabase client & types
│   ├── services/         # API services
│   │   └── pokemonApi.ts           # Pokemon TCG API wrapper
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── tests/                # Test suite
│   ├── pokemonApi.test.ts         # API tests
│   ├── auth.test.ts               # Auth tests
│   ├── database.test.ts           # Database tests
│   └── README.md                  # Test documentation
├── docs/                 # Documentation
│   ├── README.md                  # This file
│   ├── API.md                     # API documentation
│   ├── DATABASE.md                # Database schema
│   └── DEPLOYMENT.md              # Deployment guide
└── public/              # Static assets
```

## Database Schema

### Tables

#### favorites
Stores user's favorite cards
- `id` - UUID primary key
- `user_id` - UUID foreign key to auth.users
- `card_id` - Pokemon card ID
- `card_data` - Complete card JSON data
- `created_at` - Timestamp

#### collections
User's card collections
- `id` - UUID primary key
- `user_id` - UUID foreign key to auth.users
- `name` - Collection name
- `description` - Optional description
- `is_public` - Boolean for visibility
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### collection_cards
Cards within collections
- `id` - UUID primary key
- `collection_id` - UUID foreign key
- `card_id` - Pokemon card ID
- `card_data` - Complete card JSON data
- `quantity` - Number of copies owned
- `added_at` - Timestamp

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Public collections are viewable by authenticated users
- Strict ownership validation on all operations

## API Usage

### Pokemon TCG API
The app uses the official Pokemon TCG API v2:
- **Endpoint**: `https://api.pokemontcg.io/v2`
- **Authentication**: None required for basic usage
- **Rate Limits**: Generous for development use
- **Documentation**: https://docs.pokemontcg.io/

### Key API Methods

```typescript
// Search cards with filters
pokemonApi.searchCards({
  query: 'Pikachu',
  types: ['Electric'],
  rarity: ['Rare'],
  page: 1,
  pageSize: 20
});

// Get specific card
pokemonApi.getCardById('base1-25');

// Get all sets
pokemonApi.getSets();

// Get available types
pokemonApi.getTypes();
```

## Features in Detail

### Search System
The search system uses Lucene-like syntax for powerful queries:
- Name searches with wildcards
- Boolean operators for complex filters
- Range queries for HP and other numeric values
- Combines multiple filters with AND logic

### Authentication Flow
1. User clicks "Sign In" button
2. Modal opens with login/signup form
3. Credentials validated by Supabase
4. Session token stored in localStorage
5. User state updates throughout app
6. Protected features become available

### Favorites Flow
1. User clicks heart icon on card
2. If not authenticated, prompted to sign in
3. Card data saved to favorites table
4. UI updates to show filled heart
5. Card appears in Favorites view

### Collections Flow
1. User creates named collection
2. Clicks "+" on any card
3. Selects collection from dropdown
4. Enters quantity (default 1)
5. Card added to collection_cards table
6. View collection to see all cards

## Security Considerations

### Authentication
- Passwords hashed with bcrypt
- JWT tokens for session management
- Secure HTTP-only cookies option
- Email validation required

### Database
- Row Level Security on all tables
- Prepared statements prevent SQL injection
- User data isolated per account
- No cross-user data access

### Frontend
- Environment variables for sensitive data
- No API keys exposed in client code
- Input validation on all forms
- XSS protection via React

## Performance Optimizations

- Lazy loading of card images
- Pagination for large result sets
- Debounced search inputs (can be added)
- Optimized database indexes
- Cached API responses (can be added)
- Code splitting (can be enhanced)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## Testing

See `tests/README.md` for comprehensive testing documentation.

```bash
# Run all tests
npm test

# Run specific test file
npm test pokemonApi.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions for:
- Vercel
- Netlify
- AWS Amplify
- Custom hosting

## Future Enhancements

### Planned Features
- [ ] Deck builder functionality
- [ ] Card comparison tool
- [ ] Price tracking and alerts
- [ ] Trading/wishlist system
- [ ] Social features (share collections)
- [ ] Advanced statistics dashboard
- [ ] Export collections to PDF
- [ ] Barcode/QR code scanning
- [ ] Offline mode with PWA
- [ ] Dark mode toggle

### Technical Improvements
- [ ] Add component unit tests
- [ ] Implement E2E testing
- [ ] Add Storybook for components
- [ ] Optimize bundle size
- [ ] Add service worker for caching
- [ ] Implement virtual scrolling
- [ ] Add analytics integration

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- Pokemon TCG data provided by [Pokemon TCG API](https://pokemontcg.io/)
- Built with [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review test cases for usage examples

## Acknowledgments

Special thanks to the Pokemon TCG API team for providing free access to comprehensive card data.
