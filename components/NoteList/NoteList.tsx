"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from '@/lib/api/clientApi';
import type { Note} from "../../types/note"
import css from "./NoteList.module.css"
import Link from "next/link";


interface NoteListProps{
  notes: Note[];
}

export default function NoteList({notes}:NoteListProps){

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: deleteNote,
  onSuccess(){
    queryClient.invalidateQueries({queryKey: ['notes']});
  }
})

    return(
    <ul className={css.list}>
	   {notes.map(item =>(  
       <li key={item.id} className={css.listItem}>
       <h2 className={css.title}>{item.title}</h2>
       <p className={css.content}>{item.content}</p>
       <div className={css.footer}>
         <span className={css.tag}>{item.tag}</span>
        {/* <Link className={css.link} href={`/notes/${item.id}`}>View details</Link> */}
        { <Link className={css.detailsButton} href={`/notes/${item.id}`}>View details</Link> }
      <button className={css.deleteButton} onClick={() => mutation.mutate(item.id)}>Delete</button>
    </div>
  </li>))}

</ul>
)
}