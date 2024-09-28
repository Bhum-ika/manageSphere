import express from 'express';
import request from 'request';

const app = express();

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route to proxy requests
app.use('/api', (req, res) => {
  const url = `http://192.168.60.132:8081${req.url}`;

  // Forward request to the target API
  req.pipe(request({ url })).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
