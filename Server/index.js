const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ✅ Register route
app.post('/register', (req, res) => {
  const { EmailID, Password } = req.body;
  const Role = 'user';

  if (!EmailID || !Password) {
    return res.status(400).json({ message: 'Missing Email or Password' });
  }

  db.query('SELECT * FROM users WHERE EmailID = ?', [EmailID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    db.query(
      'INSERT INTO users (EmailID, Password, Role) VALUES (?, ?, ?)',
      [EmailID, Password, Role],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// ✅ Login route
app.post('/login', (req, res) => {
  const { EmailID, Password } = req.body;

  if (!EmailID || !Password) {
    return res.status(400).json({ message: 'Missing Email or Password' });
  }

  db.query('SELECT * FROM users WHERE EmailID = ? AND Password = ?', [EmailID, Password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });

    if (result.length > 0) {
      return res.status(200).json({ success: true, user: result[0] });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// ✅ Property Booking route
app.post('/api/book', (req, res) => {
  const { name, phone, email, propertyId } = req.body;

  if (!name || !phone || !email || !propertyId) {
    return res.status(400).json({ message: 'Missing fields in booking request' });
  }

  const query = `
    INSERT INTO bookings (user_email, property_id, user_name, user_phone)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [email, propertyId, name, phone], (err) => {
    if (err) return res.status(500).json({ message: 'Booking failed' });

    res.status(201).json({ message: 'Booking successful' });
  });
});

// ✅ Create feedback table (Run this SQL separately in MySQL)
const createTableQuery = `
CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_message TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createTableQuery, (err, result) => {
  if (err) console.log('Table creation error:', err);
  else console.log('✅ Feedback table ready!');
});

// ✅ API Route: Submit feedback
app.post('/api/feedback', (req, res) => {
  const { feedback_message, rating } = req.body;
  if (!feedback_message || !rating) {
    return res.status(400).json({ message: '⚠️ Feedback and rating are required' });
  }

  const sql = 'INSERT INTO feedbacks (feedback_message, rating) VALUES (?, ?)';
  db.query(sql, [feedback_message, rating], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: '⚠️ Server error' });
    }
    res.status(201).json({ message: '✅ Feedback submitted successfully!' });
  });
});


// ✅ Get all feedbacks (optional)
app.get('/api/feedback', (req, res) => {
  db.query('SELECT * FROM feedbacks', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch feedbacks' });

    res.status(200).json(results);
  });
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
