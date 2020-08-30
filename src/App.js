import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import layout_header from './components/layout/layout_header/layout_header/layout_header';
import create_board from './components/manage_board/create_board/create_board'


function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={layout_header}/>
        <Route path="/manageboard/createboard" component={create_board}/>
      </Router>
    </div>
  );
}

export default App;
