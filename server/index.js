const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server:\nRunning on port ${port}`);
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is connected!' });
  });
  
const users = [
    { username: 'owner', password: 'password', role: 'owner' },
    { username: 'employee', password: 'password', role: 'employee' },
  ];
  
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

  const catalogs = {
    books: [],
    articles: [],
    papers: []
  };
  
  app.get('/api/:type', (req, res) => {
    const { type } = req.params;
    res.json(catalogs[type]);
  });
  
  app.post('/api/:type', (req, res) => {
    const { type } = req.params;
    catalogs[type].push(req.body);
    res.status(201).json(req.body);
  });
  
  app.delete('/api/:type/:id', (req, res) => {
    const { type, id } = req.params;
    catalogs[type] = catalogs[type].filter((_, index) => index !== parseInt(id));
    res.status(204).end();
  });
  
  app.put('/api/:type/:id', (req, res) => {
    const { type, id } = req.params;
    catalogs[type][id] = req.body;
    res.json(req.body);
  });  
  