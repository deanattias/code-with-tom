import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './pages/Lobby.tsx';
import CodeBlock from './pages/CodeBlock.tsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/code-block/:id" element={<CodeBlock />} />
        <Route path="*" element={<Lobby />} />
      </Routes>
    </Router>
  );
}