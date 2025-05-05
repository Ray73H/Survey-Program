# Survey-Program

## Dev steps to start
### Install Dependencies
```
cd client
npm install
```
```
cd server
npm install
```

### Linting and Formatting
```
npm run lint
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
