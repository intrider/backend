const express = require('express');
const cors = require('cors');
const { connect } = require('./Model/db');
const userRoutes = require('./Routes/User');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

connect();

app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const app = express();
// const port = 3008;

// app.use(express.json());

// const users = [
//   { id: 1, username: 'john', password: 'password123' },
//   { id: 2, username: 'jane', password: 'password456' },
// ];

// app.post('/user/login', (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((user) => user.username === username && user.password === password);

//   if (!user) {
//     return res.status(400).json({ error: 'Invalid username or password' });
//   }

//   const token = 'your_token_here';
//   res.json({ token });
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
