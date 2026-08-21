import axios from 'axios';
import type { Note } from '../types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function FetchNotes(
  query: string = '',
  currentPage: number,
  tag?: string,
): Promise<FetchNotesResponse> {
  if(tag === 'all' || tag === 'All'){
    tag = undefined;
  }
  const response = await axios.get<FetchNotesResponse>(
    `https://notehub-public.goit.study/api/notes/`,
    {
      params: {
        search: query,
        page: currentPage,
        perPage: 12,
        tag,
      },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

interface CreatedNote {
  title: string;
  content: string | null;
  tag: string;
}

export async function createNote(newNote: CreatedNote):Promise<Note> {
  const response = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes/',
    newNote,{
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function deleteNote(taskId: string):Promise<Note> {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${taskId}`,
    {headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function fetchNoteById(taskId: string): Promise<Note>{
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${taskId}`,
        {headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}
