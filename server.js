const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = require('./data/products.json');

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(p => p.category === category);
    return res.json(filtered);
  }
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  const cats = [...new Set(products.map(p => p.category))];
  res.json(cats);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3002;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`iSolar running on http://127.0.0.1:${PORT}`);
});
