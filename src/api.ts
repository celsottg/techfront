import axios from 'axios';

const ALUNO_ACCESS_TOKEN = 'aluno-dev-token-change-me';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ALUNO_ACCESS_TOKEN}`,
  },
});

export default api;
