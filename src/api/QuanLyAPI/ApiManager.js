import axios from 'axios';

const ApiManager = axios.create({
  baseURL: 'https://apiv2.uneti.edu.vn',
  responseType: 'json',
  withCredentials: true,

  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
  },
});

export default ApiManager;
