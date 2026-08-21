"use client"
import css from "./SearchBox.module.css";

interface SearchBoxProps{
  onSearch: (nextSearchQuery : string) => void;
}

export default function SearchBox({ onSearch}: SearchBoxProps){

function handleChange(event : React.ChangeEvent<HTMLInputElement>){
onSearch(event.target.value);
};
    return(
        <div className={css.container}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search notes"
            autoFocus
            onChange={handleChange}
          />
      </div>
    )
}