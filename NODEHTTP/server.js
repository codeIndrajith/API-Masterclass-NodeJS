const http = require('http');
const PORT = 4000;

const todo = [
  { id: 1, text: 'Todo 1' },
  { id: 2, text: 'Todo 2' },
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'Node.js');
  res.end(
    JSON.stringify({
      success: true,
      data: todo,
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server running PORT: ${PORT}`);
});
