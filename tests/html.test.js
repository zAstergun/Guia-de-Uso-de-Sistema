"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync("index.html", "utf8");
const matches = (pattern) => Array.from(html.matchAll(pattern));
const ids = matches(/\sid=["']([^"']+)["']/gi).map((match) => match[1]);
const hashTargets = matches(/\shref=["']#([^"']*)["']/gi).map((match) => match[1]);
const images = matches(/<img\b[^>]*>/gi).map((match) => match[0]);
const headings = matches(/<h([1-6])\b/gi).map((match) => Number(match[1]));
const localAssets = matches(/\s(?:src|href)=["']([^"']+)["']/gi)
  .map((match) => match[1])
  .filter((value) => !/^(?:https?:|mailto:|#)/i.test(value));

assert.equal(matches(/<head\b/gi).length, 1, "a página deve ter um head");
assert.equal(matches(/<main\b/gi).length, 1, "a página deve ter um main");
assert.equal(ids.length, new Set(ids).size, "há IDs duplicados");
assert.ok(hashTargets.every((target) => target && ids.includes(target)), "há âncora vazia ou sem destino");
assert.ok(images.every((image) => /\salt=["'][^"']+["']/i.test(image)), "há imagem sem texto alternativo");
assert.ok(images.every((image) => /\sloading=["']lazy["']/i.test(image)), "há imagem de conteúdo sem carregamento tardio");
assert.equal(headings.filter((level) => level === 1).length, 1, "a página deve ter exatamente um h1");
assert.ok(headings.every((level, index) => index === 0 || level - headings[index - 1] <= 1), "há salto na hierarquia de títulos");
assert.equal((html.match(/<\/head>/gi) || []).length, 1, "há fechamento duplicado de head");
assert.ok(localAssets.every((asset) => fs.existsSync(path.resolve(decodeURI(asset)))), "há arquivo local referenciado que não existe");

console.log("Validação estrutural do HTML: aprovada.");
