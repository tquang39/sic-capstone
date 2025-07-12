import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import api from '../services/api';
import { Search as SearchIcon, Filter, Grid, List, Sliders } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    genre: '',
    platform: '',
    minRating: '',
    maxPrice: '',
    sortBy: 'relevance'
  });

  const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'Simulation'];
  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Rating' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' }
  ];

  useEffect(() => {
    fetchGames();
  }, [filters]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.minRating) params.append('min_rating', filters.minRating);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.sortBy) params.append('sort_by', filters.sortBy);

      const response = await api.get(`/games/search?${params.toString()}`);
      setGames(response.data);
    } catch (error) {
      console.error('Error searching games:', error);
      // Fallback demo data
      setGames(getDemoGames());
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
      image_url: "https://via.placeholder.com/300x200?text=Cyberpunk+2077"
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
      image_url: "https://via.placeholder.com/300x200?text=Elden+Ring"
    },
    {
      id: 5,
      title: "God of War Ragnarök",
      description: "Kratos and Atreus must journey to each of the Nine Realms in search of answers.",
      genre: "Action",
      platform: "PS4/PS5",
      rating: 4.9,
      likes: 1300,
      views: 8500,
      price: 69.99,
      image_url: "https://via.placeholder.com/300x200?text=God+of+War"
    },
    {
      id: 6,
      title: "Horizon Forbidden West",
      description: "Explore the mysterious frontier known as the Forbidden West.",
      genre: "Action RPG",
      platform: "PS4/PS5",
      rating: 4.6,
      likes: 950,
      views: 6800,
      price: 59.99,
      image_url: "https://via.placeholder.com/300x200?text=Horizon"
    }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const newFilters = {
      query: '',
      genre: '',
      platform: '',
      minRating: '',
      maxPrice: '',
      sortBy: 'relevance'
    };
    setFilters(newFilters);
    setSearchParams({});
  };

  const hasActiveFilters = filters.genre || filters.platform || filters.minRating || filters.maxPrice || filters.sortBy !== 'relevance';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {filters.query ? `Search Results for "${filters.query}"` : 'Browse Games'}
        </h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
                          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Sliders className="h-5 w-5" />
              </button>
            </div>

            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              {/* Genre Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={filters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Platforms</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Price</option>
                  <option value="10">Under $10</option>
                  <option value="20">Under $20</option>
                  <option value="30">Under $30</option>
                  <option value="50">Under $50</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full btn-secondary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {loading ? 'Loading...' : `${games.length} games found`}
              </span>
              {hasActiveFilters && (
                <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  Filters applied
                </span>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && games.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <SearchIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search; 