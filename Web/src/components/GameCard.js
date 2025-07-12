import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const GameCard = ({ game }) => {
  const { isAuthenticated, user } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Load user's rating from localStorage on component mount
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const savedRating = localStorage.getItem(`rating_${user.email}_${game.id}`);
      if (savedRating) {
        setUserRating(parseInt(savedRating));
      }
    }
  }, [isAuthenticated, user, game.id]);

  const handleRating = async (rating) => {
    if (!isAuthenticated) {
      // Show login prompt or redirect
      return;
    }

    try {
      setIsRating(true);
      await api.post(`/games/${game.id}/rate`, { rating });
      setUserRating(rating);
      
      // Save rating to localStorage for persistence
      if (user) {
        localStorage.setItem(`rating_${user.email}_${game.id}`, rating.toString());
      }
      
      // Emit event to notify other components
      window.dispatchEvent(new CustomEvent('ratingChanged', {
        detail: { gameId: game.id, rating: rating }
      }));
      
      console.log(`Rated game ${game.id} with ${rating} stars`);
    } catch (error) {
      console.error('Error rating game:', error);
    } finally {
      setIsRating(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="card overflow-hidden group">
      <div className="relative">
        <Link to={`/game/${game.id}`}>
          <img
            src={game.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop'}
            alt={game.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop';
            }}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {game.genre}
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {game.platform}
          </div>
        </Link>
      </div>
      <div className="p-4">
        <Link to={`/game/${game.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {game.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(game.rating || 0)}
            <span className="text-sm text-gray-600 ml-1">
              ({game.rating || 0})
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm">{game.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{game.views || 0}</span>
            </div>
          </div>
        </div>
        {/* User Rating Section */}
        {isAuthenticated && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rate this game:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={isRating}
                    className={`p-1 rounded transition-colors ${
                      (hoverRating ? star <= hoverRating : star <= userRating)
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-400'
                    } ${isRating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            {userRating > 0 && (
              <p className="text-xs text-green-600 mt-1">
                You rated this game {userRating} stars!
              </p>
            )}
          </div>
        )}
        {game.price && (
          <div className="mt-3">
            <span className="text-lg font-bold text-primary-600">
              ${game.price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard; 