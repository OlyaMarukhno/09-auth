import { fetchNoteById } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

export async function generateMetadata({params}:NoteDetailsProps): Promise<Metadata> {
    const {id} = await params;
    const note =  await fetchNoteById(id);
    return {
      title:  note.title,
      description: note.content,
      openGraph:{
        title: note.title,
        description: note.content,
        url: `https://notehub.com/notes/${note.id}`,
        images: [{url:'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        }],
      }
    }
}

interface NoteDetailsProps{
    params: Promise <{id: string}>;
}

export default async function NoteDetails (props : NoteDetailsProps){
    const {id} = await props.params;

	const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    
  })

    return(
	<HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient/>
    </HydrationBoundary>

    );
}