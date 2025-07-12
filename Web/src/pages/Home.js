import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Star, Flame } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [newGames, setNewGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Listen for rating changes
  useEffect(() => {
    const handleRatingChange = () => {
      if (isAuthenticated) {
        fetchRecommendedGames();
      }
    };

    window.addEventListener('ratingChanged', handleRatingChange);
    return () => window.removeEventListener('ratingChanged', handleRatingChange);
  }, [isAuthenticated]);

  const fetchRecommendedGames = async () => {
    if (!isAuthenticated) {
      setRecommendedGames([]);
      return;
    }
    
    try {
      const recommendedResponse = await api.get('/games/recommended');
      setRecommendedGames(recommendedResponse.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendedGames([]);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      
      // Fetch recommended games (only if authenticated)
      await fetchRecommendedGames();
      
      // Fetch popular games
      const popularResponse = await api.get('/games/popular');
      setPopularGames(popularResponse.data);
      
      // Fetch new games
      const newResponse = await api.get('/games/new');
      setNewGames(newResponse.data);
    } catch (error) {
      console.error('Error fetching games:', error);
      // Fallback data for demo
      setRecommendedGames([]);
      setPopularGames(getDemoGames());
      setNewGames(getDemoGames());
    } finally {
      setLoading(false);
    }
  };

  const getDemoGames = () => [
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
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop"
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
      image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Cyberpunk 2077",
      description: "An open-world action-adventure story set in Night City.",
      genre: "RPG",
      platform: "PC/PS5/Xbox",
      rating: 4.2,
      likes: 850,
      views: 5400,
      price: 49.99,
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Elden Ring",
      description: "A new fantasy action RPG set in a world created by Hidetaka Miyazaki.",
      genre: "Action RPG",
      platform: "PC/PS5/Xbox",
      rating: 4.9,
      likes: 1400,
      views: 9200,
      price: 59.99,
      image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        {isAuthenticated ? (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome back, <span className="text-primary-600">{user?.username}!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Here are your personalized game recommendations. Rate games to improve your suggestions!
            </p>
            <Link to="/search" className="btn-primary text-lg px-8 py-3">
              Explore More Games
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Discover Your Next
              <span className="text-primary-600"> Favorite Game</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get personalized game recommendations based on your preferences and discover amazing titles you'll love.
            </p>
            <Link to="/search" className="btn-primary text-lg px-8 py-3">
              Start Exploring
            </Link>
          </>
        )}
      </div>

      {/* Recommended Games */}
      {isAuthenticated ? (
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
              Powered by AI
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          {recommendedGames.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
              <p className="text-gray-600">
                Start rating games to get personalized recommendations!
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="text-center py-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Get Personalized Recommendations
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Sign up to get AI-powered game recommendations based on your preferences!
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Sign Up Now
          </Link>
        </section>
      )}

      {/* Popular Games */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">Popular Games</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">New Releases</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="text-center py-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Game?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of gamers who have discovered their favorite titles through our recommendation system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/search" className="btn-secondary text-lg px-8 py-3">
              Browse All Games
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home; 