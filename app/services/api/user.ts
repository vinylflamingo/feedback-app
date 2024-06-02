import type { User } from '~/types/User'
import { apiClient, handleErrors } from '.'
import { USER_API_CALLS } from '~/constants/api-calls'
import { UserApi } from '~/constants/enums'

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

export const currentUser = async (): Promise<User | undefined> => {
  try {
    const response = await apiClient.get('/users/me')
    if (response.status === 200) return response.data as User
    else throw new Error(response.statusText)
  } catch (e: any){
    handleErrors(e)
  }
  

}