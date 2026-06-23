export const formatTemp = (temp) => Math.round(temp)

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '🌤️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️',
  }
  return iconMap[iconCode] || '🌡️'
}

export const getWeatherColor = (description) => {
  const desc = description.toLowerCase()
  if (desc.includes('clear')) return 'from-yellow-400 to-orange-500'
  if (desc.includes('cloud')) return 'from-gray-400 to-gray-600'
  if (desc.includes('rain')) return 'from-blue-400 to-blue-600'
  if (desc.includes('snow')) return 'from-blue-200 to-blue-400'
  if (desc.includes('thunder')) return 'from-purple-400 to-purple-700'
  if (desc.includes('mist') || desc.includes('fog')) return 'from-gray-300 to-gray-500'
  return 'from-blue-400 to-blue-600'
}
