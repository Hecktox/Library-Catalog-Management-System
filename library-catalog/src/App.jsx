import { useState, useEffect } from 'react';
import Login from './components/Login';
import Catalog from './components/Catalog';
import './App.css';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/test');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Connection test failed:', error);
      setMessage('Error connecting to backend');
    }
  };  

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="App">
      <h1>Library Catalog Management System</h1>
      {message && <p>{message}</p>} {/* Display the message */}
      {user ? (
        <Catalog type="books" />
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  );
}

export default App;
