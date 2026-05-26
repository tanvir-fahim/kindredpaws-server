const express = require('express');
const cors = require('cors'); // Fixed the typo here!
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('KindredPaws Server is running smoothly with CommonJS!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});