import axios from 'axios';

const ApiManager = axios.create({
  responseType: 'json',
  withCredentials: true,

  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
  },
});

export default ApiManager;
