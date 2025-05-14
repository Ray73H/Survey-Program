# Survey-Program

## Dev steps to start
### Install Dependencies and run
```
cd client
npm install
npm start
```
```
cd server
npm install
npm run dev
```

### Formatting
```
npm run format
```

### Client - Folder Structure Example
```
 client/
├── public/                     # CRA public files (index.html, etc.)
├── src/
│   ├── assets/                 # Images, fonts, logos, etc.
│   ├── components/             # Reusable UI components (Button, Navbar, etc.)
│   ├── layouts/                # Layouts for pages (e.g., AuthLayout, MainLayout)
│   ├── pages/                  # Page-level components (views tied to routes)
│   │   ├── SurveyBuilder.jsx
│   ├── services/               # API logic (e.g., fetchOrders.js, postRating.js)
│   ├── context/                # React Context files (UserContext, AuthContext)
│   ├── App.jsx                 # Main App component with routing
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
```

### Server - Folder Structure Example
```
server/
├── node_modules/               # Node dependencies
├── src/
│   ├── config/                 # Configuration files (e.g., db.js, env.js)
│   ├── controllers/            # Route handlers / controller logic
│   ├── middleware/             # Custom middleware (e.g., authMiddleware.js)
│   ├── models/                 # Database models (e.g., User.js, Survey.js)
│   ├── routes/                 # Express route definitions (e.g., userRoutes.js)
│   ├── utils/                  # Utility/helper functions (e.g., validators.js)
│   ├── server.js               # Main entry point for the server (setup & start Express app)
├── .env                        # Environment variables
```
