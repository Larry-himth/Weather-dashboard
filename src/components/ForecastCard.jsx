import React from 'react'
import { formatTemp, formatDate, getWeatherIcon } from '../utils/formatters'

const ForecastCard = ({ forecast, loading, error }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
        <p className="text-red-800 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!forecast || !forecast.list) {
    return null
  }

  // Get daily forecasts (one every 24 hours)
  const dailyForecasts = []
  const seen = new Set()
  
  for (let item of forecast.list) {
    const date = new Date(item.dt * 1000).toDateString()
    if (!seen.has(date)) {
      seen.add(date)
      dailyForecasts.push(item)
      if (dailyForecasts.length >= 5) break
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">5-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((day, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl p-4 border border-blue-100/80 dark:border-gray-600/60 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
          >
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
              {formatDate(day.dt * 1000)}
            </p>
            <p className="text-4xl mb-3">{getWeatherIcon(day.weather[0].icon)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
              {day.weather[0].description}
            </p>
            <div className="flex justify-around text-sm font-semibold">
              <span className="text-blue-600 dark:text-blue-400">{formatTemp(day.main.temp_max)}°</span>
              <span className="text-gray-500">{formatTemp(day.main.temp_min)}°</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">💧 {day.main.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastCard
