// lib/terms.js
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const ROOT = path.join(__dirname, '..', 'content');

async function loadTerms() {
  const langs = ['en', 'ko'];
  const result = {};
  for (const lang of langs) {
    const dir = path.join(ROOT, lang, 'terms');
    const items = [];
    if (fs.existsSync(dir)) {
      for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith('.yml') && !name.endsWith('.yaml') && !name.endsWith('.json')) continue;
        const raw = fs.readFileSync(path.join(dir, name), 'utf8');
        const data = name.endsWith('.json') ? JSON.parse(raw) : YAML.parse(raw);
        items.push(data);
      }
    }
    result[lang] = items;
  }
  return result;
}

function buildAliasMap(termsByLang) {
  const out = {};
  for (const [lang, terms] of Object.entries(termsByLang)) {
    const map = {};
    for (const t of terms) {
      const id = t.id || t.term;
      const aliases = [t.term, ...(t.aliases || [])]
        .filter(Boolean)
        // normalize (lowercase for EN; keep as-is for KO; adjust as you like)
        .map(s => s.trim());
      for (const a of aliases) map[a] = id;
    }
    // Build a giant regex per lang (longest first to avoid partials)
    const sorted = Object.keys(map).sort((a, b) => b.length - a.length)
      .map(s => escapeRegex(s));
    const rx = sorted.length ? new RegExp(`(${sorted.join('|')})`, 'g') : null;
    out[lang] = { aliasToId: map, regex: rx };
  }
  return out;
}

function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

module.exports = { loadTerms, buildAliasMap };
