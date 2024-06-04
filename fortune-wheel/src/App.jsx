

import React, { useState, useEffect } from 'react';
import './App.css';
import FacebookLogin from 'react-facebook-login';
import FortuneWheel from './FortuneWheel';
import gift from './gift.png';
import Form from './Form';
import UsersList from './UsersList';
import { Route, Routes } from 'react-router-dom';
import KeywordsManager from './KeywordsManager';

const instagramClientId = '1467940277144991';
const redirectUri = 'https://localhost:5173';

function App() {
  

  return (
    <div>
    <Routes>  
       <Route path='/' element={ <Form/>} />
      <Route path='/userlist' element={<UsersList/>} />
      <Route path='/keyword' element={<KeywordsManager />} />
      </Routes>

    </div>
     );
}

export default App;
