// Bousculade : pousser un rocher hors du plateau avec ses éléphants ou ses rhinocéros, contre l'ordinateur ou à deux.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Bousculade</span><span class="hint">clic : choisir un animal, puis une case · flèches et Entrée au clavier · Échap : annuler</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="buCanvas" width="320" height="240" role="img" aria-label="Bousculade"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="buStats"></div></div>
      <div class="row"><button class="btn main" id="buNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Éléphants contre rhinocéros, trois rochers au milieu. À ton tour, une seule action : faire entrer un animal de ta réserve sur une case du bord, en déplacer un d'une case, le tourner sur place, le faire sortir par un bord, ou pousser droit devant. Après un déplacement ou une entrée, choisis où il regarde. Pour pousser, la force doit suffire : chaque animal qui regarde dans le sens de la poussée compte +1, chaque animal qui regarde en face −1, et chaque rocher demande 1 de force. Quand un rocher sort, c'est l'animal le plus proche derrière lui, qui regarde dans le sens de la poussée, qui fait gagner son camp, même si c'est l'adversaire !</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,640px);width:auto;aspect-ratio:320/240;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "BOUSCULADE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#7ab84a", "accL": "#c8f0a0", "accS": "#3a6a1a", "accD": "#14200c", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#14200c", "spark2": "#e8b84a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "....kkkk....", "...kwwwwk...", "..kwwwwwwk..", "..kwwwwwwk..", "...kkkkkk...", "............", ".kk......kk.", "kaak....kook", "kaaak..kooo.", "kaak....kook", ".kk......kk."],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Bousculade : éléphants contre rhinocéros sur un plateau de 5 × 5 avec trois rochers au milieu. À ton tour, une action : faire entrer
   un animal par un bord, en déplacer un d'une case (et choisir où il regarde), le tourner sur place, le faire sortir par un bord, ou pousser
   droit devant. Pousser : chaque animal qui regarde dans le sens de la poussée ajoute 1 de force, chaque animal qui regarde en face en retire 1,
   et chaque rocher demande 1 de force. Le rocher qui sort du plateau fait gagner l'animal le plus proche derrière lui qui regarde dans le sens
   de la poussée (même s'il est de l'autre camp !). Contre l'ordinateur (3 niveaux) ou à deux sur ce PC. ---------- */
const BU = {W: 320, H: 240, TS: 32, X0: 80, Y0: 44};
const BU_D = [[-1, 0], [0, 1], [1, 0], [0, -1]];  // haut, droite, bas, gauche
const BU_TEAM = {E: 'Éléphants', R: 'Rhinocéros'}, BU_LV = ['Facile', 'Normal', 'Difficile'];
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };  // une image dessinée une fois
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const bus = gstore('bousculade', {wins: [0, 0, 0], losses: [0, 0, 0], duels: 0, level: 1, side: 'E'});
let bu = null, buac = null, buMute = false;
function buBeep(f, d, type = 'square', slide = 0, vol = .03) { if (buMute) return; try { buac ??= new AudioContext(); const o = buac.createOscillator(), g = buac.createGain(), t = buac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(buac.destination); o.start(t); o.stop(t + d); } catch {} }
/* les règles (sans dessin : l'ordinateur s'en sert aussi). Le plateau : 25 cases, null ou {t: 'E' | 'R' | 'O' (rocher), d: 0 à 3} */
const buStart = () => ({b: Array.from({length: 25}, (_, i) => i >= 11 && i <= 13 ? {t: 'O', d: 0} : null), res: {E: 5, R: 5}, turn: 'E', win: null, n: 0, last: null});
const buStep = (i, d) => { const r = Math.floor(i / 5) + BU_D[d][0], c = i % 5 + BU_D[d][1]; return r < 0 || r > 4 || c < 0 || c > 4 ? -1 : r * 5 + c; };
const buOut = i => { const r = Math.floor(i / 5), c = i % 5, o = []; if (r === 0) o.push(0); if (c === 4) o.push(1); if (r === 4) o.push(2); if (c === 0) o.push(3); return o; };  // les côtés par où la case touche le bord
// une poussée qui commence sur la case i (occupée), dans le sens d, par un animal qui arrive derrière : la file à pousser et si la force suffit
function buForce(s, i, d) {
  let f = 1, rocks = 0; const line = [];
  for (let j = i; j >= 0 && s.b[j]; j = buStep(j, d)) { const p = s.b[j]; line.push(j); if (p.t === 'O') rocks++; else if (p.d === d) f++; else if (p.d === (d + 2) % 4) f--; }
  return {ok: line.length > 0 && f > 0 && f >= rocks, line};
}
function buMoves(s) {
  if (s.win) return [];
  const me = s.turn, out = [];
  for (let i = 0; i < 25; i++) {
    const p = s.b[i];
    if (p && p.t === me) {
      const j = buStep(i, p.d); if (j >= 0 && s.b[j] && buForce(s, j, p.d).ok) out.push({k: 'push', from: i, d: p.d});
      for (let dd = 0; dd < 4; dd++) { const t = buStep(i, dd); if (t >= 0 && !s.b[t]) for (let d = 0; d < 4; d++) out.push({k: 'move', from: i, to: t, d}); }
      for (let d = 0; d < 4; d++) if (d !== p.d) out.push({k: 'rot', from: i, d});
      if (buOut(i).length) out.push({k: 'exit', from: i});
    }
    if (s.res[me] && buOut(i).length) {
      if (!s.b[i]) { for (let d = 0; d < 4; d++) out.push({k: 'enter', to: i, d}); }
      else for (const od of buOut(i)) { const d = (od + 2) % 4; if (buForce(s, i, d).ok) out.push({k: 'pushin', to: i, d}); }
    }
  }
  return out;
}
function buApply(s, m) {
  const me = s.turn, t = {b: s.b.slice(), res: {...s.res}, turn: me === 'E' ? 'R' : 'E', win: null, n: s.n + 1, last: m, fell: null};
  if (m.k === 'enter') { t.b[m.to] = {t: me, d: m.d}; t.res[me]--; }
  else if (m.k === 'move') { t.b[m.to] = {t: me, d: m.d}; t.b[m.from] = null; }
  else if (m.k === 'rot') t.b[m.from] = {t: me, d: m.d};
  else if (m.k === 'exit') { t.b[m.from] = null; t.res[me]++; }
  else {  // push / pushin : toute la file avance d'une case, la dernière pièce peut tomber du plateau
    const start = m.k === 'push' ? buStep(m.from, m.d) : m.to, {line} = buForce(s, start, m.d), pusher = m.k === 'push' ? s.b[m.from] : {t: me, d: m.d};
    for (let j = line.length - 1; j >= 0; j--) {
      const from = line[j], nx = buStep(from, m.d), p = s.b[from]; t.b[from] = null;
      if (nx >= 0) { t.b[nx] = p; continue; }
      t.fell = {p, at: from};
      if (p.t !== 'O') t.res[p.t]++;
      else {  // le rocher est sorti : gagne l'animal le plus proche derrière lui qui regarde dans le sens de la poussée
        const behind = [...line.slice(0, j).reverse().map(k => s.b[k]), pusher];
        t.win = behind.find(q => q.t !== 'O' && q.d === m.d).t;
      }
    }
    if (m.k === 'push') t.b[m.from] = null; else t.res[me]--;
    t.b[start] = pusher;
  }
  return t;
}
/* l'ordinateur : recherche alpha-bêta sur 1, 2 ou 3 coups, avec une évaluation des rochers (qui pourrait les sortir, et de combien ils sont loin du bord) */
function buEval(s, me) {
  if (s.win) return s.win === me ? 1e5 - s.n : -1e5 + s.n;
  let v = 0;
  for (let i = 0; i < 25; i++) {
    const p = s.b[i]; if (!p || p.t === 'O') continue;
    const sg = p.t === me ? 1 : -1; v += sg * 2;
    let a = 0, j = i;  // le premier rocher droit devant
    while ((j = buStep(j, p.d)) >= 0) { a++; if (s.b[j]?.t === 'O') break; }
    if (j < 0) continue;
    const r = Math.floor(j / 5), c = j % 5, e = [r, 4 - c, 4 - r, c][p.d];  // cases entre ce rocher et le bord
    v += sg * (5 - e) * 6 / a;
    if (a === 1 || buForce(s, buStep(i, p.d), p.d).ok) v += sg * (5 - e) * 3;  // il peut pousser tout de suite
  }
  return v;
}
const buOrder = m => m.k === 'push' || m.k === 'pushin' ? 0 : m.k === 'enter' ? 2 : 1;
function buSearch(s, depth, a, b, me, budget) {
  if (s.win || depth === 0 || budget.n <= 0) { budget.n--; return buEval(s, me); }
  const ms = buMoves(s).sort((x, y) => buOrder(x) - buOrder(y)), max = s.turn === me;
  let best = max ? -Infinity : Infinity;
  for (const m of ms) {
    const v = buSearch(buApply(s, m), depth - 1, a, b, me, budget);
    if (max) { best = Math.max(best, v); a = Math.max(a, v); } else { best = Math.min(best, v); b = Math.min(b, v); }
    if (b <= a) break;
  }
  return best;
}
function buThink(s, level, rnd = Math.random) {
  const me = s.turn, depth = [1, 2, 3][level], budget = {n: [5e3, 6e4, 2.5e5][level]}, scored = [];
  for (const m of buMoves(s).sort((x, y) => buOrder(x) - buOrder(y))) scored.push([buSearch(buApply(s, m), depth - 1, -Infinity, Infinity, me, budget) + (level === 0 ? rnd() * 14 : rnd() * .5), m]);
  scored.sort((x, y) => y[0] - x[0]);
  if (level === 0 && scored[0][0] < 5e4 && rnd() < .3) return scored[Math.floor(rnd() * Math.min(4, scored.length))][1];  // en facile, il lui arrive de jouer moins bien
  return scored[0][1];
}
/* le dessin : les animaux vus de dessus (regard vers le haut, tournés au besoin), dessinés à partir de formes puis cernés de noir */
function buShape(fill, N = 28) {  // fill(x, y) -> une couleur ou rien, sur N × N ; le contour noir est ajouté autour
  return cnv(N, N, b => {
    const cell = (x, y) => x >= 0 && y >= 0 && x < N && y < N ? fill(x, y) : null;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = cell(x, y); if (c) px(b, c, x, y); else if (cell(x + 1, y) || cell(x - 1, y) || cell(x, y + 1) || cell(x, y - 1)) px(b, '#14100c', x, y); }
  });
}
const buIn = (x, y, cx, cy, rx, ry) => ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1;
const buCloth = (x, y, x0, y0, x1, y1, c1, c2) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && !((x === x0 || x === x1) && (y === y0 || y === y1)) ? (x === x0 || x === x1 || y === y0 || y === y1 ? '#e8b84a' : (x + y) % 4 === 0 ? c2 : c1) : null;  // une couverture à liseré d'or, coins arrondis
const BU_SPR = {
  E: buShape((x, y) => {  // l'éléphant vu de dessus, trompe vers le haut : grandes oreilles, défenses, couverture bleue
    if (x >= 13 && x <= 14 && y >= 1 && y <= 7) return y % 2 ? '#a8a8b8' : '#8a8a9a';  // la trompe annelée
    if ((x === 10 || x === 17) && y >= 4 && y <= 7) return y === 4 ? '#ffffff' : '#f0e8d0';  // les défenses
    if (buIn(x, y, 14, 10, 5.5, 4.5)) return buIn(x, y, 12, 9, 2.5, 2) ? '#c8c8d8' : '#a8a8b8';  // la tête
    if (buIn(x, y, 5.5, 12, 5, 6.5) || buIn(x, y, 22.5, 12, 5, 6.5)) return buIn(x, y, x < 14 ? 6.5 : 21.5, 12, 3, 4.5) ? '#c8a0a8' : '#7a7a8a';  // les oreilles
    if (buIn(x, y, 14, 19, 8, 7.5)) return buCloth(x, y, 10, 15, 17, 22, '#3a6ac8', '#6a9ae8') || (x < 11 ? '#a8a8b8' : '#8a8a9a');
    if (x >= 13 && x <= 14 && y >= 26) return '#6a6a7a';  // la queue
  }),
  R: buShape((x, y) => {  // le rhinocéros vu de dessus, cornes vers le haut : petites oreilles pointues, couverture rouge
    if (x >= 13 && x <= 14 && y >= 0 && y <= 4) return y < 2 ? '#fffaf0' : '#e8dcc0';  // la grande corne
    if (x >= 13 && x <= 14 && y >= 6 && y <= 7) return '#e8dcc0';  // la petite corne
    if ((x === 9 || x === 18) && y >= 6 && y <= 8) return '#6a5444';  // les oreilles
    if (buIn(x, y, 14, 9.5, 4.5, 5.5)) return buIn(x, y, 12.5, 9, 2, 2.5) ? '#b8a088' : '#9a8470';  // la tête
    if (buIn(x, y, 14, 18.5, 8.5, 8)) return buCloth(x, y, 10, 14, 17, 22, '#c83a2a', '#e86a5a') || (x < 11 ? '#a89078' : '#8a7460');
    if ((x === 6 || x === 21) && (y === 13 || y === 23)) return '#6a5444';  // les pattes qui dépassent
    if (x >= 13 && x <= 14 && y >= 26) return '#5a4a3a';
  }),
  O: buShape((x, y) => {  // un rocher : bosses, reflets, un peu de mousse
    if (!(buIn(x, y, 14, 15, 11, 9.5) || buIn(x, y, 10, 10, 7, 6) || buIn(x, y, 18, 11, 6, 6))) return;
    if ((x * 7 + y * 3) % 23 === 0 && y > 17) return '#5a7a3a';
    return buIn(x, y, 10, 10, 3.5, 2.5) ? '#c8c0b0' : x + y < 23 ? '#9a9288' : (x * 3 + y) % 7 === 0 ? '#5a5248' : '#7a7268';
  }),
};
const BU_BG = cnv(BU.W, BU.H, b => {  // la jungle tramée, le cadre de pierre, les dalles du plateau
  const r = seeded(5);
  px(b, '#10200e', 0, 0, BU.W, BU.H);
  for (let i = 0; i < 900; i++) { const x = Math.floor(r() * BU.W), y = Math.floor(r() * BU.H); px(b, ['#1a3216', '#22401c', '#14280f'][i % 3], x, y, 2 + (i % 2), 1 + (i % 3 === 0)); }
  const {X0, Y0, TS} = BU, S = TS * 5;
  px(b, '#14100c', X0 - 8, Y0 - 8, S + 16, S + 16); px(b, '#6a6458', X0 - 7, Y0 - 7, S + 14, S + 14); px(b, '#8a8478', X0 - 7, Y0 - 7, S + 14, 2); px(b, '#4a4438', X0 - 7, Y0 + S + 5, S + 14, 2);
  for (let k = 0; k < S + 14; k += 12) { px(b, '#5a5448', X0 - 7 + k, Y0 - 5, 1, 4); px(b, '#5a5448', X0 - 7 + k, Y0 + S + 1, 1, 4); px(b, '#5a5448', X0 - 5, Y0 - 7 + k, 4, 1); px(b, '#5a5448', X0 + S + 1, Y0 - 7 + k, 4, 1); }
  for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 5; c++) {
    const x = X0 + c * TS, y = Y0 + rr * TS, base = (rr + c) % 2 ? '#c8a878' : '#d8b888';
    px(b, base, x, y, TS, TS); px(b, '#a88858', x, y + TS - 1, TS, 1); px(b, '#a88858', x + TS - 1, y, 1, TS); px(b, '#e8cca0', x, y, TS - 1, 1);
    for (let k = 0; k < 5; k++) px(b, '#b89868', x + 2 + Math.floor(r() * 27), y + 2 + Math.floor(r() * 27), 2, 1);
  }
});
const buCell = i => [BU.X0 + (i % 5) * BU.TS, BU.Y0 + Math.floor(i / 5) * BU.TS];
function buPiece(g, p, x, y, alpha = 1) {  // une pièce centrée dans sa case de 32, tournée vers p.d (quarts de tour : les pixels restent nets)
  g.globalAlpha = alpha; g.save(); g.translate(x + 16, y + 16); if (p.t !== 'O') g.rotate(p.d * Math.PI / 2); g.drawImage(BU_SPR[p.t], -14, -14); g.restore(); g.globalAlpha = 1;
}
function buArrow(g, x, y, d, col, s = 3) {  // une petite flèche pixel (pointe et tige), vers d, centrée en x, y
  const rot = ([a, b]) => [[a, b], [-b, a], [-a, -b], [b, -a]][d];
  for (let k = 0; k <= s; k++) for (let w = -k; w <= k; w++) { const [a, b] = rot([w, -s + k]); px(g, col, x + a, y + b, 1, 1); }
  for (let k = 1; k <= s; k++) { const [a, b] = rot([0, k]); px(g, col, x + a, y + b, 1, 1); }
}
/* l'état de l'écran : menu (choix du mode), partie, fin ; les zones cliquables de chaque image servent aussi au clavier */
function buNew(vs = bus.vs ?? 'ia') {
  bu = renew(bu, {g: bu?.g, mode: 'menu', vs, s: buStart(), sel: null, pend: null, hits: [], focus: -1, tick: 0, think: 0, msg: '', flash: null});
}
function buHumanTurn() { return bu.mode === 'play' && !bu.s.win && (bu.vs === 'duo' || bu.s.turn === bus.side); }
function buPlay(m) {
  bu.s = buApply(bu.s, m); bu.sel = bu.pend = null; bu.flash = {m, t: bu.tick, fell: bu.s.fell};
  buBeep(m.k === 'push' || m.k === 'pushin' ? 140 : m.k === 'exit' ? 330 : 520, m.k === 'push' || m.k === 'pushin' ? .16 : .06, m.k === 'push' || m.k === 'pushin' ? 'sawtooth' : 'square', m.k === 'push' || m.k === 'pushin' ? 90 : 0);
  if (bu.s.win) {
    bu.mode = 'over'; bu.overAt = bu.tick;
    if (bu.vs === 'duo') bus.duels++; else if (bu.s.win === bus.side) bus.wins[bus.level]++; else bus.losses[bus.level]++;
    saveGames(); buInfo(); buBeep(bu.vs === 'duo' || bu.s.win === bus.side ? 660 : 200, .4, 'triangle', bu.vs === 'duo' || bu.s.win === bus.side ? 990 : 120);
  } else if (bu.vs === 'ia' && bu.s.turn !== bus.side) bu.think = bu.tick + 25;
}
// les cibles possibles pour la pièce choisie : {x, y, kind, m} (m : le coup joué tout de suite) ou {pend} (il reste à choisir le regard)
function buTargets() {
  const s = bu.s, sel = bu.sel, out = []; if (!sel) return out;
  for (const m of buMoves(s)) {
    if (sel.res ? !(m.k === 'enter' || m.k === 'pushin') : m.from !== sel.i) continue;
    if (m.k === 'move' || m.k === 'enter' || m.k === 'rot') { const at = m.k === 'rot' ? m.from : m.to; if (!out.some(o => o.at === at && o.kind === m.k)) out.push({kind: m.k, at, pend: {k: m.k, from: m.from, to: m.to, at}}); continue; }
    if (m.k === 'push') { const [x, y] = buCell(buStep(m.from, m.d)); out.push({kind: 'push', x: x + 16, y: y + 16, d: m.d, m}); continue; }
    const at = m.k === 'pushin' ? m.to : m.from, od = m.k === 'pushin' ? (m.d + 2) % 4 : null;
    for (const o of m.k === 'pushin' ? [od] : buOut(at)) { const [x, y] = buCell(at); out.push({kind: m.k, x: x + 16 + BU_D[o][1] * 22, y: y + 16 + BU_D[o][0] * 22, d: m.k === 'pushin' ? m.d : o, m}); if (m.k === 'exit') break; }
  }
  return out;
}
function buClick(h) {
  if (!h) return;
  buBeep(700, .03);
  h.act();
}
function buDraw() {
  const g = bu.g, s = bu.s, hits = bu.hits = []; if (!g) return;
  const hit = (x, y, w, h, act, label) => hits.push({x, y, w, h, act, label});
  g.drawImage(BU_BG, 0, 0);
  // les réserves : à gauche les éléphants, à droite les rhinocéros
  for (const [team, x0] of [['E', 8], ['R', BU.W - 56]]) {
    const mine = buHumanTurn() && s.turn === team, on = bu.sel?.res && s.turn === team;
    px(g, '#14100c', x0 - 1, BU.Y0 - 9, 50, 178); px(g, on ? '#5a4a28' : '#2a2418', x0, BU.Y0 - 8, 48, 176);
    pxFont(g, team === 'E' ? 'ÉLÉPHANTS' : 'RHINOS', x0 + 24, BU.Y0 - 1, s.turn === team && bu.mode === 'play' ? '#ffd84a' : '#a89878', 6, 'center');
    for (let k = 0; k < s.res[team]; k++) buPiece(g, {t: team, d: team === 'E' ? 2 : 0}, x0 + 8, BU.Y0 + 4 + k * 31);
    if (mine && s.res[team]) hit(x0, BU.Y0 - 8, 48, 176, () => { bu.sel = bu.sel?.res ? null : {res: team}; bu.pend = null; }, 'réserve des ' + BU_TEAM[team].toLowerCase());
  }
  // le dernier coup (cases entourées en pointillé), les pièces, la sélection
  if (bu.flash?.m && bu.mode !== 'menu') { const m = bu.flash.m; for (const i of [m.from, m.to].filter(i => i != null && i >= 0)) { const [x, y] = buCell(i); for (let k = 0; k < 32; k += 3) { px(g, '#fff0c0', x + k, y, 1, 1); px(g, '#fff0c0', x + k, y + 31, 1, 1); px(g, '#fff0c0', x, y + k, 1, 1); px(g, '#fff0c0', x + 31, y + k, 1, 1); } } }
  for (let i = 0; i < 25; i++) { const p = s.b[i]; if (!p) continue; const [x, y] = buCell(i); buPiece(g, p, x, y, bu.pend?.from === i && bu.pend.k !== 'rot' ? .35 : 1);
    if (buHumanTurn() && p.t === s.turn) hit(x, y, 32, 32, () => { bu.sel = bu.sel?.i === i ? null : {i}; bu.pend = null; }, BU_TEAM[p.t].toLowerCase().slice(0, -1) + ' en ' + 'ABCDE'[i % 5] + (Math.floor(i / 5) + 1)); }
  if (bu.sel?.i != null) { const [x, y] = buCell(bu.sel.i); for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { px(g, '#ffd84a', x + a * 26, y + b * 31, 6, 1); px(g, '#ffd84a', x + a * 31, y + b * 26, 1, 6); } }  // quatre coins dorés
  // les cibles : vert = aller là (puis choisir le regard), orange = pousser, rouge = sortir
  if (buHumanTurn() && !bu.pend) for (const t of buTargets()) {
    if (t.pend) { const [x, y] = buCell(t.at); if (t.kind === 'rot') { buArrow(g, x + 16, y + 3, 0, '#7ee07a', 2); } else { px(g, '#14100c', x + 12, y + 12, 8, 8); px(g, '#7ee07a', x + 13, y + 13, 6, 6); }
      hit(x, y, 32, 32, () => { bu.pend = t.pend; }, (t.kind === 'rot' ? 'tourner sur place' : t.kind === 'enter' ? 'entrer en ' : 'aller en ') + (t.kind === 'rot' ? '' : 'ABCDE'[t.at % 5] + (Math.floor(t.at / 5) + 1))); continue; }
    const col = t.kind === 'exit' ? '#ff6a5a' : '#ffa030';
    px(g, '#14100c', t.x - 6, t.y - 6, 13, 13); px(g, t.kind === 'exit' ? '#5a1a14' : '#5a3a10', t.x - 5, t.y - 5, 11, 11); buArrow(g, t.x, t.y, t.d, col, 3);
    hit(t.x - 7, t.y - 7, 15, 15, () => buPlay(t.m), t.kind === 'exit' ? 'sortir du plateau' : 'pousser');
  }
  // le choix du regard : quatre flèches autour de la case, la pièce fantôme tourne vers la flèche survolée
  if (bu.pend) {
    const [x, y] = buCell(bu.pend.at), cur = bu.pend.k === 'rot' ? s.b[bu.pend.at].d : -1;
    const hd = bu.hoverD ?? (cur >= 0 ? (cur + 1) % 4 : 0);
    if (bu.pend.k !== 'rot') buPiece(g, {t: s.turn, d: hd}, x, y, .6);
    for (let d = 0; d < 4; d++) { if (d === cur) continue; const ax = x + 16 + BU_D[d][1] * 21, ay = y + 16 + BU_D[d][0] * 21; px(g, '#14100c', ax - 5, ay - 5, 11, 11); px(g, d === hd ? '#ffd84a' : '#3a5a2a', ax - 4, ay - 4, 9, 9); buArrow(g, ax, ay, d, d === hd ? '#14100c' : '#b8f0a0', 3);
      hit(ax - 6, ay - 6, 13, 13, () => buPlay(bu.pend.k === 'rot' ? {k: 'rot', from: bu.pend.at, d} : bu.pend.k === 'move' ? {k: 'move', from: bu.pend.from, to: bu.pend.at, d} : {k: 'enter', to: bu.pend.at, d}), 'regarder ' + ['en haut', 'à droite', 'en bas', 'à gauche'][d]); hits.at(-1).d = d; }
  }
  // la chute d'une pièce : elle s'éloigne et pâlit
  const fl = bu.flash; if (fl?.fell && bu.tick - fl.t < 30) { const [x, y] = buCell(fl.fell.at), k = (bu.tick - fl.t) / 30, d = fl.m.d; buPiece(g, fl.fell.p, x + BU_D[d][1] * 32 * (.6 + k), y + BU_D[d][0] * 32 * (.6 + k), 1 - k); }
  // le bandeau : à qui le tour
  px(g, '#14100c', 0, 0, BU.W, 22); px(g, '#2a2418', 0, 0, BU.W, 21);
  const who = s.turn, txt = bu.mode !== 'play' ? 'BOUSCULADE' : bu.vs === 'ia' && who !== bus.side ? "L'ordinateur réfléchit…" : (bu.vs === 'ia' ? 'À toi' : 'Au tour des ' + BU_TEAM[who].toLowerCase()) + ' : ' + (bu.pend ? 'choisis où il regarde' : bu.sel ? 'choisis une case' : 'choisis un animal');
  pxFont(g, txt, BU.W / 2, 14, bu.mode === 'play' ? (who === 'E' ? '#9ac0ff' : '#ffb0a0') : '#ffd84a', 7, 'center');
  if (bu.mode === 'play') { hit(BU.W - 54, 3, 50, 15, () => { bu.mode = 'menu'; bu.sel = bu.pend = null; }, 'menu'); px(g, '#14100c', BU.W - 54, 3, 50, 15); px(g, '#4a3e2a', BU.W - 53, 4, 48, 13); pxFont(g, 'MENU', BU.W - 29, 14, '#e8d8b8', 6, 'center'); }
  if (bu.mode === 'menu') buMenu(g, hit);
  if (bu.mode === 'over' && bu.tick - bu.overAt > 30) {
    const win = s.win, me = bu.vs === 'duo' || win === bus.side;
    gameText(g, BU.W, [[bu.vs === 'duo' ? 'LES ' + BU_TEAM[win].toUpperCase() + ' GAGNENT' : me ? 'GAGNÉ !' : 'PERDU…', me ? '#ffd84a' : '#ff8a7a', 12], ['Un rocher est sorti du plateau en ' + s.n + ' coups', '#f0e0c0'], ['Clic ou Entrée : nouvelle partie', '#b8e0a0']], 92);
    hit(0, 22, BU.W, BU.H - 22, () => { bu.mode = 'menu'; }, 'nouvelle partie');
  }
  // le clavier : la zone qui a le focus est entourée
  const f = hits[bu.focus]; if (bu.kb && f) { px(g, '#ffffff', f.x - 1, f.y - 1, f.w + 2, 1); px(g, '#ffffff', f.x - 1, f.y + f.h, f.w + 2, 1); px(g, '#ffffff', f.x - 1, f.y - 1, 1, f.h + 2); px(g, '#ffffff', f.x + f.w, f.y - 1, 1, f.h + 2); }
  if (bu.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Bousculade : ' + (bu.mode === 'menu' ? 'menu' : bu.mode === 'over' ? 'fini, gagnant ' + BU_TEAM[s.win] : 'tour des ' + BU_TEAM[s.turn]) + ', coup ' + s.n + '. ' + (f ? 'Choix : ' + f.label + '.' : ''));
}
function buMenu(g, hit) {
  px(g, '#14100c', 40, 40, 240, 168); px(g, '#2a2418', 41, 41, 238, 166); px(g, '#e8b84a', 41, 41, 238, 1);
  pxFont(g, 'Pousse un rocher hors du plateau !', BU.W / 2, 58, '#f0e0c0', 6, 'center');
  const btn = (x, y, w, label, on, act, desc) => { px(g, '#14100c', x, y, w, 17); px(g, on ? '#e8b84a' : '#4a3e2a', x + 1, y + 1, w - 2, 15); pxFont(g, label, x + w / 2, y + 12, on ? '#14100c' : '#e8d8b8', 7, 'center'); hit(x, y, w, 17, act, desc || label); };
  pxFont(g, 'ADVERSAIRE', BU.W / 2, 76, '#a89878', 6, 'center');
  btn(56, 82, 100, "L'ordinateur", bu.vs === 'ia', () => { bu.vs = bus.vs = 'ia'; saveGames(); });
  btn(164, 82, 100, 'À deux', bu.vs === 'duo', () => { bu.vs = bus.vs = 'duo'; saveGames(); }, 'à deux sur ce PC');
  if (bu.vs === 'ia') {
    pxFont(g, 'NIVEAU', BU.W / 2, 114, '#a89878', 6, 'center');
    BU_LV.forEach((l, k) => btn(56 + k * 72, 120, 64, l, bus.level === k, () => { bus.level = k; saveGames(); }, 'niveau ' + l.toLowerCase()));
    pxFont(g, 'TU JOUES LES', BU.W / 2, 152, '#a89878', 6, 'center');
    btn(56, 158, 100, 'Éléphants', bus.side === 'E', () => { bus.side = 'E'; saveGames(); }, 'éléphants (ils commencent)');
    btn(164, 158, 100, 'Rhinocéros', bus.side === 'R', () => { bus.side = 'R'; saveGames(); });
  } else pxFont(g, 'Les éléphants commencent', BU.W / 2, 132, '#e8d8b8', 6, 'center');
  btn(110, 184, 100, 'JOUER', true, () => { bu.s = buStart(); bu.mode = 'play'; bu.sel = bu.pend = null; bu.flash = null; if (bu.vs === 'ia' && bus.side === 'R') bu.think = bu.tick + 30; buInfo(); }, 'jouer');
}
function buUpdate() {
  if (bu.think && bu.tick >= bu.think && bu.mode === 'play' && !bu.s.win) { bu.think = 0; buPlay(buThink(bu.s, bus.level)); }
}
function buInfo() {
  const w = bus.wins, l = bus.losses;
  $('buStats').replaceChildren(...[['Victoires (facile)', w[0] + ' / ' + (w[0] + l[0])], ['Victoires (normal)', w[1] + ' / ' + (w[1] + l[1])], ['Victoires (difficile)', w[2] + ' / ' + (w[2] + l[2])], ['Parties à deux', bus.duels]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
// le clavier : flèches = passer d'une zone à la plus proche dans ce sens, Entrée ou Espace = choisir, Échap = annuler
document.addEventListener('keydown', e => {
  if (!keyOk(e) || !bu) return; const k = e.key;
  if (k === 'Escape') { if (bu.pend) bu.pend = null; else bu.sel = null; e.preventDefault(); return; }
  const dirs = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0]};
  if (dirs[k]) {
    e.preventDefault(); bu.kb = true; const H = bu.hits, f = H[bu.focus], [dx, dy] = dirs[k];
    if (bu.pend) { const t = H.findIndex(h => h.d === {ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3}[k]); if (t >= 0) { bu.focus = t; bu.hoverD = H[t].d; } return; }
    if (!f) { bu.focus = 0; return; }
    const cx = f.x + f.w / 2, cy = f.y + f.h / 2; let best = -1, bd = 1e9;
    H.forEach((h, i) => { const ex = h.x + h.w / 2 - cx, ey = h.y + h.h / 2 - cy, along = ex * dx + ey * dy, side = Math.abs(ex * dy - ey * dx); if (along > 2 && along + side * 2 < bd) { bd = along + side * 2; best = i; } });
    if (best >= 0) bu.focus = best; return;
  }
  if (k === 'Enter' || k === ' ') { e.preventDefault(); if (!e.repeat) { bu.kb = true; const f = bu.hits[bu.focus] || bu.hits.find(h => h.label === 'jouer'); buClick(f); bu.focus = Math.min(bu.focus, 0); } }
});
{ const cv = $('buCanvas'), at = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * BU.W, (e.clientY - r.top) / r.height * BU.H]; };
  const find = (x, y) => [...(bu?.hits || [])].reverse().find(h => x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h);
  cv.onpointerdown = e => { e.preventDefault(); if (!bu) return; bu.kb = false; const [x, y] = at(e), h = find(x, y); if (h) buClick(h); else { bu.sel = null; bu.pend = null; } };
  cv.onpointermove = e => { if (!bu) return; const [x, y] = at(e), h = find(x, y); bu.hoverD = h?.d ?? bu.hoverD; cv.style.cursor = h ? 'pointer' : ''; };
  cv.oncontextmenu = e => { e.preventDefault(); if (bu) { bu.sel = null; bu.pend = null; } }; }
$('buNew').onclick = () => { bu.mode = 'menu'; bu.sel = bu.pend = null; $('buNew').blur(); };
setTimeout(() => {  // vérification, 2 s après le chargement : les règles de poussée et de victoire, et l'ordinateur qui voit un coup gagnant
  const bad = [], st = () => ({b: Array(25).fill(null), res: {E: 5, R: 5}, turn: 'E', win: null, n: 0});
  if (buMoves(buStart()).length !== 64) bad.push('départ');
  let s = st(); s.b[0] = {t: 'E', d: 1}; s.b[1] = {t: 'R', d: 3}; if (buMoves(s).some(m => m.k === 'push')) bad.push('1 contre 1');
  s.b[1] = {t: 'E', d: 1}; s.b[2] = {t: 'R', d: 3}; if (!buMoves(s).some(m => m.k === 'push' && m.from === 0)) bad.push('2 contre 1');
  s = st(); s.b[11] = {t: 'O'}; s.b[12] = {t: 'O'}; s.b[10] = {t: 'E', d: 1}; if (buMoves(s).some(m => m.k === 'push')) bad.push('2 rochers');
  s = st(); s.b[12] = {t: 'E', d: 1}; s.b[13] = {t: 'R', d: 1}; s.b[14] = {t: 'O'}; if (buApply(s, {k: 'push', from: 12, d: 1}).win !== 'R') bad.push('le plus proche gagne');
  s = st(); s.b[3] = {t: 'E', d: 1}; s.b[4] = {t: 'R', d: 0}; const t = buApply(s, {k: 'push', from: 3, d: 1}); if (t.res.R !== 6 || t.b[4]?.t !== 'E') bad.push('retour en réserve');
  s = st(); s.b[9] = {t: 'E', d: 0}; s.b[4] = {t: 'O'}; s.b[8] = {t: 'O'}; s.b[13] = {t: 'O'}; if (buApply(s, buThink(s, 1, () => .5)).win !== 'E') bad.push('ordinateur');
  console.assert(!bad.length, 'bousculade', bad);
}, 2000);
ctx.onOpen(() => {
  if (!bu || !bu.g) { buNew(); bu.g = $('buCanvas').getContext('2d'); }
  if (bu.mode === 'pause') bu.mode = 'play';  // quitter l'onglet met la boucle en pause
  gameLoop(bu, 'bousculade', buUpdate, buDraw); buInfo();
});
}
