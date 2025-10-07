import React from 'react';
import Signup from './forms/signup';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './forms/Home';
import Login from './forms/Login';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
    </Routes>
    <ToastContainer/>
    </BrowserRouter>
  )
}

export default App;
