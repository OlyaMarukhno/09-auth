import css from './Pagination.module.css';
import ReactPaginate from 'react-paginate';


interface PaginationProps {
  currentPage: number;
  changePage: (currentPage: number) => void;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  changePage,
  totalPages,
}: PaginationProps) {


  return (
      <ReactPaginate
        className={css.pagination}
        pageCount={totalPages}
        pageRangeDisplayed={4}
        marginPagesDisplayed={0}
        previousLabel={'←'}
        nextLabel={'→'}
        onPageChange={({ selected }) => changePage(selected + 1)}
        forcePage={currentPage - 1}
      />
  );
}