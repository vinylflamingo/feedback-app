// services/api.ts

import type { AxiosInstance } from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import { useCookie } from '#app'
import qs from 'qs'
import type { Api, Suggestion } from '~/types'
import { useRuntimeConfig } from '#app'

let apiClient: AxiosInstance

export const TOKEN_COOKIE: string = 'auth_token'
export const TOKEN_EXPIRATION_COOKIE: string = 'auth_token_expiration'
let isRefreshing: boolean = false
let isBuildMode: boolean = false

export const setApiClient = (client: AxiosInstance) => {
  apiClient = client
}

export const enableBuildMode = () => {
  isBuildMode = true
}

const handleErrors = (error: any) => {
  if (error.response) {
    console.error('API response error:', error.response.data)
    console.error('API response status:', error.response.status)
    console.error('API response headers:', error.response.headers)
  } else if (error.request) {
    console.error('API no response received:', error.request)
  } else {
    console.error('API request error:', error.message)
  }
}

export const prepareData = (
  formData: Record<string, any>,
  contentType: string
) => {
  if (contentType === 'application/x-www-form-urlencoded') {
    return qs.stringify(formData)
  }
  return formData
}

export const login = async (formData: Record<string, any>): Promise<void> => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie(TOKEN_COOKIE)
  const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE)
  const config = useRuntimeConfig()
  const tokenLifetime = parseInt(config.public.TOKEN_LIFETIME || '60')

  // console.log('Starting login process')
  // console.log('Received form data:', formData)

  try {
    const data = prepareData(
      { username: formData.username, password: formData.password },
      'application/x-www-form-urlencoded'
    )
    // console.log('Prepared data for API request:', data)

    const response = await apiClient.post('/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // console.log('Received response from API:', response)
    
    const token = response.data.access_token
    // console.log('Extracted access token:', token)

    const expiresIn = tokenLifetime * 60 // Convert minutes to seconds
    // console.log('Calculated token expiration time in seconds:', expiresIn)

    authStore.setToken(token)
    // console.log('Token set in auth store')

    tokenCookie.value = token
    // console.log('Token saved in cookie')

    setAuthToken(token)
    // console.log('Token set in auth headers')

    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn)
    // console.log('Calculated token expiration date:', expirationDate)

    authStore.setTokenExpiration(expirationDate)
    // console.log('Token expiration date set in auth store')

    tokenExpirationCookie.value = expirationDate.toISOString()
    // console.log('Token expiration date saved in cookie')
    
    // console.log('Login process completed successfully')
  } catch (error: any) {
    console.error('Error during login process:', error)
    handleErrors(error)
    console.error('Handled error during login process')
    throw new Error('Failed to log in')
  }
}

export const refreshAuthToken = async (): Promise<string | null> => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie(TOKEN_COOKIE)
  const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE)
  const config = useRuntimeConfig()
  const tokenLifetime = parseInt(config.public.TOKEN_LIFETIME || '60') // Lifetime in minutes

  try {
    const response = await apiClient.post(
      '/refresh_token',
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const newToken = response.data.access_token
    authStore.setToken(newToken)
    tokenCookie.value = newToken
    setAuthToken(newToken)

    const expiresIn = tokenLifetime * 60 // Convert minutes to seconds
    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn)
    authStore.setTokenExpiration(expirationDate)
    tokenExpirationCookie.value = expirationDate.toISOString()

    return newToken
  } catch (error: any) {
    handleErrors(error)
    return null
  } finally {
    isRefreshing = false
  }
}

export const clearToken = (): void => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie(TOKEN_COOKIE)
  const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE)
  authStore.setToken(null)
  authStore.setTokenExpiration(null)
  tokenCookie.value = null
  tokenExpirationCookie.value = null
  clearAuthToken()
}

export const setAuthToken = (token: string): void => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearAuthToken = (): void => {
  delete apiClient.defaults.headers.common['Authorization']
}

// API Calls
export const createUser = async (formData: Record<string, any>): Promise<void> => {
  try {
    await apiClient.post('/users', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to create user')
  }
}

export const createSuggestion = async (formData: Record<string, any>): Promise<number> => {
  try {
    formData.status = 'Suggestion'
    formData.completed = false
    const response = await apiClient.post('/suggestions', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200 && response.data.id) {
      return response.data.id
    } else {
      return NaN
    }
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to create suggestion')
  }
}

export const updateSuggestion = async (
  suggestionId: number,
  formData: Record<string, any>
): Promise<number> => {
  try {
    const response = await apiClient.put(
      `/suggestions/${suggestionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 200 && response.data.id) {
      return response.data.id
    } else {
      return NaN
    }
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to update suggestion')
  }
}

export const getSuggestion = async (suggestionId: number): Promise<Suggestion | null> => {
  try {
    const response = await apiClient.get(`/suggestions/${suggestionId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200 && response.data) {
      return response.data
    } else {
      return null
    }
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to fetch suggestion')
  }
}

export const readTopSuggestions = async (params?: Record<string, any>): Promise<any> => {
  try {
    const response = await apiClient.get('/top', {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    return response.data
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to read top suggestions')
  }
}

export const readAllSuggestions = async (params?: Record<string, any>): Promise<any> => {
  try {
    const response = await apiClient.get('/all', {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    return response.data
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to read all suggestions')
  }
}

export const readSuggestionsByCategory = async (
  category: string,
  params?: Record<string, any>
): Promise<any> => {
  try {
    const response = await apiClient.get(
      `/suggestions/category/${category}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params
      }
    )
    return response.data
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to read suggestions by category')
  }
}

export const readSuggestionsByStatus = async (
  status: string,
  params?: Record<string, any>
): Promise<any> => {
  try {
    const response = await apiClient.get(`/suggestions/status/${status}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    return response.data
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to read suggestions by status')
  }
}

export const addComment = async (
  suggestionId: number,
  formData: Record<string, any>
): Promise<void> => {
  try {
    const data = prepareData(formData, 'application/json')
    await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to add comment')
  }
}

export const addChildComment = async (
  suggestionId: number,
  commentId: string,
  formData: Record<string, any>
): Promise<void> => {
  try {
    const data = prepareData(
      { ...formData, parent_comment_id: commentId },
      'application/json'
    )
    await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to add child comment')
  }
}

export const readCommentsBySuggestion = async (
  suggestionId: number,
  params?: Record<string, any>
): Promise<any> => {
  try {
    const response = await apiClient.get(
      `/suggestions/${suggestionId}/comments`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params
      }
    )
    return response.data
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to read comments by suggestion')
  }
}

export const upvoteSuggestion = async (suggestionId: number): Promise<void> => {
  try {
    await apiClient.post(`/suggestions/${suggestionId}/upvote`)
  } catch (error: any) {
    handleErrors(error)
    throw new Error('Failed to upvote suggestion')
  }
}

export default {
  setApiClient,
  enableBuildMode,
  login,
  refreshAuthToken,
  clearToken,
  createUser,
  createSuggestion,
  updateSuggestion,
  getSuggestion,
  readTopSuggestions,
  readAllSuggestions,
  readSuggestionsByCategory,
  readSuggestionsByStatus,
  addComment,
  addChildComment,
  readCommentsBySuggestion,
  upvoteSuggestion,
  TOKEN_COOKIE,
  TOKEN_EXPIRATION_COOKIE
}
