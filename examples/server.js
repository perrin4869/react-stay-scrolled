/* eslint-disable no-console */
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('views', __dirname); // view engine setup
app.set('view engine', 'jade'); // view engine setup
app.set('port', PORT);

app.use(express.static(__dirname));
app.use('/', (req, res) => {
  // gulp live server sets NODE_ENV to development by default
  res.render('index', { env: process.env.NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}, Ctrl+C to stop`);
});
