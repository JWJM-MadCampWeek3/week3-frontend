const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use('/api', createProxyMiddleware({ 
  target: 'https://solved.ac/api/', // 외부 API의 기본 URL
  changeOrigin: true,
}));

app.use(cors());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
