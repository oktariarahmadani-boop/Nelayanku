const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase, getAllProducts, getProductsByCategory, addProduct, updateProduct, deleteProduct } = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
initDatabase();

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  getAllProducts((err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(products);
  });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const category = req.params.category;
  getProductsByCategory(category, (err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(products);
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { nama, kategori, harga, stok, gambar } = req.body;
  
  if (!nama || !kategori || !harga) {
    res.status(400).json({ error: 'Nama, kategori, dan harga harus diisi' });
    return;
  }

  addProduct({ nama, kategori, harga, stok, gambar }, (err, id) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, message: 'Produk berhasil ditambahkan' });
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { nama, kategori, harga, stok, gambar } = req.body;

  updateProduct(id, { nama, kategori, harga, stok, gambar }, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Produk berhasil diupdate' });
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  
  deleteProduct(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Produk berhasil dihapus' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});