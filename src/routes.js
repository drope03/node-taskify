import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { BuildRoutePath } from "./utils/index.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: BuildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Titulo é obrigatório!" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Descrição é obrigatória!" }));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res
        .writeHead(201)
        .end(JSON.stringify({ message: "Task criada com sucesso!" }));
    },
  },
  {
    method: "GET",
    path: BuildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });

      return res.writeHead(200).end(JSON.stringify(tasks));
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
];
