import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { Pagination } from "./../utils/Pagination";
import { SearchBook } from "./components/SearchBook";

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books`;

            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                let searchWithPage= searchUrl.replace('<pageNumber>',`${currentPage-1}`);
                url = baseUrl + searchWithPage ;
            }
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel[] = [];

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);


            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHadleChange = () => {
        setCurrentPage(1);
        if (search === "") {
            setSearchUrl("");
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        setCategorySelection('Book category');
    }

    const categoryField = (value:string) => {
        setCurrentPage(1);
        if(value.toLowerCase()==='fe' ||
           value.toLowerCase()==='be' ||  
           value.toLowerCase()==='data' ||
           value.toLowerCase()==='devops'){

            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        }else{
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmmountOfBooks ?
        booksPerPage * currentPage : totalAmmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control me-2" type='search'
                                    placeholder="Search" aria-label="Search"
                                    onChange={e => setSearch(e.target.value)} />
                                <button className="btn btn-outline-success"
                                    onClick={() => searchHadleChange()}>Search</button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button id='dropdownMenuButton1' className="btn btn-secondary drop-down-toggle"
                                    type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                                    Select Category
                                </button>
                                <ul className="dropdown-menu" aria-label="dropdownMenuButton1">
                                    <li onClick = {() => categoryField('All')} >
                                        <a className="drop-down-item" href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li onClick = {() => categoryField('FE')}  >
                                        <a className="drop-down-item" href='#'>
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick = {() => categoryField('BE')} >
                                        <a className="drop-down-item" href='#'>
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick = {() => categoryField('DATA')} >
                                        <a className="drop-down-item" href='#'>
                                            Data
                                        </a>
                                    </li>
                                    <li onClick = {() => categoryField('DEVOPS')} >
                                        <a className="drop-down-item" href='#'>
                                            Dev Ops
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmmountOfBooks > 0 ?
                        <>
                            <div className="mt-3">
                                <h5> Number of Result: ({totalAmmountOfBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmmountOfBooks} items:
                            </p>
                            {books.map(book =>
                                <SearchBook book={book} key={book.id} />
                            )}
                        </>
                        :
                        <div className="m-5">
                            <h5>
                                Can't find what you are looking for?
                            </h5>
                            <a type='button'
                                className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                                href="#">
                                Library Services
                            </a>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}