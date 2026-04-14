import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken) => {
        set({ user, token, refreshToken, isAuthenticated: true })
      },

      updateUser: (updates) => {
        set(state => ({ user: { ...state.user, ...updates } }))
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      isAdmin: () => get().user?.role === 'admin',
      isPremium: () => ['premium', 'admin'].includes(get().user?.role),
    }),
    {
      name: 'resume-ai-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        document.documentElement.setAttribute('data-theme', newTheme)
      },
      initTheme: () => {
        const theme = get().theme
        document.documentElement.setAttribute('data-theme', theme)
      }
    }),
    { name: 'resume-ai-theme' }
  )
)

export const useResumeStore = create((set, get) => ({
  currentResume: null,
  isDirty: false,
  isSaving: false,
  activeSection: null,

  setCurrentResume: (resume) => set({ currentResume: resume, isDirty: false }),

  updateSection: (section, data) => {
    set(state => ({
      currentResume: state.currentResume ? {
        ...state.currentResume,
        [section]: data
      } : null,
      isDirty: true
    }))
  },

  updatePersonalInfo: (field, value) => {
    set(state => ({
      currentResume: state.currentResume ? {
        ...state.currentResume,
        personalInfo: { ...state.currentResume.personalInfo, [field]: value }
      } : null,
      isDirty: true
    }))
  },

  updateTheme: (themeUpdates) => {
    set(state => ({
      currentResume: state.currentResume ? {
        ...state.currentResume,
        theme: { ...state.currentResume.theme, ...themeUpdates }
      } : null,
      isDirty: true
    }))
  },

  setIsSaving: (val) => set({ isSaving: val }),
  setIsDirty: (val) => set({ isDirty: val }),
  setActiveSection: (section) => set({ activeSection: section }),
  clearResume: () => set({ currentResume: null, isDirty: false, activeSection: null })
}))
