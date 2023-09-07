import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from './components/HomePage';
// import CfopTheory from './components/CfopTheory';
import Stopwatch from './components/stopwatch';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element = {< Stopwatch />}/>     
      </Routes>
    </Router>
  );
};

export default App;
