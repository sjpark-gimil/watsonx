// lib/search-index.js
const MiniSearch = require('minisearch');

function getSearchIndexJSON(docsByLang) {
  const mini = new MiniSearch({
    fields: ['title', 'summary', 'content', 'tags', 'product', 'version', 'lang'],
    storeFields: ['slug', 'title', 'summary', 'product', 'version', 'lang', 'est_minutes', 'level'],
  });
  const rows = [];
  for (const lang of Object.keys(docsByLang)) {
    for (const d of docsByLang[lang]) {
      rows.push({
        id: `${lang}:${d.slug}`,
        lang,
        slug: d.slug,
        title: d.front.title,
        summary: d.front.summary,
        product: d.front.product,
        version: d.front.version,
        est_minutes: d.front.est_minutes,
        level: d.front.level,
        tags: (d.front.tags || []).join(' '),
        content: d.content
      });
    }
  }
  mini.addAll(rows);
  // expose index & stored fields
  return { index: mini.toJSON(), documents: rows.map(r => mini._documentStore.getDoc(r.id)) };
}

module.exports = { getSearchIndexJSON };
