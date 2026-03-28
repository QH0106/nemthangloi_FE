import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function getOutputPath(filePath) {
  if (filePath.endsWith(".tsx")) {
    return filePath.slice(0, -4) + ".jsx";
  }

  if (filePath.endsWith(".ts")) {
    return filePath.slice(0, -3) + ".js";
  }

  return null;
}

function convertFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const isTsx = filePath.endsWith(".tsx");

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.Preserve,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      removeComments: false,
      sourceMap: false,
    },
    fileName: path.basename(filePath),
    reportDiagnostics: false,
  });

  const outputPath = getOutputPath(filePath);
  if (!outputPath) {
    return;
  }

  fs.writeFileSync(outputPath, transpiled.outputText, "utf8");
  fs.unlinkSync(filePath);

  if (isTsx) {
    console.log(`TSX -> JSX: ${path.relative(rootDir, filePath)}`);
  } else {
    console.log(`TS -> JS: ${path.relative(rootDir, filePath)}`);
  }
}

const allFiles = walk(srcDir).filter((filePath) => {
  if (filePath.endsWith(".d.ts")) {
    return false;
  }

  return filePath.endsWith(".ts") || filePath.endsWith(".tsx");
});

for (const filePath of allFiles) {
  convertFile(filePath);
}

console.log(`Converted ${allFiles.length} files.`);
