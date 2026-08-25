import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  query: string = '',
  currentPage: number = 1,
  tag?: string,
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
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
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function fetchNoteById(taskId: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`/notes/${taskId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function checkSession(): Promise<User | null> {
  const cookieStore = await cookies();
  try {
    const response = await api.get<User>('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}