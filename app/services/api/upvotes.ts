import { apiClient, handleErrors } from '.';

export const upvoteSuggestion = async (suggestionId: number): Promise<void> => {
  try {
    await apiClient.post(`/upvote/${suggestionId}`);
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to upvote suggestion');
  }
};
