import { apiClient, handleErrors } from '.';

export const upvoteSuggestion = async (suggestionId: number): Promise<void> => {
  try {
    console.log("sending up vote toggle")
    await apiClient.post(`/upvote/${suggestionId}`);
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to upvote suggestion');
  }
};
