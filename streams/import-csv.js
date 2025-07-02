import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { fileURLToPath } from "node:url";

const csvPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "tasks.csv"
);

async function run() {
  const stream = fs.createReadStream(csvPath);

  const csvParser = parse({
    columns: true,
    skipEmptyLines: true,
    trim: true,
  });

  const records = stream.pipe(csvParser);

  for await (const record of records) {
    const { titulo: title, descricao: description } = record;

    try {
      const response = await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        console.error(`Erro ao criar task: ${response.status}`);
      } else {
        console.log(`Task criada com sucesso!`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }
}

run();
