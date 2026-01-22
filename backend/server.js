const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('uploads')); // serve uploaded files

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Endpoint for uploading product image
app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  // Return a placeholder 3D model (here we just return the image as a "model")
  const fileUrl = `http://localhost:3000/${req.file.filename}`;
  res.json({ success: true, modelUrl: fileUrl });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
