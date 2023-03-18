import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';

import {BrowserRouter} from 'react-router-dom';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Mhs0USHOoTUtfm49gbSwkn6KTjpeJrdkBzuINY07n0VKcmCp3Z7K4hdZR4fEEoi5RR45foLAvH1gXv9Pw5dWG4w00l64fc966');


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
  <Elements stripe={stripePromise}>
  <App/>
  </Elements>
  </BrowserRouter>
);

