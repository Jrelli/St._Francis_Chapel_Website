// Post-build check on the generated HTML in dist/.
//
// Catches text running straight into a link ("by<a>Una Voce" renders as "byUna Voce").
// Astro drops the line break between text and a tag on the next line, and Prettier often
// wraps lines exactly there. Fix by ending the text line with {' '}.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const problems = [];
for (const file of htmlFiles('dist')) {
  const html = readFileSync(file, 'utf8');
  // A letter or comma directly before <a …>, or a closing </a> directly followed by a letter.
  for (const match of html.matchAll(/[A-Za-z,](<a\s[^>]*>[^<]{0,40})|(<\/a>[A-Za-z]{1,20})/g)) {
    problems.push(`${file}: …${match[0].replace(/\s+data-astro-cid-\w+/g, '')}…`);
  }
}

if (problems.length > 0) {
  console.error("Missing space next to a link (add {' '} at the end of the line before it):");
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('check-html: no missing spaces around links.');
