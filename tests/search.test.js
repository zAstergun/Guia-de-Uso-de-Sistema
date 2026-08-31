"use strict";

const assert = require("node:assert/strict");
const { normalizeText, scoreItem } = require("../js/search.js");

const makeItem = (title, text) => {
  const normalizedTitle = normalizeText(title);
  const normalizedText = normalizeText(`${title} ${text}`);
  return {
    normalizedTitle,
    normalizedText,
    tokens: Array.from(new Set(normalizedText.match(/[a-z0-9]+/g) || []))
  };
};

const caixa = makeItem("Fechamento do Caixa", "Passos para o fechamento diário e conciliação de valores");
const convenios = makeItem("Convênios e PBM", "Autorização de descontos");
const organizacao = makeItem("Organização e Limpeza da Loja", "Rotina operacional diária");

assert.equal(normalizeText("  ORGANIZAÇÃO   "), "organizacao");
assert.ok(scoreItem(organizacao, normalizeText("organização")) > 0, "encontra termo acentuado");
assert.ok(scoreItem(organizacao, normalizeText("organizacao")) > 0, "encontra termo sem acento");
assert.ok(scoreItem(convenios, normalizeText("convenios")) > 0, "normaliza convênios");
assert.ok(scoreItem(caixa, normalizeText("fecha")) > 0, "aceita termo parcial");
assert.ok(scoreItem(caixa, normalizeText("fechamnto")) > 0, "tolera um erro simples de digitação");
assert.equal(scoreItem(caixa, normalizeText("termo inexistente")), 0, "rejeita termo inexistente");

console.log("Testes do mecanismo de busca: 7 cenários aprovados.");

