import axios from 'axios';
import {SERVER_URL, KAKAO_APP_KEY} from 'react-native-dotenv';

const API_BASE_URL = SERVER_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
