const http = require('http');
const PORT = 4000;

const todo = [
  { id: 1, text: 'Todo 1' },
  { id: 2, text: 'Todo 2' },
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'Node.js');
  let body = [];

  // using express we can set req.body.name , req.body.email like this. but using http module we can use to chunk and Buffer method to get the body data
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      console.log(body);
    });
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
