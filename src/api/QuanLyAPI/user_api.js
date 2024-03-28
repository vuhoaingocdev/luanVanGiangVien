import ApiManager from './ApiManager';

export const user_login = async data => {
  try {
    const result = await ApiManager.post('/api/jwt/Login', data);

    return result;
  } catch (error) {
    return error.response.data;
  }
};
