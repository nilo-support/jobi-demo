// Generates the demo job board: a LinkedIn-STYLE feed and post pages for the
// 5 fictional jobs the iOS app knows. Fictional brand ("Openings"), no real
// company's name or logo. Run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';

const ctx = {};
vm.createContext(ctx);
vm.runInContext(readFileSync('../../Downloads/jobi/concepts/ios-island/data.js', 'utf8') + ';this.JOBS=JOBS;', ctx);
const JOBS = ctx.JOBS;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const head = (title) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title><link rel="stylesheet" href="${title === 'Jobs | Openings' ? '' : '../'}style.css"></head><body>`;
const bar = (back) => `<header class="bar">${back ? '<a class="back" href="../index.html" aria-label="Back">&#8249;</a>' : '<span class="brand">O</span>'}
<div class="search">Search jobs</div><span class="dots">&#8943;</span></header>`;

writeFileSync('index.html', head('Jobs | Openings') + bar(false) + `<main>
<h1>Top job picks for you</h1><p class="sub">Based on your profile and search history</p>
<ul class="feed">${JOBS.map((j) => `<li><a href="jobs/${j.id}.html">
<span class="logo" style="background:${j.tint}">${j.mono}</span>
<span class="txt"><b>${esc(j.role)}</b><span>${esc(j.company)}</span><span class="muted">${esc(j.place)} &middot; ${esc(j.pay)}</span>
<span class="promo">${j.posted} ago &middot; ${40 + j.score * 3} applicants</span></span></a></li>`).join('')}</ul>
<p class="foot">Openings is a fictional job board for the Jobi demo.</p></main></body></html>`);

for (const j of JOBS) {
  writeFileSync(`jobs/${j.id}.html`, head(`${j.role} | ${j.company}`) + bar(true) + `<main class="post">
<span class="logo big" style="background:${j.tint}">${j.mono}</span>
<p class="co">${esc(j.company)}</p><h1>${esc(j.role)}</h1>
<p class="muted">${esc(j.place)} &middot; ${j.posted} ago &middot; ${40 + j.score * 3} applicants</p>
<div class="tags"><span>${esc(j.pay)}</span><span>${esc(j.type)}</span></div>
<div class="btns"><a class="apply">Apply</a><a class="save">Save</a></div>
<section><h2>About the job</h2><p>${esc(j.about)}</p>
<h3>What you'll do</h3><ul>${j.doing.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
<h3>What we're looking for</h3><ul>${j.reqs.map((r) => `<li>${esc(r.line)}</li>`).join('')}</ul></section>
<p class="foot">Openings is a fictional job board for the Jobi demo. Tap Share, then Jobi.</p></main></body></html>`);
}
console.log('built', JOBS.length, 'jobs');
