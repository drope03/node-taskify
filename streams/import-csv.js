import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { fileURLToPath } from "node:url";

const csvPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "tasks.csv"
);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2,
});

async function run() {
  const lines = stream.pipe(csvParse);

  for await (const line of lines) {
    const [title, description] = line;

    try {
      const response = await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
