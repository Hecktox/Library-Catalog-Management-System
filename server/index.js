const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

function initializeDatabase() {
  const dbPath = path.join(__dirname, 'database');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  const files = ['users.json', 'catalogs.json', 'customers.json'];

  files.forEach(file => {
    const filePath = path.join(dbPath, file);
    if (!fs.existsSync(filePath)) {
      let initialData;

      if (file === 'users.json') {
        initialData = JSON.stringify([
          { name: 'Maximus Taube', username: 'max', password: 'password', role: 'owner' },
          { name: 'MoznaPOS', username: 'MoznaPOS', password: 'password', role: 'employee' },
        ], null, 2);
      } 
      else if (file === 'catalogs.json') {
        initialData = JSON.stringify([
          {
            title: 'Best Sellers',
            items: [
              { type: 'article', ISBN: '978-1-23-456789-7', category: 'Science', title: 'Physics Advances', author: 'Albert Einstein', yearPublished: 1940 },
              { type: 'book', ISBN: '978-0-9876543-21', category: 'Mystery', title: 'The Silent Witness', author: 'Agatha Christie', yearPublished: 1930 }
            ]
          },
          {
            title: 'New',
            items: [
              { type: 'book', ISBN: '978-3-16-148410-0', category: 'Sports', title: 'Basketball Adventure', author: 'Micheal Jordan', yearPublished: 2021 }
            ]
          },
          {
            title: 'Classics',
            items: [
              { type: 'book', ISBN: '978-0-321-45678-9', category: 'Classic', title: 'Pride and Prejudice', author: 'Jane Austen', yearPublished: 1813 }
            ]
          },
          {
            title: 'Research Papers',
            items: [
              { type: 'paper', ISBN: '978-0-12-345678-9', category: 'Mathematics', title: 'Advanced Calculus Techniques', author: 'Alan Turing', yearPublished: 1952 }
            ]
          }
        ], null, 2);
      } 
      else if (file === 'customers.json') {
        initialData = JSON.stringify([
          {
            name: 'Robert Brown',
            email: 'robert.brown@example.com',
            borrowed: ['978-3-16-148410-0', '978-0-321-45678-9']
          },
          {
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            borrowed: ['978-1-23-456789-7']
          },
          {
            name: 'Michael Wilson',
            email: 'michael.wilson@example.com',
            borrowed: ['978-0-12-345678-9']
          }
        ], null, 2);
      } 
      else {
        initialData = JSON.stringify([], null, 2);
      }

      fs.writeFileSync(filePath, initialData);
    }
  });
}

initializeDatabase();

function loadJson(file) {
  const filePath = path.join(__dirname, 'database', file);
  const fileData = fs.readFileSync(filePath);
  return JSON.parse(fileData);
}

function saveJson(file, data) {
  const filePath = path.join(__dirname, 'database', file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadCatalogs() {
  return loadJson('catalogs.json');
}

app.get('/api/test', (req, res) => {
  res.json({ message: '' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadJson('users.json');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json(user);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/api/customers', (req, res) => {
  const customers = loadJson('customers.json');
  res.json(customers);
});

app.post('/api/customers', (req, res) => {
  const customers = loadJson('customers.json');
  const newCustomer = req.body;
  customers.push(newCustomer);
  saveJson('customers.json', customers);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const customers = loadJson('customers.json');
  const { id } = req.params;
  const updatedCustomer = req.body;
  customers[id] = updatedCustomer;
  saveJson('customers.json', customers);
  res.json(updatedCustomer);
});

app.delete('/api/customers/:id', (req, res) => {
  let customers = loadJson('customers.json');
  const { id } = req.params;
  customers = customers.filter((_, index) => index !== parseInt(id));
  saveJson('customers.json', customers);
  res.status(204).end();
});

app.get('/api/catalogs', (req, res) => {
  const catalogs = loadCatalogs();
  res.json(catalogs);
});

app.post('/api/catalogs', (req, res) => {
  const catalogs = loadCatalogs();
  const newCatalog = req.body;
  catalogs.push(newCatalog);
  saveJson('catalogs.json', catalogs);
  res.status(201).json(newCatalog);
});

app.put('/api/catalogs/:id', (req, res) => {
  const catalogs = loadCatalogs();
  const { id } = req.params;
  const updatedCatalog = req.body;
  catalogs[id] = updatedCatalog;
  saveJson('catalogs.json', catalogs);
  res.json(updatedCatalog);
});

app.delete('/api/catalogs/:id', (req, res) => {
  let catalogs = loadCatalogs();
  const { id } = req.params;
  catalogs = catalogs.filter((_, index) => index !== parseInt(id));
  saveJson('catalogs.json', catalogs);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server:\nRunning on port ${port}`);
});
