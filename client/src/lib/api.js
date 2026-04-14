import axios from 'axios'
import { useAuthStore } from '../stores'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const { refreshToken, setAuth, logout } = useAuthStore.getState()

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken })
          const { token, refreshToken: newRefresh, user } = res.data
          setAuth(user || useAuthStore.getState().user, token, newRefresh)
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        } catch {
          logout()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } else {
        logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`)
}

// Resume API
export const resumeAPI = {
  getAll: (params) => api.get('/resumes', { params }),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
  share: (id) => api.post(`/resumes/${id}/share`),
  getShared: (token) => api.get(`/resumes/share/${token}`),
  uploadPhoto: (id, formData) => api.post(`/resumes/${id}/upload-photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getVersions: (id) => api.get(`/resumes/${id}/versions`),
  restoreVersion: (id, versionIndex) => api.post(`/resumes/${id}/restore/${versionIndex}`),
  generateAIContent: (data) => api.post('/resumes/ai/generate', data)
}

// Analyzer API
export const analyzerAPI = {
  analyze: (formData) => api.post('/analyzer/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  getAll: (params) => api.get('/analyzer/analyses', { params }),
  getById: (id) => api.get(`/analyzer/analyses/${id}`),
  delete: (id) => api.delete(`/analyzer/analyses/${id}`),
  compareJD: (id, data) => api.post(`/analyzer/analyses/${id}/compare-jd`, data),
  getDashboardStats: () => api.get('/analyzer/dashboard-stats')
}

// User API
export const userAPI = {
  getDashboard: () => api.get('/users/dashboard'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: () => api.delete('/users/account')
}

// Template API
export const templateAPI = {
  getAll: (params) => api.get('/templates', { params }),
  getById: (id) => api.get(`/templates/${id}`)
}

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getResumes: (params) => api.get('/admin/resumes', { params }),
  createTemplate: (data) => api.post('/admin/templates', data),
  updateTemplate: (id, data) => api.put(`/admin/templates/${id}`, data)
}

export default api
