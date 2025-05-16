import http from "node:http";

const server = http.createServer((req, res) => {
  return rex.end("Olá mundo!");
});

server.listen(3333);
