import ApiManager from './ApiManager';

export const giangvien_login = async data => {
  try {
    const result = await ApiManager.post('/api/jwtGV/LoginGV', data);

    return result;
  } catch (error) {
    return error.response.data;
  }
};
