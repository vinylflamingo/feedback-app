import { apiClient, handleErrors, prepareData } from '.';

export const addComment = async (
  suggestionId: number,
  formData: Record<string, any>
): Promise<void> => {
  try {
    const data = prepareData(formData, 'application/json');
    await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to add comment');
  }
};

export const addChildComment = async (
  suggestionId: number,
  commentId: string,
  formData: Record<string, any>
): Promise<void> => {
  try {
    const data = prepareData({ ...formData, parent_comment_id: commentId }, 'application/json');
    await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to add child comment');
  }
};
