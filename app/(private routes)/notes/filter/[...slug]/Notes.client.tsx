'use client';

import { useState } from 'react';
import css from './App.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import { FetchNotes } from '@/lib/api/clientApi';
import { useDebouncedCallback } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';

type NotesClientProps = {
  currentTag: string;
};

export default function NotesClient({ currentTag }: NotesClientProps) {
  const [topic, setTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useDebouncedCallback((nextTopic: string) => {
    setCurrentPage(1);
    setTopic(nextTopic);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', topic, currentPage, currentTag],
    queryFn: () => FetchNotes(topic, currentPage, currentTag),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {isLoading && <p>Loading, please wait...</p>}
        {isError && !data?.notes && <p>Something went wrong.</p>}
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            changePage={setCurrentPage}
            totalPages={data.totalPages}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </>
  );
}