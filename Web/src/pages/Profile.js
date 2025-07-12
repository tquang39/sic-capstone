import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GameCard from '../components/GameCard';
import api from '../services/api';
import { User, Heart, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    birth_date: user?.birth_date || '',
    bio: user?.bio || ''
  });

  useEffect(() => {
    fetchFavoriteGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFavoriteGames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/favorites');
      setFavoriteGames(response.data);
    } catch (error) {
      console.error('Error fetching favorite games:', error);
      // Fallback demo data
      setFavoriteGames(getDemoFavorites());
    } finally {
      setLoading(false);
    }
  };

  const getDemoFavorites = () => [
    {
      id: 1,
      title: "The Witcher 3: Wild Hunt",
      description: "An action role-playing game with a vast open world and compelling story.",
      genre: "RPG",
      platform: "PC/PS4/Xbox",
      rating: 4.8,
      likes: 1250,
      views: 8900,
      price: 29.99,
      image_url: "https://via.placeholder.com/300x200?text=The+Witcher+3"
    },
    {
      id: 2,
      title: "Red Dead Redemption 2",
      description: "An epic tale of life in America's unforgiving heartland.",
      genre: "Action",
      platform: "PC/PS4/Xbox",
      rating: 4.7,
      likes: 1100,
      views: 7600,
      price: 39.99,
      image_url: "https://via.placeholder.com/300x200?text=Red+Dead+Redemption+2"
    }
  ];

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', editForm);
      // Update user context if needed
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      birth_date: user?.birth_date || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 btn-secondary"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={editForm.birth_date}
                onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">Full Name: {user?.full_name || 'N/A'}</p>
            <p className="text-gray-700">Phone: {user?.phone || 'N/A'}</p>
            <p className="text-gray-700">Birth Date: {user?.birth_date || 'N/A'}</p>
            <p className="text-gray-700">{user?.bio || "No bio added yet. Click 'Edit Profile' to add one!"}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {favoriteGames.length}
          </div>
          <div className="text-gray-600">Favorite Games</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {user?.games_played || 0}
          </div>
          <div className="text-gray-600">Games Played</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {user?.reviews_count || 0}
          </div>
          <div className="text-gray-600">Reviews Written</div>
        </div>
      </div>

      {/* Favorite Games */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Heart className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Favorite Games</h2>
        </div>
        
        {favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite games yet</h3>
            <p className="text-gray-600">
              Start exploring games and add them to your favorites!
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="card p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-gray-700">Added The Witcher 3 to favorites</span>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-gray-700">Wrote a review for Red Dead Redemption 2</span>
              <span className="text-sm text-gray-500">1 week ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-gray-700">Joined GameRec</span>
              <span className="text-sm text-gray-500">1 month ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 