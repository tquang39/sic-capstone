import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Star, Heart, ArrowLeft, Share2, Calendar, Tag, Monitor } from 'lucide-react';

const GameDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchGameDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchGameDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/games/${id}`);
      setGame(response.data);
      setIsLiked(response.data.is_liked || false);
    } catch (error) {
      console.error('Error fetching game details:', error);
      setError('Failed to load game details');
      // Fallback demo data
      setGame(getDemoGame());
    } finally {
      setLoading(false);
    }
  };

  const getDemoGame = () => ({
    id: parseInt(id),
    title: "The Witcher 3: Wild Hunt",
    description: "The Witcher 3: Wild Hunt is an action role-playing game with a third-person perspective. Players control Geralt of Rivia, a monster slayer known as a Witcher. The game features a vast open world with a third-person perspective. Players control Geralt of Rivia, a monster slayer known as a Witcher. The game features a vast open world with a third-person perspective.",
    genre: "RPG",
    platform: "PC, PlayStation 4, Xbox One, Nintendo Switch",
    rating: 4.8,
    likes: 1250,
    views: 8900,
    price: 29.99,
    release_date: "2015-05-19",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop"
    ],
    features: [
      "Vast open world",
      "Compelling story",
      "Multiple endings",
      "Monster hunting",
      "Character customization"
    ]
  });

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    try {
      if (isLiked) {
        await api.delete(`/games/${id}/like`);
        setIsLiked(false);
        setGame(prev => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        await api.post(`/games/${id}/like`);
        setIsLiked(true);
        setGame(prev => ({ ...prev, likes: prev.likes + 1 }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Games</span>
      </Link>

      {/* Game Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Game Image */}
        <div className="lg:col-span-2">
          <img
            src={game.image_url}
            alt={game.title}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(game.release_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{game.genre}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            {renderStars(game.rating)}
            <span className="text-lg font-semibold text-gray-900">
              {game.rating}
            </span>
            <span className="text-gray-600">({game.views} reviews)</span>
          </div>

          {/* Price */}
          {game.price && (
            <div className="text-3xl font-bold text-primary-600">
              ${game.price}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${
                isLiked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{game.likes}</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Platform */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Monitor className="h-5 w-5" />
            <span>{game.platform}</span>
          </div>

          {/* Developer & Publisher */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-900">Developer:</span>
              <span className="text-gray-600 ml-2">{game.developer}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Publisher:</span>
              <span className="text-gray-600 ml-2">{game.publisher}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Game</h2>
        <p className="text-gray-700 leading-relaxed">{game.description}</p>
      </div>

      {/* Features */}
      {game.features && game.features.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {game.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Screenshots */}
      {game.screenshots && game.screenshots.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {game.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`${game.title} screenshot ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}

      {/* Similar Games */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would be populated with similar games from the API */}
          <div className="card p-4 text-center">
            <p className="text-gray-500">Similar games would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail; 