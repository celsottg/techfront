import type { Post, PostAction, PostState } from '../types';

export const initialPostState: PostState = {
  posts: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export function postReducer(state: PostState, action: PostAction): PostState {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
      };
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((post: Post) =>
          post.id === action.payload.id ? action.payload : post,
        ),
      };
    case 'REMOVE_POST':
      return {
        ...state,
        posts: state.posts.filter((post: Post) => post.id !== action.payload),
      };
    default:
      return state;
  }
}
