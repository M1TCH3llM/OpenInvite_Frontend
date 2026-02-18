# Open Invite - Frontend

A modern social calendar application built with React. Share events, follow friends, and manage RSVPs all in one place.

![React](https://img.shields.io/badge/React-18.0-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![Node](https://img.shields.io/badge/Node-18+-green)

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **User Profiles**: View and edit user profiles with bio and profile pictures
- **Social Following**: Follow/unfollow other users to see their events
- **Event Management**: Create, view, and manage social events
- **RSVP System**: Accept or decline event invitations
- **User Search**: Find and connect with other users
- **Responsive Design**: Mobile-friendly interface using Bootstrap

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router 7** - Client-side routing
- **Bootstrap 5** - Styling and components
- **Axios** - HTTP client for API requests
- **JWT** - Token-based authentication

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see [OpenInvite_Backend](https://github.com/M1TCH3llM/OpenInvite_Backend))

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M1TCH3llM/OpenInvite_Frontend.git
   cd OpenInvite_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```
   
   For production:
   ```env
   REACT_APP_API_URL=http://your-backend-url:8080/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

## 🏗️ Project Structure

```
OpenInvite_Frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── EventDetailsPage.jsx
│   │   ├── CreateEventPage.jsx
│   │   └── SearchPage.jsx
│   ├── services/        # API service layer
│   │   └── authService.js
│   ├── App.jsx          # Main app component
│   └── index.jsx        # Entry point
├── .env                 # Environment variables
├── package.json
└── README.md
```

## 🔑 Key Features Explained

### Authentication Flow
- Uses JWT tokens stored in localStorage
- Protected routes redirect to login if not authenticated
- Automatic token inclusion in API requests via Axios interceptors

### State Management
- AuthContext provides global authentication state
- Local component state for UI-specific data
- API responses cached where appropriate

### Routing
- `/` - Home page (protected)
- `/login` - Login page
- `/register` - Registration page
- `/profile/:userId` - User profile view
- `/events` - Events list
- `/events/:eventId` - Event details
- `/events/new` - Create new event
- `/search` - User search

## 🎨 Styling

The app uses Bootstrap 5 for styling with custom CSS overrides. Key design elements:

- **Color Scheme**: Primary blue with accent colors
- **Typography**: Modern, readable fonts
- **Layout**: Responsive grid system
- **Components**: Bootstrap cards, buttons, forms, and navigation

## 🚀 Deployment

### Automated CI/CD (Jenkins)

The project is configured for automatic deployment via Jenkins:

1. **Push to GitHub** triggers webhook
2. **Jenkins pipeline** runs:
   - Checkout code
   - Install dependencies
   - Build production bundle
   - Deploy to AWS EC2
   - Restart Nginx

### Manual Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to your web server

3. Configure Nginx to serve the static files:
   ```nginx
   server {
       listen 80;
       root /var/www/open-invite;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://backend-server:8080/api;
       }
   }
   ```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🐛 Common Issues

**Issue**: API requests failing with CORS errors
- **Solution**: Ensure backend CORS is configured to allow requests from frontend URL

**Issue**: "Module not found" errors
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`

**Issue**: Build warnings about missing dependencies
- **Solution**: Review ESLint warnings and add missing dependencies to useEffect arrays

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8080/api` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [OpenInvite Backend](https://github.com/M1TCH3llM/OpenInvite_Backend) - Spring Boot REST API
- [OpenInvite Infrastructure](https://github.com/M1TCH3llM/OpenInvite_Infrastructure_Management) - Terraform & Ansible configs

## 👤 Author

**Mitchell Morgan**


For issues and questions:
- Open an issue on GitHub
- Contact: Mitchell Morgan 

##Test for gitHup hooks to jenkins 1