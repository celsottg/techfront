import axios, { type AxiosRequestHeaders } from 'axios';

const ALUNO_ACCESS_TOKEN = 'aluno-dev-token-change-me';
const PROFESSOR_ACCESS_TOKEN = 'professor-dev-token-change-me';

const defaultHeaders = {
  'Content-Type': 'application/json',
} as AxiosRequestHeaders;

export const apiAluno = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    ...defaultHeaders,
    Authorization: `Bearer ${ALUNO_ACCESS_TOKEN}`,
  },
});

export const apiProfessor = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    ...defaultHeaders,
    Authorization: `Bearer ${PROFESSOR_ACCESS_TOKEN}`,
  },
});

const api = apiAluno;

export default api;
