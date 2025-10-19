import React from 'react';
import './App.css';
import TipTapEditor from './components/TipTapEditor';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>TipTap v3.x Editor</h1>
        <p>A modern rich-text editor built with TipTap</p>
      </header>
      <main className="app-main">
        <TipTapEditor />
      </main>
    </div>
  );
};

export default App;
