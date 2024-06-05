

import React, { useState, useEffect } from 'react';
import './App.css';
import FacebookLogin from 'react-facebook-login';
import FortuneWheel from './FortuneWheel';
import gift from './gift.png';
import Form from './Form';
import UsersList from './UsersList';
import { Route, Routes } from 'react-router-dom';
import KeywordsManager from './KeywordsManager';
import { environment } from './environment';

const instagramClientId = '1467940277144991';
const redirectUri = environment.frontURL;

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
