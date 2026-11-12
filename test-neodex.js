// lancé par le test « local » de NeoDex : contre l'ordinateur, fait entrer un éléphant en A1 regard vers le bas, attend la réponse de l'ordinateur,
// puis vérifie le tour et l'absence d'erreur (avec NEO_SHOTS : garde des images)
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
  return l;
};
