import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Home from './components/HomeComp'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Home/>
      </div>
    </BrowserRouter>
  );
}

export default App;
