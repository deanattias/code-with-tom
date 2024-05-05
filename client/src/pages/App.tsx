import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Lobby';
import CodeBlock from './CodeBlock';
import '../App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/code-block/:id" element={<CodeBlock />} />
      </Routes>
    </Router>
  );
};

export default App;
