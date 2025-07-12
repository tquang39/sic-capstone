# 🎮 Game Recommendation System

A full-stack web application that provides personalized game recommendations using Collaborative Filtering (CF) algorithm, integrated with Google Sheets for data storage and user management.

## 🚀 Features

### 🔐 Authentication System
- User registration and login with JWT tokens
- Profile management with additional fields (full name, phone, birth date)
- Session persistence and auto-login
- Secure password hashing with bcrypt

### 🎯 Collaborative Filtering
- Personalized game recommendations based on user ratings
- Real-time CF model updates when users rate games
- Training data: 100,000+ ratings from 5,078 games
- Performance optimized with sample dataset for faster loading

### 📊 Google Sheets Integration
- User data storage in Google Sheets
- Real-time ratings synchronization
- Auto-creation of required sheets and tabs
- Secure service account authentication

### ⭐ Rating System
- 1-5 star rating with hover effects
- Persistent ratings (localStorage + backend)
- Real-time recommendation updates
- User-friendly interface

### 🎮 Game Management
- Game search and filtering
- Game details with screenshots and features
- Popular games and new releases sections
- Responsive design with Tailwind CSS

## 🏗️ Architecture

```
SIC_CAPSTONE/
├── backend/                 # Flask API Server
│   ├── app.py              # Main Flask application
│   ├── CF.py               # Collaborative Filtering algorithm
│   ├── google_sheets_config.py  # Google Sheets integration
│   ├── requirements.txt    # Python dependencies
│   ├── config.env          # Environment variables
│   ├── preference_df.csv   # Training data (1.7M ratings)
│   └── data/
│       └── games.csv       # Game metadata (5,078 games)
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── contexts/      # React contexts
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS config
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **Python 3.13+**
- **Flask** - Web framework
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **gspread** - Google Sheets API
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **scikit-learn** - Machine learning
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icons
- **LocalStorage** - Client-side storage

### External Services
- **Google Sheets API** - Data storage
- **Google Cloud Platform** - Service account

## 📋 Prerequisites

- Python 3.13+
- Node.js 18+
- Google Cloud Platform account
- Google Sheets API enabled

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sic-capstone.git
cd sic-capstone
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp config.env.example config.env
# Edit config.env with your settings

# Setup Google Sheets
# 1. Create Google Cloud Project
# 2. Enable Google Sheets API
# 3. Create Service Account
# 4. Download credentials.json
# 5. Share Google Sheet with service account

# Run the backend
python app.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm start
```

## ⚙️ Configuration

### Environment Variables (`backend/config.env`)
```env
# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Google Sheets Configuration
GOOGLE_SHEETS_CREDENTIALS_PATH=credentials.json
GOOGLE_SHEETS_ID=your-google-sheet-id

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### Google Sheets Setup
1. Create a new Google Sheet
2. Share it with your service account email
3. Update `GOOGLE_SHEETS_ID` in config.env
4. The system will auto-create required tabs

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Games
- `GET /api/games/recommended` - Personalized recommendations
- `GET /api/games/popular` - Popular games
- `GET /api/games/new` - New releases
- `GET /api/games/search` - Search games
- `GET /api/games/{id}` - Game details

### User Actions
- `POST /api/games/{id}/rate` - Rate a game
- `GET /api/user/ratings` - Get user ratings
- `PUT /api/user/profile` - Update profile

### Admin
- `POST /api/admin/reload-cf` - Reload CF model

## 🎯 Collaborative Filtering

The system uses a user-based collaborative filtering algorithm:

1. **Data Source**: 1.7M ratings from 100K users on 5K games
2. **Algorithm**: User-based CF with cosine similarity
3. **Performance**: Optimized with 100K sample ratings
4. **Real-time**: Model updates when users rate games

### CF Process
1. Load user ratings from CSV + Google Sheets
2. Calculate user similarity matrix
3. Generate recommendations based on similar users
4. Return personalized game suggestions

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Google Sheets service account authentication

## 📈 Performance Optimizations

- Sample dataset loading (100K vs 1.7M ratings)
- Lazy loading of CF model
- Client-side caching with localStorage
- Optimized API responses

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Add Procfile
echo "web: python app.py" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 Development

### Adding New Features
1. Backend: Add new endpoints in `app.py`
2. Frontend: Create new components in `src/components/`
3. API: Update services in `src/services/api.js`

### Database Schema
- Users: ID, username, email, password, profile data
- Ratings: email, game_id, rating, timestamp
- Games: ID, name, genre, platform, description

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Collaborative Filtering algorithm implementation
- Google Sheets API integration
- React and Flask communities
- Open source contributors

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Made with ❤️ for SIC Capstone Project** 