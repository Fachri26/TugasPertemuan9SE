const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (result.length === 0) {
      // user baru
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json(err);
          return res.json({ message: "User registered" });
        }
      );
    } else {
      const user = result[0];

      if (user.deleted_at !== null) {
        // reactivation 
        db.query(
          "UPDATE users SET password = ?, deleted_at = NULL WHERE email = ?",
          [hashedPassword, email],
          (err) => {
            if (err) return res.status(500).json(err);
            return res.json({ message: "Account reactivated" });
          }
        );
      } else {
        return res.status(400).json({ error: "Email already registered" });
      }
    }
  });
};

const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(400).json({ error: "User not found or inactive" });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Wrong password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
};

exports.softDelete = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET deleted_at = NOW() WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User soft deleted" });
    }
  );
};