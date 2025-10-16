import React from 'react';
import Signup from './forms/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './forms/Home';
import Login from './forms/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContextProvider from './context/ContextProvider';

function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;