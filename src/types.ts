export interface Post {
  id: number | string;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
  data_atualizacao: string;
}

export interface PostsListResponse {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
}

export interface PostsSearchResponse {
  posts: Post[];
}

export type PostAction =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'REMOVE_POST'; payload: string | number };

export interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
