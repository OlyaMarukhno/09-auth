import { fetchNoteById } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import NotePreviewClient from "./NotePreview.client";

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
      <NotePreviewClient/>
    </HydrationBoundary>

    );
}