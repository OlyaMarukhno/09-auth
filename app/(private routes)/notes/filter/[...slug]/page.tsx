import { fetchNotes as FetchNotes } from '@/lib/api/serverApi';
import css from './App.module.css';
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next';


export async function generateMetadata({params}:AppProps): Promise<Metadata> {
 return{
    title: `Notes - ${(await params).slug[0]}`,
  description: `Browse notes tagged with ${(await params).slug[0]}.Notehub allows you to filter and view notes based on specific tags for better experience`,
  openGraph: {
    type: "website",
    title: `Notes - ${(await params).slug[0]}`,
    description: `Browse notes tagged with ${(await params).slug[0]}.Notehub allows you to filter and view notes based on specific tags for better experience`,
    url: "https://notehub.com/",
    images: [{url:"https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      width: 1200,
          height: 630,
          alt: 'App Improvements',
    }],
  }
 }
}

type AppProps ={
  params: Promise<{slug: string[]}>;
}

export default async function App(props : AppProps) {

  const queryClient = new QueryClient()

    const tagFromUrl = (await props.params).slug[0] === "All" ? "" : (await props.params).slug[0];
  const page = 1;
  const search = "";
  await queryClient.prefetchQuery({
    queryKey: ['notes', search, page, tagFromUrl],
    queryFn: () => FetchNotes(search, page, tagFromUrl),
  })


  return (
    <>
      <div className={css.app}>
       <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient currentTag ={(await props.params).slug[0]}/>
    </HydrationBoundary>
      </div>
    </>
  );
}