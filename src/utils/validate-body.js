export function ValidateBody(req, res) {
  if (!req.body || typeof req.body !== "body") {
    res
      .writeHead(400)
      .end(JSON.stringify({ message: "Corpo inválido ou ausente" }));
      return false;
  }
  return true;
}
