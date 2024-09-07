const http = require('http');
const PORT = 4000;

const todo = [
  { id: 1, text: 'Todo 1' },
  { id: 2, text: 'Todo 2' },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = [];

  // using express we can set req.body.name , req.body.email like this. but using http module we can use to chunk and Buffer method to get the body data
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      let status = 404;
      const response = {
        success: false,
        data: null,
      };

      if (method === 'GET' && url === '/todos') {
        status = 200;
        response.success = true;
        response.data = todo;
      } else if (method === 'POST' && url === '/todos') {
        const { id, text } = JSON.parse(body);
        if (!id || !text) {
          status = 400;
          response.error = 'Add id and text field';
        } else {
          todo.push({ id, text });
          status = 201;
          response.success = true;
          response.data = todo;
        }
      }
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js',
      });

      res.end(JSON.stringify(response));
    });
});

server.listen(PORT, () => {
  console.log(`Server running PORT: ${PORT}`);
});
