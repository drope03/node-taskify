import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { BuildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: BuildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if(!title){
        return res.writeHead(400).end(
          JSON.stringify({ message:'título é obrigatório'})
        )
      }

      if(!description){
        return res.writeHead
      }
    },
  },
  {
    method: "",
    path: "",
    handler: (req, res) => {},
  },
  {
    method: "",
    path: "",
    handler: (req, res) => {},
  },
    {
    method: "",
    path: "",
    handler: (req, res) => {},
  },
];
