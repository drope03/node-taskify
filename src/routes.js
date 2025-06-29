import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { BuildRoutePath } from "./utils/index.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: BuildRoutePath("/task"),
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
    method: "PUT",
    path: BuildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message:
              "titulo ou descrição são obrigatórios para alterar a task!",
          })
        );
      }

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            message:
              "Task inexistente, confirme se o id está correto ou existe.",
          })
        );
      }

      database.update("tasks", id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });

      return res.writeHead(200).end(
        JSON.stringify({
          message: "Task alterada com sucesso!",
        })
      );
    },
  },
  {
    method: "DELETE",
    path: BuildRoutePath("/task/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            message:
              "Task inexistente, confirme se o id está correto ou existe.",
          })
        );
      }

      database.delete("tasks", id);

      return res.writeHead(200).end(
        JSON.stringify({
          message: "Task deletada com sucesso!",
        })
      );
    },
  },
  {
    method: "PATCH",
    path: BuildRoutePath("/task/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            message:
              "Task inexistente, confirme se o id está correto ou existe.",
          })
        );
      }

      const isTaskCompleted = !task.completed_at;
      const completedAt = isTaskCompleted ? null : new Date();

      database.update("tasks", id, { completedAt });

      return res.writeHead(200).end(
        JSON.stringify({
          message: "Task Realizada!",
        })
      );
    },
  },
];
