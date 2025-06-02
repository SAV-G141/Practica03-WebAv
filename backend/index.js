const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// MySQL pool setup with generic config (modify as needed)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'practica03db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

  
// Sample route
app.get('/', (req, res) => {
  res.json({ message: 'Express backend is running' });
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by id
app.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
app.post('/products', async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;
  if (!name || !description || price === undefined || stock === undefined || !image_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url]
    );
    const insertedId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product by id
app.put('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, stock, image_url } = req.body;
  if (!name || !description || price === undefined || stock === undefined || !image_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE products SET name=?, description=?, price=?, stock=?, image_url=? WHERE id=?',
      [name, description, price, stock, image_url, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product by id
app.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id=?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express backend listening at http://localhost:${port}`);
});
