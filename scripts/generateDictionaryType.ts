import fs from "fs";
import path from "path";

const dictionariesDir = path.join(process.cwd(), "app", "dictionaries");
const outputFile = path.join(process.cwd(), "types", "dictionary.ts");

function generateTypeFromJson(obj: object, indent: string = "  "): string {
  if (typeof obj !== "object" || obj === null) {
    return "string";
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return "{}";
  }

  const lines = entries.map(([key, value]) => {
    const type = generateTypeFromJson(value, indent + "  ");
    return `${indent}${key}: ${type};`;
  });

  return `{\n${lines.join("\n")}\n${indent.slice(0, -2)}}`;
}

function generateDictionaryType() {
  const enJsonPath = path.join(dictionariesDir, "en.json");
  const enJson = JSON.parse(fs.readFileSync(enJsonPath, "utf-8"));
  const dictionaryType = generateTypeFromJson(enJson);

  const content = `export type Dictionary = ${dictionaryType};
`;

  fs.writeFileSync(outputFile, content);
  console.info(`Dictionary type generated and written to ${outputFile}`);
}

generateDictionaryType();
