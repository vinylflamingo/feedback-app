import type { AxiosResponse } from 'axios';
import { stores, cookies, handleErrors, prepareData, apiClient } from '.';


export const login = async (formData: Record<string, any>): Promise<void> => {
  try {
    const data = prepareData(
      { username: formData.username, password: formData.password },
      'application/x-www-form-urlencoded'
    );
    const response = await apiClient.post('/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    updateCookiesAndStore(response);
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to log in');
  }
};

export const refreshAuthToken = async (): Promise<void> => {
  try {
    const response = await apiClient.post(
      '/refresh_token',
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.status === 200) {
      updateCookiesAndStore(response);
    } else {
      throw new Error(response.statusText);
    }
  } catch (error: any) {
    handleErrors(error);
  }
};

export const clearToken = (): void => {
  stores.authStore.setToken(null);
  stores.authStore.setTokenExpiration(null);
  stores.authStore.setUserId(null);
  cookies.tokenCookie.value = null;
  cookies.expirationCookie.value = null;
  cookies.userCookie.value = null;
  delete apiClient.defaults.headers.common['Authorization'];
};

export const updateCookiesAndStore = (response: AxiosResponse) => {
  try {
    const tokenLifetime = parseInt(stores.runtimeConfig.public.TOKEN_LIFETIME || '60');
    const token = response.data.access_token;
    const expiresIn = tokenLifetime * 60; // Convert minutes to seconds
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

    stores.authStore.setToken(token);
    stores.authStore.setUserId(response.data.user_id);
    stores.authStore.setTokenExpiration(expirationDate);

    cookies.tokenCookie.value = token;
    cookies.userCookie.value = response.data.user_id;
    cookies.expirationCookie.value = expirationDate.toISOString();

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    stores.userStore.refreshStore();
    
    console.log("Successfully updated cookies and store.");
  } catch (error: any) {
    handleErrors(error);
    throw new Error('Failed to set cookie and store');
  }
};
