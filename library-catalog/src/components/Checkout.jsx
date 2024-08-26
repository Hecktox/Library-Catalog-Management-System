import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    borrowed: [],
  });
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/catalogs");
        const allItems = response.data.flatMap((catalog) => catalog.items);
        setItems(allItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchItems();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (location.state?.item) {
      setSelectedItem(location.state.item.ISBN);
    }
  }, [location.state]);

  const handleAddCustomer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/customers",
        newCustomer
      );
      setCustomers([...customers, response.data]);
      setNewCustomer({ name: "", email: "", borrowed: [] });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleCheckout = async (customer, item) => {
    if (customer.borrowed.includes(item.ISBN)) {
      setCheckoutMessage(
        `Error: ${customer.name} has already borrowed ${item.title}.`
      );
      return;
    }

    const updatedCustomer = {
      ...customer,
      borrowed: [...customer.borrowed, item.ISBN],
    };

    try {
      await axios.put(
        `http://localhost:8080/api/customers/${encodeURIComponent(
          customer.email
        )}`,
        updatedCustomer
      );
      setCheckoutMessage(
        `Congratulations, ${customer.name} has checked out ${item.title}.`
      );
      setCustomers(
        customers.map((c) => (c.email === customer.email ? updatedCustomer : c))
      );
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleEditCustomer = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/customers/${encodeURIComponent(
          editingCustomer.email
        )}`,
        editingCustomer
      );
      setCustomers(
        customers.map((c) =>
          c.email === editingCustomer.email ? response.data : c
        )
      );
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDeleteCustomer = async (email) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/customers/${encodeURIComponent(email)}`
      );
      setCustomers(customers.filter((customer) => customer.email !== email));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const filterCustomers = () => {
    if (!searchQuery) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredCustomers = filterCustomers();
  const navigate = useNavigate();

  return (
    <div className="checkout">
      <button className="back-button" onClick={() => navigate("/Catalog")}>
        Back to Catalog
      </button>
      <h1>Checkout Customer</h1>

      {checkoutMessage && (
        <div className="checkout-message">{checkoutMessage}</div>
      )}

      <div>
        <label htmlFor="item">Select Item:</label>
        <select
          id="item"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="" disabled>
            Select an item
          </option>
          {items.map((item) => (
            <option key={item.ISBN} value={item.ISBN}>
              {item.title} - {item.author}
            </option>
          ))}
        </select>
      </div>

      <div className="customer-section">
        <input
          type="text"
          className="search-box"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email"
        />

        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Borrowed Books</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={index}>
                <td>
                  {editingCustomer &&
                  editingCustomer.email === customer.email ? (
                    <input
                      type="text"
                      value={editingCustomer.name}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    customer.name
                  )}
                </td>
                <td>
                  {editingCustomer &&
                  editingCustomer.email === customer.email ? (
                    <input
                      type="email"
                      value={editingCustomer.email}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    customer.email
                  )}
                </td>
                <td>
                  {customer.borrowed.length > 0
                    ? customer.borrowed.map((isbn) => (
                        <div key={isbn}>
                          {items.find((item) => item.ISBN === isbn)?.title ||
                            "Unknown"}
                        </div>
                      ))
                    : "None"}
                </td>
                <td>
                  {editingCustomer &&
                  editingCustomer.email === customer.email ? (
                    <>
                      <button
                        onClick={handleEditCustomer}
                        className="save-edit-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCustomer(null)}
                        className="cancel-edit-button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const selectedItemObj = items.find(
                            (item) => item.ISBN === selectedItem
                          );
                          if (selectedItemObj) {
                            handleCheckout(customer, selectedItemObj);
                          }
                        }}
                        className="checkout-button"
                        disabled={!selectedItem}
                      >
                        Checkout
                      </button>
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.email)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="add-customer-section">
          <h3>Add New Customer</h3>
          <input
            type="text"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            placeholder="Name"
            className="customer-input"
          />
          <input
            type="email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            placeholder="Email"
            className="customer-input"
          />
          <input
            type="text"
            value={newCustomer.borrowed}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                borrowed: e.target.value.split(","),
              })
            }
            placeholder="Borrowed Books (comma-separated ISBNs)"
            className="customer-input"
          />
          <button onClick={handleAddCustomer} className="add-customer-button">
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
