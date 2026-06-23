import React, { useState } from 'react'
import { Cloud, Download } from 'lucide-react'
import KPIPanel from '../components/KPIPanel'
import LocationSearch from '../components/LocationSearch'
import ForecastCard from '../components/ForecastCard'
import HistoricalChart from '../components/HistoricalChart'
import DataExport from '../components/DataExport'
import ThemeToggle from '../components/ThemeToggle'

const Dashboard = () => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [error, setError] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [historicalData, setHistoricalData] = useState([])

  const handleWeatherFetch = async (weatherData) => {
    setWeather(weatherData)
    setLocation(weatherData.name)
    setError('')

    try {
      setForecastLoading(true)
      const response = await fetch(`/api/weather/forecast/${weatherData.name}/`)
      if (!response.ok) throw new Error('Failed to fetch forecast')
      const forecastData = await response.json()
      setForecast(forecastData)
    } catch (err) {
      console.error('Forecast fetch error:', err)
      setForecast(null)
    } finally {
      setForecastLoading(false)
    }

    const sampleData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temp: Math.round(weatherData.main.temp + (Math.random() - 0.5) * 5),
      humidity: Math.round(weatherData.main.humidity + (Math.random() - 0.5) * 10)
    }))
    setHistoricalData(sampleData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Weather Dashboard
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8 max-w-xl mx-auto">
          <LocationSearch
            onWeatherFetch={handleWeatherFetch}
            onLoadingChange={setLoading}
            onError={setError}
          />
        </div>

        {error && (
          <div className="mb-6 max-w-xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-800 dark:text-red-400 text-center text-sm font-medium">{error}</p>
          </div>
        )}

        {(weather || loading) && (
          <div className="mb-10">
            <KPIPanel weather={weather} loading={loading} error={error} />
          </div>
        )}

        {weather && (
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setShowExport(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        )}

        {forecast && (
          <div className="mb-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200/60 dark:border-gray-700/60">
            <ForecastCard forecast={forecast} loading={forecastLoading} error={error} />
          </div>
        )}

        {historicalData.length > 0 && (
          <div className="mb-10">
            <HistoricalChart data={historicalData} loading={false} />
          </div>
        )}

        {!weather && !loading && (
          <div className="text-center py-16 sm:py-24 px-4">
            <div className="inline-flex p-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 shadow-lg border border-gray-200/60 dark:border-gray-700/60 mb-8">
              <Cloud className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
              Welcome to Weather Dashboard
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
              Search for a city to see live conditions, a 5-day forecast, and historical trends.
            </p>
          </div>
        )}
      </main>

      <DataExport
        location={location}
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  )
}

export default Dashboard
