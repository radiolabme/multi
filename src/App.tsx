import React from 'react';
import SimpleEditor from './components/SimpleEditor';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <main className="app-main">
        <SimpleEditor />
      </main>
    </div>
  );
};

export default App;
