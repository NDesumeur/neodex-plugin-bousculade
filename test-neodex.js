// lancé par le test « local » de NeoDex : contre l'ordinateur, fait entrer un éléphant en A1 regard vers le bas, attend la réponse de l'ordinateur,
// vérifie le tour et l'absence d'erreur, la force affichée avant de pousser, le cri de l'animal qui pousse, le plein écran et la place prise à la taille de la fenêtre (avec NEO_SHOTS : garde des images)
module.exports = async ({ pj, sleep }) => {
  const label = () => pj(`document.getElementById('buCanvas').getAttribute('aria-label') || ''`);
  const click = (x, y) => pj(`(() => { const c = document.getElementById('buCanvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: r.left + ${x} / 320 * r.width, clientY: r.top + ${y} / 240 * r.height})); return 0; })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('buCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'bousculade-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await sleep(600); await shot('0-menu');
  await click(105, 90); await sleep(150); await click(160, 192); await sleep(400);  // « L'ordinateur », puis « JOUER »
  if (!/tour des Éléphants, coup 0/.test(await label())) throw new Error('la partie devait commencer : « ' + await label() + ' »');
  await click(32, 120); await sleep(150); await click(96, 60); await sleep(200); await shot('1-regard'); await click(96, 81); await sleep(200);  // réserve, case A1, regard vers le bas
  for (let i = 0; i < 20 && !/coup 2/.test(await label()); i++) await sleep(300);
  await shot('2-reponse');
  const l = await label(), errs = await pj(`window.__e.join(' | ')`);
  if (errs) throw new Error('erreur : ' + errs);
  if (!/tour des Éléphants, coup 2/.test(l)) throw new Error("l'ordinateur devait répondre : « " + l + ' »');
  // la force affichée avant de pousser : un éléphant face à un rocher et un rhinocéros qui regarde en face (trop faible), puis le rocher seul (ça passe)
  const B = code => pj(`(() => { const bu = document.getElementById('buCanvas').__bu.st(); ${code} })()`);
  await B(`const s = bu.s; s.b = Array(25).fill(null); s.b[10] = {t: 'E', d: 1}; s.b[11] = {t: 'O', d: 0}; s.b[12] = {t: 'R', d: 3}; s.turn = 'E'; s.win = null; bu.think = 0; bu.mode = 'play'; bu.sel = bu.pend = null; return 0;`);
  await sleep(100); await click(96, 124); await sleep(200); await shot('3-trop-faible');
  const f1 = await B('return bu.forceTxt;'); if (!String(f1).includes('+1 -1 = 0 contre 1 rocher : trop faible')) throw new Error('force trop faible : « ' + f1 + ' »');
  await B('bu.s.b[12] = null; return 0;'); await sleep(150);
  const f2 = await B('return bu.forceTxt;'); if (!/Force 1 contre 1 rocher : ça passe/.test(f2)) throw new Error('force qui passe : « ' + f2 + ' »');
  await click(128, 124); await sleep(180); await shot('4-barrit');
  const by = await B('return JSON.stringify([bu.flash?.by, bu.s.b[11]?.t, bu.s.b[12]?.t]);');
  if (by !== JSON.stringify([{at: 11, t: 'E'}, 'E', 'O'])) throw new Error('la poussée : ' + by);
  if (process.env.NEO_SHOTS) {  // les quatre images des animaux (normale et oreilles rabattues / queue de côté), agrandies
    const d = await pj(`(() => { const S = document.getElementById('buCanvas').__bu.spr, c = document.createElement('canvas'); c.width = 4 * 28 * 6; c.height = 28 * 6; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#c49c6a'; g.fillRect(0, 0, c.width, c.height); ['E', 'E2', 'R', 'R2'].forEach((k, i) => g.drawImage(S[k], i * 168, 0, 168, 168)); return c.toDataURL(); })()`);
    require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'bousculade-5-animaux.png'), Buffer.from(d.split(',')[1], 'base64'));
  }
  await sleep(1500);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('buFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('buCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('buCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('buCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1) throw new Error('la zone de jeu dépasse la fenêtre : ' + JSON.stringify(L));
  // l'image finale (capture du NeoStore) : une poussée à deux éléphants contre un rocher et un rhinocéros, la force affichée
  await B(`const s = bu.s; s.b = Array(25).fill(null); Object.assign(s.b, {5: {t: 'E', d: 1}, 6: {t: 'E', d: 1}, 7: {t: 'O', d: 0}, 8: {t: 'R', d: 3}, 12: {t: 'O', d: 0}, 18: {t: 'O', d: 0}, 17: {t: 'R', d: 0}, 21: {t: 'E', d: 0}, 14: {t: 'R', d: 2}}); s.res = {E: 2, R: 2}; s.turn = 'E'; s.win = null; s.n = 9; bu.think = 0; bu.mode = 'play'; bu.sel = bu.pend = null; bu.flash = null; return 0;`);
  await sleep(100); await click(96, 92); await sleep(300);
  const f3 = await B('return bu.forceTxt;'); if (!String(f3).includes('+2 -1 = 1 contre 1 rocher : ça passe')) throw new Error('force à deux : « ' + f3 + ' » ' + await B('return JSON.stringify([bu.mode, bu.sel, bu.s.turn, bu.vs, bu.kb, bu.focus, bu.hits.length]);'));
  return l + ' · force trop faible puis qui passe · éléphant qui barrit · plein écran · plateau ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
