import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Catalog.css";
import { useNavigate } from "react-router-dom";

const Catalog = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [newCatalog, setNewCatalog] = useState({ title: "", items: [] });
  const [newItem, setNewItem] = useState({
    type: "book",
    ISBN: "",
    category: "",
    title: "",
    author: "",
    yearPublished: "2024",
  });
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editCatalogIndex, setEditCatalogIndex] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/catalogs");
        setCatalogs(response.data);
      } catch (error) {
        console.error("Error fetching catalogs", error);
      }
    };
    fetchCatalogs();
  }, []);

  const filterCatalogs = () => {
    if (!searchQuery) return catalogs;

    return catalogs
      .map((catalog) => {
        const filteredItems = catalog.items.filter((item) => {
          return (
            item.ISBN.includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.yearPublished.toString().includes(searchQuery)
          );
        });

        return {
          ...catalog,
          items: filteredItems,
        };
      })
      .filter((catalog) => catalog.items.length > 0);
  };

  const addCatalog = async () => {
    if (editCatalogIndex !== null) {
      await saveCatalogEdit();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/catalogs",
        newCatalog
      );
      setCatalogs([...catalogs, response.data]);
      setNewCatalog({ title: "", items: [] });
    } catch (error) {
      console.error("Error adding catalog", error);
    }
  };

  const saveCatalogEdit = async () => {
    if (editCatalogIndex !== null) {
      const updatedCatalog = {
        ...catalogs[editCatalogIndex],
        title: newCatalog.title,
      };

      try {
        const response = await axios.put(
          `http://localhost:8080/api/catalogs/${editCatalogIndex}`,
          updatedCatalog
        );
        setCatalogs(
          catalogs.map((catalog, i) =>
            i === editCatalogIndex ? response.data : catalog
          )
        );
        setEditCatalogIndex(null);
        setNewCatalog({ title: "", items: [] });
      } catch (error) {
        console.error("Error updating catalog", error);
      }
    }
  };

  const editCatalog = (index) => {
    setEditCatalogIndex(index);
    setNewCatalog({ title: catalogs[index].title, items: [] });
  };

  const cancelCatalogEdit = () => {
    setEditCatalogIndex(null);
    setNewCatalog({ title: "", items: [] });
  };

  const addItemToCatalog = async (index) => {
    const updatedCatalog = { ...catalogs[index] };
    updatedCatalog.items.push({ ...newItem });

    try {
      const response = await axios.put(
        `http://localhost:8080/api/catalogs/${index}`,
        updatedCatalog
      );
      setCatalogs(
        catalogs.map((catalog, i) => (i === index ? response.data : catalog))
      );
      setNewItem({
        type: "book",
        ISBN: "",
        category: "",
        title: "",
        author: "",
        yearPublished: "2024",
      });
    } catch (error) {
      console.error("Error updating catalog", error);
    }
  };

  const deleteCatalog = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/api/catalogs/${index}`);
      setCatalogs(catalogs.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting catalog", error);
    }
  };

  const deleteItem = async (catalogIndex, itemIndex) => {
    const updatedCatalog = { ...catalogs[catalogIndex] };
    updatedCatalog.items.splice(itemIndex, 1);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/catalogs/${catalogIndex}`,
        updatedCatalog
      );
      setCatalogs(
        catalogs.map((catalog, i) =>
          i === catalogIndex ? response.data : catalog
        )
      );
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const startEditingItem = (catalogIndex, itemIndex) => {
    setEditItemIndex({ catalogIndex, itemIndex });
    setEditItem({ ...catalogs[catalogIndex].items[itemIndex] });
  };

  const saveEditItem = async () => {
    const { catalogIndex, itemIndex } = editItemIndex;
    const updatedCatalog = { ...catalogs[catalogIndex] };
    updatedCatalog.items[itemIndex] = editItem;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/catalogs/${catalogIndex}`,
        updatedCatalog
      );
      setCatalogs(
        catalogs.map((catalog, i) =>
          i === catalogIndex ? response.data : catalog
        )
      );
      setEditItem(null);
      setEditItemIndex(null);
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  const cancelEditItem = () => {
    setEditItem(null);
    setEditItemIndex(null);
  };

  const handleCatalogClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const navigate = useNavigate();

  const handleCheckout = (item) => {
    navigate("/checkout", { state: { item } });
  };

  const years = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const types = ["book", "article", "paper"];

  const filteredCatalogs = filterCatalogs();

  return (
    <div className="catalog">
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
      <input
        type="text"
        className="search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by ISBN, category, type, title, author, or year published"
      />
      <table className="catalog-table">
        <thead>
          <tr>
            <th>Catalog Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCatalogs.map((catalog, index) => (
            <React.Fragment key={index}>
              <tr
                className="catalog-row"
                onClick={() => handleCatalogClick(index)}
                style={{ cursor: "pointer" }}
              >
                <td>{catalog.title}</td>
                <td>
                  <button
                    onClick={() => editCatalog(index)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCatalog(index)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  {expandedIndex === index ? "▲" : "▼"}
                </td>
              </tr>
              {expandedIndex === index && (
                <tr>
                  <td colSpan="2">
                    <table className="catalog-items-table">
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
                          <tr
                            key={idx}
                            style={{
                              backgroundColor: item.highlighted
                                ? "yellow"
                                : "transparent",
                            }}
                          >
                            <td>{item.type}</td>
                            <td>{item.ISBN}</td>
                            <td>{item.category}</td>
                            <td>{item.title}</td>
                            <td>{item.author}</td>
                            <td>{item.yearPublished}</td>
                            <td>
                              <button
                                onClick={() => startEditingItem(index, idx)}
                                className="edit-item-button"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteItem(index, idx)}
                                className="delete-item-button"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleCheckout(item)}
                                className="checkout-button"
                              >
                                Checkout
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="add-item-section">
                      <select
                        value={newItem.type}
                        onChange={(e) =>
                          setNewItem({ ...newItem, type: e.target.value })
                        }
                        className="item-type-dropdown"
                      >
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newItem.ISBN}
                        onChange={(e) =>
                          setNewItem({ ...newItem, ISBN: e.target.value })
                        }
                        placeholder="ISBN"
                        className="item-input"
                      />
                      <input
                        type="text"
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                        placeholder="Category"
                        className="item-input"
                      />
                      <input
                        type="text"
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                        placeholder="Title"
                        className="item-input"
                      />
                      <input
                        type="text"
                        value={newItem.author}
                        onChange={(e) =>
                          setNewItem({ ...newItem, author: e.target.value })
                        }
                        placeholder="Author"
                        className="item-input"
                      />
                      <select
                        value={newItem.yearPublished}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            yearPublished: e.target.value,
                          })
                        }
                        className="item-year-dropdown"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => addItemToCatalog(index)}
                        className="add-item-button"
                      >
                        Add Item
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {editItemIndex && (
        <div className="edit-item-popup">
          <h3>Edit Item</h3>
          <select
            value={editItem.type}
            onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
            className="item-type-dropdown"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={editItem.ISBN}
            onChange={(e) => setEditItem({ ...editItem, ISBN: e.target.value })}
            placeholder="ISBN"
            className="item-input"
          />
          <input
            type="text"
            value={editItem.category}
            onChange={(e) =>
              setEditItem({ ...editItem, category: e.target.value })
            }
            placeholder="Category"
            className="item-input"
          />
          <input
            type="text"
            value={editItem.title}
            onChange={(e) =>
              setEditItem({ ...editItem, title: e.target.value })
            }
            placeholder="Title"
            className="item-input"
          />
          <input
            type="text"
            value={editItem.author}
            onChange={(e) =>
              setEditItem({ ...editItem, author: e.target.value })
            }
            placeholder="Author"
            className="item-input"
          />
          <select
            value={editItem.yearPublished}
            onChange={(e) =>
              setEditItem({ ...editItem, yearPublished: e.target.value })
            }
            className="item-year-dropdown"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button onClick={saveEditItem} className="save-edit-button">
            Save
          </button>
          <button onClick={cancelEditItem} className="cancel-edit-button">
            Cancel
          </button>
        </div>
      )}
      <div className="add-catalog-section">
        <h3>Add New Catalog</h3>
        <input
          type="text"
          value={newCatalog.title}
          onChange={(e) =>
            setNewCatalog({ ...newCatalog, title: e.target.value })
          }
          placeholder="Catalog Title"
          className="catalog-title-input"
        />
        <button onClick={addCatalog} className="add-catalog-button">
          {editCatalogIndex !== null ? "Save Edit" : "Add Catalog"}
        </button>
        {editCatalogIndex !== null && (
          <button onClick={cancelCatalogEdit} className="cancel-edit-button">
            Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Catalog;
