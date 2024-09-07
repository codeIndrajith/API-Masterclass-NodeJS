const http = require('http');
const PORT = 4000;

const server = http.createServer((req, res) => {
  console.log(req);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server running PORT: ${PORT}`);
});
