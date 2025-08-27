import path from "path";
import fs from "fs";

const filePath = path.join(process.cwd(), "parameters.json");

function fileExists() {
  return fs.existsSync(filePath);
}

export function get() {
  if (!fileExists()) {
    return {};
  }
  const file = fs.readFileSync(filePath);
  return JSON.parse(file.toString());
}

export function update(content: object) {
  let parsedJSON = {};

  if (fileExists()) {
    const file = fs.readFileSync(filePath);
    parsedJSON = JSON.parse(file.toString());
  }
  const updatedJson = {
    ...parsedJSON,
    ...content,
  };
  return fs.writeFileSync(filePath, JSON.stringify(updatedJson));
}
