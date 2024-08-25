const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server:\nRunning on port ${port}`);
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
  