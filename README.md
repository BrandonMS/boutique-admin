# Boutique Admin Portal

React-based admin dashboard for managing boutique products, orders, and campaigns with Clover POS integration.

## Features
- Admin login/authentication
- Product management & Clover sync
- Order tracking & status updates
- Email/SMS/Banner campaign creation & sending
- Clover integration setup guide
- Real-time notifications

## Getting Started

### Prerequisites
- Node.js 14+
- Backend API running on `http://localhost:3000`

### Installation

```bash
cd boutique-admin
npm install
npm start
```

The app runs on `http://localhost:3000` (React dev server runs on a different port, usually 3001).

### Environment Variables

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Project Structure
```
src/
├── components/       # Reusable components (Layout, Navbar, Sidebar, PrivateRoute)
├── pages/           # Page components (Login, Dashboard, Products, Orders, Campaigns, CloverSetup)
├── services/        # API service layer
├── context/         # Auth context
├── hooks/           # Custom hooks (useAuth)
├── styles/          # CSS files
├── App.js           # Main app component with routing
└── index.js         # React entry point
```

## Pages

- **Login** - Admin authentication
- **Dashboard** - Overview metrics (orders, revenue, products, pending orders)
- **Products** - List products, sync from Clover
- **Orders** - View and update order statuses
- **Campaigns** - Create and send email/SMS/banner campaigns
- **Clover Setup** - Integration setup instructions

## API Endpoints Used

- `POST /api/auth/login` - Admin login
- `GET /api/products` - List products
- `POST /api/products/sync` - Sync from Clover
- `GET /api/orders` - List orders
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `POST /api/campaigns/:id/send` - Send campaign

## Available Scripts

```bash
npm start       # Start dev server
npm build       # Create production build
npm test        # Run tests
npm eject       # Eject from Create React App
```

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## Next Steps
1. Install dependencies: `npm install`
2. Start the app: `npm start`
3. Log in with admin credentials (create via backend API first)
4. Navigate to Clover Setup to configure integration
