const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..', 'content');

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

async function loadAllDocs() {
  const files = walk(ROOT);
  return files.map(f => {
    const raw = fs.readFileSync(f, 'utf8');
    const { data, content } = matter(raw);
    const slug = path.relative(ROOT, f).replace(/\\/g, '/').replace(/\.(mdx?|MDX?)$/, '');
    return {
      slug,                 // e.g., ai/intro-to-foundation-models
      filepath: f,
      front: {
        title: data.title || slug,
        summary: data.summary || '',
        product: data.product || '',
        version: data.version || '',
        role: data.role || [],
        level: data.level || 'Beginner',
        est_minutes: data.est_minutes || 10,
        tags: data.tags || []
      },
      content
    };
  });
}

function getDocBySlug(all, slug) {
  return all.find(d => d.slug === slug);
}

function listDocs(all) {
  return all.map(d => ({
    slug: d.slug,
    title: d.front.title,
    summary: d.front.summary,
    product: d.front.product,
    version: d.front.version,
    tags: d.front.tags,
    est_minutes: d.front.est_minutes,
    level: d.front.level
  }));
}

module.exports = { loadAllDocs, getDocBySlug, listDocs };
