// lib/md.js
const MarkdownIt = require('markdown-it');
const anchor = require('markdown-it-anchor');

function createTermAutolinkPlugin(aliasMapForLang) {
  return (md) => {
    md.core.ruler.after('inline', 'term-autolink', state => {
      const { regex, aliasToId } = aliasMapForLang;
      if (!regex) return;
      const block = new Set(['code_block', 'fence', 'link_open', 'code_inline']);
      for (const token of state.tokens) {
        if (token.type !== 'inline') continue;
        // skip if in code or link
        let skip = false;
        for (const t of state.tokens) { if (block.has(t.type)) { skip = true; break; } }
        if (skip) continue;

        token.children.forEach((child, idx) => {
          if (child.type !== 'text') return;
          const parts = [];
          let last = 0;
          const text = child.content;
          text.replace(regex, (m, p1, offset) => {
            parts.push({ type: 'text', text: text.slice(last, offset) });
            const id = aliasToId[m] || aliasToId[m.trim()] || aliasToId[p1];
            parts.push({ type: 'term', text: m, id });
            last = offset + m.length;
          });
          if (!parts.length) return;
          parts.push({ type: 'text', text: text.slice(last) });

          // replace current text token with sequence of new tokens
          const newTokens = [];
          for (const part of parts) {
            if (part.type === 'text') {
              const t = new state.Token('text', '', 0);
              t.content = part.text;
              newTokens.push(t);
            } else {
              const open = new state.Token('html_inline', '', 0);
              open.content = `<span class="term" data-term-id="${part.id}">${part.text}</span>`;
              newTokens.push(open);
            }
          }
          // inject
          token.children.splice(idx, 1, ...newTokens);
        });
      }
    });
  };
}

function createMd(aliasMaps) {
  // return per-language renderers
  const md = {};
  for (const [lang, map] of Object.entries(aliasMaps)) {
    const inst = new MarkdownIt({ html: false, linkify: true })
      .use(anchor, { permalink: anchor.permalink.ariaHidden({}) })
      .use(createTermAutolinkPlugin(map));
    md[lang] = inst;
  }
  return md;
}

module.exports = { createMd };
