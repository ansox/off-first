import React from 'react';
import logo from './logo.svg';
import './App.css';
import initDB from './db/db';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="App">
        <Outlet></Outlet>
        {/* <button onClick={insert}>Insert</button> */}
    </div>
  );
}

export default App;
