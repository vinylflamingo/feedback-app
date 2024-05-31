import { apiClient, handleErrors } from '.'

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