'use client'

type NoteErrorProps = {
  error: Error;
};
export default function NoteError({error}: NoteErrorProps){
    return <p>Could not fetch note details. {error.message}</p>
}