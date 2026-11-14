#!/usr/bin/env node

import { freezeJson } from "@red-cup-engineering/json-engineering-services-section";

import { requireTextFileRead } from "@red-cup-engineering/computer-file-engineering-services-section/require-text-file-read";

import { parseJavaScript, walkJavaScript } from "@red-cup-engineering/javascript-parser-service";
import { readJavaScriptModuleRequestSites } from "@red-cup-engineering/javascript-parser-service/module-reference-sites";
import operationInputSchema from "../data/records/read-javascript-file-imports.input.schema.json" with { type: "json" };
import operationOutputSchema from "../data/records/read-javascript-file-imports.output.schema.json" with { type: "json" };
import { runJavascriptNodeOperation } from "@red-cup-engineering/node-js-function-engineering-services-section/operation";

/**
 * Reads the module imports carried by one JavaScript text-file reading without resolving them.
 * @param {object} reading A TextFileRead containing one JavaScript path and its source text.
 * @returns {object} An immutable JavascriptFileImportsRead@1 carrying ordered JavascriptFileImport@1 records.
 * @throws {TypeError} When the input is not exactly a TextFileRead carrier.
 * @throws {SyntaxError} When the current JavaScript parser cannot admit the source.
 */
export function readJavascriptFileImports(reading) {
  const { path, text } = requireTextFileRead(reading, { exactKeys: true });

  const program = parseJavaScript(text);
  const imports = [];
  const add = (specifier, start, end, kind) => imports.push({
    type: "JavascriptFileImport", version: 1, path, specifier,
    start: start + 1, end: end - 1, kind,
  });
  for (const site of readJavaScriptModuleRequestSites(program)) {
    if (site.specifier === null || site.kind === "require") continue;
    const kind = site.kind === "import" && site.node.type.startsWith("Export") ? "export-from" : site.kind;
    add(site.specifier, site.start, site.end, kind);
  }
  // Resolution expressions are authored ESM references, not loader requests.
  // Keep that distinction local to this file-reading contract.
  walkJavaScript(program, node => {
    if (node.type !== "CallExpression" || node.arguments.length !== 1) return;
    const callee = node.callee, argument = node.arguments[0];
    if (callee.type !== "MemberExpression" || callee.computed || callee.property.name !== "resolve") return;
    if (callee.object?.type !== "MetaProperty" || callee.object.meta.name !== "import" || callee.object.property.name !== "meta") return;
    if (argument.type === "Literal" && typeof argument.value === "string") add(argument.value, argument.start, argument.end, "import-meta-resolve");
  });

  return freezeJson({ type: "JavascriptFileImportsRead", version: 1, path, imports: imports.sort((left, right) => left.start - right.start) });
}

if (import.meta.main) {
  const result = await runJavascriptNodeOperation({ name: "read-javascript-file-imports", description: "Reads the module imports carried by one JavaScript text-file reading without resolving them.", operation: readJavascriptFileImports, inputSchema: operationInputSchema, outputSchema: operationOutputSchema }, { arguments: process.argv.slice(2), standardInput: process.stdin, standardOutput: process.stdout });
  process.exitCode = result.exitCode;
}
