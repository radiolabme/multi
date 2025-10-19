import React from 'react';
import './App.css';
import SimpleEditor from './components/SimpleEditor';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>TipTap v3.x Editor - Testing</h1>
        <p>Simple test to isolate issues</p>
      </header>
      <main className="app-main">
        <SimpleEditor />
      </main>
    </div>
  );
};

export default App;
