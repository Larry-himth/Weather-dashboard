import axios from 'axios'

const API_BASE = '/api/weather'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const weatherAPI = {
  getCurrentWeather: (location) => api.get(`/current/${location}/`),
  getForecast: (location) => api.get(`/forecast/${location}/`),
  searchLocations: (query) => api.get('/search/', { params: { q: query } }),
  exportData: (data) => api.post('/export/', data, { responseType: 'blob' }),
  getExportHistory: () => api.get('/export-history/'),
}

export default api
