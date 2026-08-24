import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function FetchNotes(
  query: string = '',
  currentPage: number,
  tag?: string,
): Promise<FetchNotesResponse> {
  if (tag === 'all' || tag === 'All') {
    tag = undefined;
  }
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      search: query,
      page: currentPage,
      perPage: 12,
      tag,
    },
  });
  return response.data;
}

export async function createNote(newNote: { title: string; content?: string | null; tag: string }): Promise<Note> {
  const response = await api.post<Note>('/notes', newNote);
  return response.data;
}

export async function deleteNote(taskId: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${taskId}`);
  return response.data;
}

export async function fetchNoteById(taskId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${taskId}`);
  return response.data;
}

// Функції для авторизації та користувачів (знадобляться нам далі)
export async function register(credentials: { email: string; password: string }): Promise<User> {
  const response = await api.post<User>('/auth/register', credentials);
  return response.data;
}

export async function login(credentials: { email: string; password: string }): Promise<User> {
  const response = await api.post<User>('/auth/login', credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User>('/auth/session');
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/users/me');
  return response.data;
}

export async function updateMe(userData: { username: string }): Promise<User> {
  const response = await api.patch<User>('/users/me', userData);
  return response.data;
}