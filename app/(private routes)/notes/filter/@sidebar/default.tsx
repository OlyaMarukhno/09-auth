import css from './sidebar.module.css';
import Link from 'next/link';

export default function Sidebar() {
  const tags = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

  return (
    <ul className={css.menuList}>
      {tags.map(tag => {
        const hrefTag = tag === "All" ? "all" : tag;
        return (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${hrefTag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}