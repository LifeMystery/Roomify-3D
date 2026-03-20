// backend/server.js (updated)
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// serve frontend folder
app.use('/', express.static(path.join(__dirname, '../frontend')));

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// upload endpoint
app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  // URL now points to /uploads/filename
  res.json({ success: true, modelUrl: `/uploads/${req.file.filename}` });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
