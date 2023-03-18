import { useOktaAuth } from "@okta/okta-react";
import { setMaxIdleHTTPParsers } from "http";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";


export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //review state
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadindReview, setIsLoadingReview] = useState(true);
    const [isReviewLeft,setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    //loan count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    //is Book checkout
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    //Payment
    const [displayError, setDisplayError] = useState(false);

    const bookId = (window.location.pathname).split('/')[2];

    //use effect for book with bookId
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {

                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    //use effect for BookRevews
    useEffect( () => {

        const fetchBookReviews = async () => {
            const reviewUrl:string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok){
                throw new Error('Something went wrong');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews:ReviewModel[]=[];

            let weightedStarReviews: number =0;

            for(const key in responseData){
               loadedReviews.push({
                id:responseData[key].id,
                userEmail:responseData[key].userEmail,
                date:responseData[key].date,
                rating:responseData[key].rating,
                book_id:responseData[key].bookId,
                reviewDescription:responseData[key].reviewDescription,
               });
               weightedStarReviews = weightedStarReviews+responseData[key].rating;
            }

            if(loadedReviews){
                const round = (Math.round( (weightedStarReviews/loadedReviews.length)*2 )/2 ).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

        }

        fetchBookReviews().catch( (error:any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })

    }, [isReviewLeft]);

    //use effect for review by the current user for current book
    useEffect(()=>{
        const fetchUserReviewBook = async() =>{
            if(authState && authState.isAuthenticated){
                const url =  `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
                const requestOption = {
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };

                const userReview = await fetch(url,requestOption);
                if(!userReview.ok){
                    throw new Error("Something went wrong");
                }

                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }

            setIsLoadingUserReview(false);
        }

        fetchUserReviewBook().catch((error:any)=>{
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        });

    },[authState]);

    //use effect for current loans count
    useEffect( () => {

        const fetchUserCurrentLoansCount = async () => {

            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                const requestOptions = {
                   method: 'GET' ,
                   headers:{
                    Authorization : `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type':'application/json',
                   }
                };
                const currentLoansCountResponse = await fetch(url,requestOptions);

                if(!currentLoansCountResponse.ok){
                   throw new Error('Something went wrong.');
                }

                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson)
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error:any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    //use effect for if current book checked out by given user or not
    useEffect(()=>{
        const fetchUserCheckedOutBooks = async() => {
            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
                const requestOptions = {
                    method : 'GET',
                    headers : {
                        Authorization : `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url,requestOptions);
                if(!bookCheckedOut.ok){
                    throw new Error('Something went wrong');
                }
                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBooks().catch((error:any) =>{
          setIsLoadingBookCheckedOut (false);
          setHttpError(error.message); 
        })

    },[authState]);

    if (isLoading || isLoadindReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
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

    async function checoutBook(){
        const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
        const requestOptions = {
            method:'PUT',
            headers: {
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }
        };
        const checkoutResponse = await fetch(url,requestOptions);
        if(!checkoutResponse.ok){
            setDisplayError(true);
            throw new Error('Something went wrong');
        }
        setDisplayError(false);
        setIsCheckedOut(true);
    }

    async function submitReview(StarInput:number, reviewDescription:string){
        let bookId:number=0;
        if(book?.id){
            bookId=book.id;
        }
        const reviewRequestModel = new ReviewRequestModel(StarInput,bookId,reviewDescription);
        const url=`${process.env.REACT_APP_API}/reviews/secure`;
        const requestOption = {
            method:'POST',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(reviewRequestModel)
        }

        const returnResponse = await fetch(url,requestOption);
        if(!returnResponse.ok){
            throw new Error("Something went wrong");
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                {displayError && 
                <div className='alert alert-danger mt-3' role='alert'>
                    Please pay outstanding fees and/or return late book(s).
                </div>
                }
                <div className='row mt-5'>
                    <div className='col-sm-2 cl-md-2'>
                        {book?.img ?
                            <img src={book?.img}
                                width='226'
                                height='349'
                                alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                width='226'
                                height='349'
                                alt='Book'
                            />}
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div> 
                    <CheckoutAndReviewBox book={book} 
                                          mobile={false} 
                                          currentLoansCount={currentLoansCount}
                                          isAuthenticated={authState?.isAuthenticated}
                                          isCheckedOut={isCheckedOut}
                                          cheoutBook={checoutBook}
                                          isReviewLeft={isReviewLeft}
                                          submitReview={submitReview}/>
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>

            </div>

            {/* Mobile*/}
            <div className='container d-lg-none mt-5'>
            {displayError && 
                <div className='alert alert-danger mt-3' role='alert'>
                    Please pay outstanding fees and/or return late book(s).
                </div>
                }
                <div className='d-flex justify-content-center align-content-center'>
                    {book?.img ?
                        <img src={book?.img}
                            width='226'
                            height='349'
                            alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                            width='226'
                            height='349'
                            alt='Book'
                    />}
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} 
                                      mobile={true} 
                                      currentLoansCount={currentLoansCount}
                                      isAuthenticated={authState?.isAuthenticated}
                                      isCheckedOut={isCheckedOut}
                                      cheoutBook={checoutBook}
                                      isReviewLeft={isReviewLeft}
                                      submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}

