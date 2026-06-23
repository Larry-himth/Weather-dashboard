import React from 'react'
import { Cloud, Wind, Droplets, Eye } from 'lucide-react'
import { formatTemp, getWeatherColor } from '../utils/formatters'

const KPIPanel = ({ weather, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse shadow-lg">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-3">--°</div>
          <div className="text-lg text-gray-400 dark:text-gray-500">Loading weather...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return null
  }

  if (!weather) {
    return null
  }

  const temp = formatTemp(weather.main.temp)
  const condition = weather.weather[0].main
  const description = weather.weather[0].description
  const humidity = weather.main.humidity
  const windSpeed = weather.wind.speed
  const visibility = (weather.visibility / 1000).toFixed(1)
  const feelsLike = formatTemp(weather.main.feels_like)

  return (
    <div className={`bg-gradient-to-br ${getWeatherColor(description)} p-8 sm:p-12 rounded-2xl shadow-2xl text-white transition-all duration-500`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 opacity-90">{weather.name}</h2>
          <div className="flex items-end gap-6">
            <div className="text-7xl sm:text-8xl font-bold leading-none">{temp}°</div>
            <div className="pb-2">
              <p className="text-2xl sm:text-3xl capitalize font-semibold">{condition}</p>
              <p className="text-base sm:text-lg opacity-90 capitalize">{description}</p>
              <p className="text-sm opacity-75 mt-1">Feels like {feelsLike}°</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: Droplets, label: 'Humidity', value: `${humidity}%` },
            { icon: Wind, label: 'Wind', value: `${windSpeed.toFixed(1)} m/s` },
            { icon: Eye, label: 'Visibility', value: `${visibility} km` },
            { icon: Cloud, label: 'Clouds', value: `${weather.clouds.all}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 hover:bg-white/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 opacity-90" />
                <span className="text-xs sm:text-sm font-semibold opacity-90">{label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KPIPanel
