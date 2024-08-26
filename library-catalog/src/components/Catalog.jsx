import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Catalog.css';

const Catalog = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [newCatalog, setNewCatalog] = useState({ title: '', items: [] });
  const [newItem, setNewItem] = useState({
    type: 'book',
    ISBN: '',
    category: '',
    title: '',
    author: '',
    yearPublished: '2024'
  });
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/catalogs');
        setCatalogs(response.data);
      } catch (error) {
        console.error('Error fetching catalogs', error);
      }
    };
    fetchCatalogs();
  }, []);

  const addCatalog = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/catalogs', newCatalog);
      setCatalogs([...catalogs, response.data]);
      setNewCatalog({ title: '', items: [] });
    } catch (error) {
      console.error('Error adding catalog', error);
    }
  };

  const addItemToCatalog = async (index) => {
    const updatedCatalog = { ...catalogs[index] };
    updatedCatalog.items.push({ ...newItem });

    try {
      const response = await axios.put(`http://localhost:8080/api/catalogs/${index}`, updatedCatalog);
      setCatalogs(catalogs.map((catalog, i) => (i === index ? response.data : catalog)));
      setNewItem({
        type: 'book',
        ISBN: '',
        category: '',
        title: '',
        author: '',
        yearPublished: '2024'
      });
    } catch (error) {
      console.error('Error updating catalog', error);
    }
  };

  const deleteCatalog = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/api/catalogs/${index}`);
      setCatalogs(catalogs.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting catalog', error);
    }
  };

  const deleteItem = async (catalogIndex, itemIndex) => {
    const updatedCatalog = { ...catalogs[catalogIndex] };
    updatedCatalog.items.splice(itemIndex, 1);

    try {
      const response = await axios.put(`http://localhost:8080/api/catalogs/${catalogIndex}`, updatedCatalog);
      setCatalogs(catalogs.map((catalog, i) => (i === catalogIndex ? response.data : catalog)));
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const handleCatalogClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const startEditing = (catalogIndex, itemIndex) => {
    setEditIndex({ catalogIndex, itemIndex });
    setEditItem({ ...catalogs[catalogIndex].items[itemIndex] });
  };

  const saveEdit = async () => {
    const updatedCatalogs = [...catalogs];
    updatedCatalogs[editIndex.catalogIndex].items[editIndex.itemIndex] = editItem;

    try {
      const response = await axios.put(`http://localhost:8080/api/catalogs/${editIndex.catalogIndex}`, updatedCatalogs[editIndex.catalogIndex]);
      setCatalogs(updatedCatalogs.map((catalog, i) => (i === editIndex.catalogIndex ? response.data : catalog)));
      setEditIndex(null);
      setEditItem(null);
    } catch (error) {
      console.error('Error updating item', error);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditItem(null);
  };

  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="catalog-container">
      <input
        type="text"
        value={newCatalog.title}
        onChange={(e) => setNewCatalog({ ...newCatalog, title: e.target.value })}
        placeholder="New Catalog Title"
      />
      <button onClick={addCatalog}>Add Catalog</button>
      <table className="catalog-table">
        <thead>
          <tr>
            <th>Catalog Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.map((catalog, index) => (
            <React.Fragment key={index}>
              <tr
                className="catalog-row"
                onClick={() => handleCatalogClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <td>{catalog.title}</td>
                <td>
                  <button onClick={() => deleteCatalog(index)}>Delete</button>
                  {expandedIndex === index ? '▲' : '▼'}
                </td>
              </tr>
              {expandedIndex === index && (
                <tr>
                  <td colSpan="2">
                    <table className="catalog-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>ISBN</th>
                          <th>Category</th>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Year Published</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalog.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.type}</td>
                            <td>{item.ISBN}</td>
                            <td>{item.category}</td>
                            <td>{item.title}</td>
                            <td>{item.author}</td>
                            <td>{item.yearPublished}</td>
                            <td>
                              <button onClick={() => startEditing(index, idx)}>Edit</button>
                              <button onClick={() => deleteItem(index, idx)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {editIndex && editIndex.catalogIndex === index && (
                      <div className="new-item-form">
                        <select
                          value={editItem.type}
                          onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                        >
                          <option value="book">Book</option>
                          <option value="article">Article</option>
                          <option value="paper">Paper</option>
                        </select>
                        <input
                          type="text"
                          value={editItem.ISBN}
                          onChange={(e) => setEditItem({ ...editItem, ISBN: e.target.value })}
                          placeholder="ISBN"
                        />
                        <input
                          type="text"
                          value={editItem.category}
                          onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                          placeholder="Category"
                        />
                        <input
                          type="text"
                          value={editItem.title}
                          onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={editItem.author}
                          onChange={(e) => setEditItem({ ...editItem, author: e.target.value })}
                          placeholder="Author"
                        />
                        <select
                          value={editItem.yearPublished}
                          onChange={(e) => setEditItem({ ...editItem, yearPublished: e.target.value })}
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <button onClick={saveEdit}>Done</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    )}
                    <div className="new-item-form">
                      <select
                        value={newItem.type}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                      >
                        <option value="book">Book</option>
                        <option value="article">Article</option>
                        <option value="paper">Paper</option>
                      </select>
                      <input
                        type="text"
                        value={newItem.ISBN}
                        onChange={(e) => setNewItem({ ...newItem, ISBN: e.target.value })}
                        placeholder="ISBN"
                      />
                      <input
                        type="text"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="Category"
                      />
                      <input
                        type="text"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={newItem.author}
                        onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
                        placeholder="Author"
                      />
                      <select
                        value={newItem.yearPublished}
                        onChange={(e) => setNewItem({ ...newItem, yearPublished: e.target.value })}
                      >
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <button onClick={() => addItemToCatalog(index)}>Add Item</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Catalog;
