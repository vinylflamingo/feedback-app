import type { AxiosInstance, AxiosResponse } from 'axios';
import { stores, handleErrors, prepareData, apiClient } from '.';
import type { SuggestionCount } from '~/types';

export const createSuggestion = async (formData: Record<string, any>): Promise<number> => {
  try {
    formData.status = 'Suggestion';
    formData.completed = false;
    const response = await apiClient.post('/suggestions', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.status === 200 && response.data.id ? response.data.id : NaN;
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to create suggestion');
  }
};

export const updateSuggestion = async (
  suggestionId: number,
  formData: Record<string, any>
): Promise<number> => {
  try {
    const response = await apiClient.put(
      `/suggestions?suggestion_id=${suggestionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.status === 200 && response.data.id ? response.data.id : NaN;
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to update suggestion');
  }
};

export const readSuggestions = async (params?: Record<string, any>): Promise<any> => {
  try {
    const response = await apiClient.get('/suggestions', {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    });
    return params?.suggestion_id ? (response.data.length ? response.data[0] : null) : response.data;
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to read suggestions');
  }
};

export const getRoadmapCounts = async (): Promise<Record<string, number>> => {
  try {
    const response = await apiClient.get<SuggestionCount[]>('/suggestion-counts', {
      params: {
        statuses: ['Planned', 'In Progress', 'Live'],
      },
      paramsSerializer: (params) => {
        return Object.keys(params)
          .map(key => params[key].map((value: string) => `${key}=${encodeURIComponent(value)}`).join('&'))
          .join('&');
      }
    });
    const roadmapCounts: Record<string, number> = {};
    response.data.forEach((countObj) => {
      if (countObj.type === 'status') {
        Object.entries(countObj.data).forEach(([key, value]) => {
          roadmapCounts[key] = value;
        });
      }
    });
    return roadmapCounts;
  } catch (error) {
    handleErrors(error);
    throw new Error('Failed to get roadmap counts');
  }
};
