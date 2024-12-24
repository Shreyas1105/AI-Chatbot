import React, { useState } from 'react';
import CampusChatbot from './components/CampusChatbot';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setIsAdmin(!isAdmin)}>
        {isAdmin ? 'Switch to Chatbot' : 'Switch to Admin Panel'}
      </button>
      {isAdmin ? <AdminPanel /> : <CampusChatbot />}
    </div>
  );
}

export default App;

