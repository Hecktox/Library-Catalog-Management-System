import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Catalog = ({ type }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Fetch items based on type
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/${type}`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items', error);
      }
    };
    fetchItems();
  }, [type]);

  const addItem = async () => {
    try {
      await axios.post(`http://localhost:8080/api/${type}`, { name: newItem });
      setItems([...items, { name: newItem }]);
      setNewItem('');
    } catch (error) {
      console.error('Error adding item', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder={`New ${type}`}
      />
      <button onClick={addItem}>Add {type}</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

Catalog.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Catalog;
