import React, { useState, useEffect } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { weatherAPI } from '../services/weatherAPI'

const LocationSearch = ({ onWeatherFetch, onLoadingChange, onError }) => {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2) {
        handleSearch()
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handleSearch = async () => {
    try {
      setSearching(true)
      const response = await weatherAPI.searchLocations(search)
      setSuggestions(response.data.locations || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const fetchWeather = async (locationName) => {
    try {
      setLoading(true)
      onLoadingChange?.(true)
      onError?.('')
      const weather = await weatherAPI.getCurrentWeather(locationName)
      onWeatherFetch(weather.data)
    } catch (error) {
      console.error('Error fetching weather:', error)
      onError?.('Could not find weather for that location. Try a different search.')
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  const handleLocationClick = async (location) => {
    const locationName = `${location.name}${location.sys ? ',' + location.sys.country : ''}`
    setSearch(locationName)
    setSuggestions([])
    setShowSuggestions(false)
    await fetchWeather(locationName)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (search.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      await fetchWeather(search)
    }
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a city..."
            disabled={loading}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition-shadow"
          />
          {(loading || searching) && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-10 overflow-hidden">
              {suggestions.map((location, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLocationClick(location)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{location.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{location.sys?.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !search.trim()}
          className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Go'}
        </button>
      </form>
    </div>
  )
}

export default LocationSearch
