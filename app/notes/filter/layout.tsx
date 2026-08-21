import css from "@/app/notes/filter/SidebarNotes.module.css";

export default function SidebarLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <section className={css.container}>
  <aside className={css.sidebar}>{sidebar}</aside>
  <div className={css.notesWrapper}>{children}</div>
</section>

  );
}