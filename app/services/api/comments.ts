import { apiClient, handleErrors, prepareData } from '.';
import type { AxiosResponse } from 'axios';

export const addComment = async (
  suggestionId: number,
  formData: Record<string, any>
): Promise<AxiosResponse> => {
  try {

    if (formData.text == "") {
      throw Error("Comment cannot be empty.")
    }

    const data = prepareData(formData, 'application/json');
    console.log(data)
    console.log(suggestionId)

    const response = await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error: any) {
    handleErrors(error);
    throw error;
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
 