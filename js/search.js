(function (root) {
  "use strict";

  const normalizeText = (value = "") => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/\s+/g, " ");

  const levenshtein = (left, right) => {
    if (left === right) return 0;
    if (!left.length) return right.length;
    if (!right.length) return left.length;
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    const current = new Array(right.length + 1);

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      current[0] = leftIndex;
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
        current[rightIndex] = Math.min(current[rightIndex - 1] + 1, previous[rightIndex] + 1, previous[rightIndex - 1] + cost);
      }
      for (let index = 0; index <= right.length; index += 1) previous[index] = current[index];
    }
    return previous[right.length];
  };

  const typoTolerance = (token) => token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0;

  const scoreItem = (item, query) => {
    const queryTokens = query.split(" ").filter(Boolean);
    if (!queryTokens.length) return 0;
    let score = 0;
    if (item.normalizedTitle === query) score += 120;
    else if (item.normalizedTitle.includes(query)) score += 80;
    if (item.normalizedText.includes(query)) score += 45;

    for (const queryToken of queryTokens) {
      let bestTokenScore = 0;
      for (const candidate of item.tokens) {
        if (candidate === queryToken) bestTokenScore = Math.max(bestTokenScore, 25);
        else if (candidate.startsWith(queryToken) || queryToken.startsWith(candidate)) bestTokenScore = Math.max(bestTokenScore, 18);
        else if (candidate.includes(queryToken)) bestTokenScore = Math.max(bestTokenScore, 12);
        else {
          const tolerance = typoTolerance(queryToken);
          if (tolerance && Math.abs(candidate.length - queryToken.length) <= tolerance && levenshtein(candidate, queryToken) <= tolerance) bestTokenScore = Math.max(bestTokenScore, 9);
        }
      }
      if (!bestTokenScore) return 0;
      score += bestTokenScore;
    }
    return score;
  };

  const api = Object.freeze({ normalizeText, levenshtein, typoTolerance, scoreItem });
  root.GuideSearch = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

