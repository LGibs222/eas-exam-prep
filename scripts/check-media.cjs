// Checks src/lessonMedia.jsx against the content: every diagram key must name
// a real module + concept title, and its `steps` (and `focus`) must have one
// entry per screen of that concept. Run after editing media or lesson plans.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8').replace(/\r\n/g, '\n');
const at = src.indexOf('const MODULES = '), st = src.indexOf('{', at), en = src.indexOf('\n};', st);
const M = JSON.parse(src.slice(st, en + 2));
const plans = JSON.parse(fs.readFileSync(path.join(root, 'src/data/lessonPlans.json'), 'utf8'));
const m = fs.readFileSync(path.join(root, 'src/lessonMedia.jsx'), 'utf8').replace(/\r\n/g, '\n');
const consts = Object.fromEntries([...m.matchAll(/^const (\w+) = '([^']+)'$/gm)].map(x => [x[1], x[2]]));
const re = /\[`\$\{(\w+)\}::([^`]+)`\]: \{([\s\S]*?)\n  \},/g;
let x, n = 0, bad = 0;
while ((x = re.exec(m))) {
  n++;
  const dom = consts[x[1]], title = x[2];
  const i = (M[dom]?.concepts || []).findIndex(c => c.title === title);
  const nb = i < 0 ? -1 : plans[dom][i].beats.length;
  const steps = (x[3].match(/steps: (\[[^\]]*\])/) || [])[1];
  const k = steps ? JSON.parse(steps).length : -1;
  const f = x[3].match(/focus: (\[.*?\]), finalStep/);
  const fk = f ? JSON.parse(f[1]).length : nb;
  if (i < 0 || k !== nb || fk !== nb) { bad++; console.log(`MISMATCH ${dom} | ${title}: concept ${i}, steps ${k}, focus ${fk}, screens ${nb}`); }
}
console.log(`media entries ${n}, problems ${bad}`);
process.exit(bad ? 1 : 0);
