/* =====================================================================
   RESUME PDF GENERATOR. Used by index.html (download) and admin.html (preview).
   Builds a one-page, single-column, text-based (ATS-friendly) PDF from the
   same data as the site. Nothing to edit here unless you want to restyle.
   ===================================================================== */
(function () {
  const PDFMAKE = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
  const VFS     = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
  const SCALES  = [1, 0.96, 0.92, 0.88, 0.84];   // progressively shrink text to try to keep the resume to one page
  const TEXT_W  = 505;                            // A4 width minus margins

  // Inter (same family as the resume template). If it cannot be fetched, Roboto (bundled) is used.
  const FONT_BASE = 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/';
  let fontName = 'Roboto';

  let loading = null;
  const loadScript = src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src));
    document.head.appendChild(s);
  });
  async function loadFonts() {
    const get = async file => {
      const r = await fetch(FONT_BASE + file);
      if (!r.ok) throw new Error('font ' + file);
      const b = new Uint8Array(await r.arrayBuffer());
      let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
      return btoa(s);
    };
    const [reg, bold] = await Promise.all([get('Inter_400Regular.ttf'), get('Inter_700Bold.ttf')]);
    pdfMake.vfs['Inter-Regular.ttf'] = reg;
    pdfMake.vfs['Inter-Bold.ttf'] = bold;
    pdfMake.fonts = {
      Roboto: { normal: 'Roboto-Regular.ttf', bold: 'Roboto-Medium.ttf', italics: 'Roboto-Italic.ttf', bolditalics: 'Roboto-MediumItalic.ttf' },
      Inter:  { normal: 'Inter-Regular.ttf', bold: 'Inter-Bold.ttf', italics: 'Inter-Regular.ttf', bolditalics: 'Inter-Bold.ttf' }
    };
    fontName = 'Inter';
  }
  function ensure() {
    if (!loading) {
      loading = loadScript(PDFMAKE).then(() => loadScript(VFS))
        .then(() => Promise.race([loadFonts().catch(() => {}), new Promise(r => setTimeout(r, 10000))]))
        .catch(e => { loading = null; throw e; });
    }
    return loading;
  }

  const str = v => String(v == null ? '' : v).trim();
  const bare = u => str(u).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
  const SEP = '  |  ';

  const safeUrl = u => {
    u = str(u); if (!u) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u;
    try { const parsed = new URL(u); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''; } catch (e) { return ''; }
  };
  // source link + preview lines ("Label | URL") -> [{ label, url }]
  function projectLinks(p) {
    const out = [];
    const src = safeUrl(p.source);
    if (src) out.push({ label: 'Link to Source Code', url: src, source: true });
    (p.previews || []).forEach(line => {
      line = str(line); const i = line.indexOf('|');
      const url = safeUrl(i > -1 ? line.slice(i + 1) : line);
      if (!url) return;
      out.push({ label: (i > -1 ? line.slice(0, i).trim() : '') || 'Preview', url });
    });
    return out;
  }

  function docDef(D, s) {
    const cv = D.cv || {};
    const fs = n => Math.round(n * s * 100) / 100;
    const name = (str(D.firstName) + ' ' + str(D.lastName)).toUpperCase();

    const head = t => ({
      stack: [
        { text: t, bold: true, fontSize: fs(9.5), margin: [0, fs(6), 0, fs(2)] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: TEXT_W, y2: 0, lineWidth: 0.6, lineColor: '#000000' }], margin: [0, 0, 0, fs(3)] }
      ],
      unbreakable: true
    });
    const bullets = arr => ({ ul: arr.map(str).filter(Boolean), fontSize: fs(9), margin: [8, 0, 0, fs(2)] });

    // header
    const contact = [];
    const add = (node) => { if (contact.length) contact.push({ text: SEP }); contact.push(node); };
    if (str(cv.phone))    add({ text: str(cv.phone) });
    if (str(D.email))     add({ text: str(D.email), link: 'mailto:' + str(D.email), color: '#373737' });
    if (str(cv.location)) add({ text: str(cv.location) });
    const linkedin = safeUrl(D.linkedin), github = safeUrl(D.github);
    if (linkedin) add({ text: bare(linkedin), link: linkedin, color: '#373737' });
    if (github)   add({ text: bare(github), link: github, color: '#373737' });

    const content = [
      { text: name, bold: true, fontSize: fs(21), alignment: 'center', margin: [0, 0, 0, 1], color: '#000000' },
      str(cv.title) ? { text: str(cv.title).toUpperCase(), bold: true, fontSize: fs(10), alignment: 'center', color: '#414141', margin: [0, 0, 0, 2] } : null,
      { text: contact, fontSize: fs(8), alignment: 'center', color: '#373737', margin: [0, 0, 0, fs(2)] }
    ].filter(Boolean);

    // summary
    if (str(cv.summary)) {
      content.push(head('PROFESSIONAL SUMMARY'), { text: str(cv.summary), alignment: 'left' });
    }

    // education
    const edu = (D.education || []).filter(e => str(e.title) || str(e.place));
    if (edu.length) {
      content.push(head('EDUCATION'));
      edu.forEach(e => {
        const line2 = str(e.detail) || [str(e.when), str(e.note)].filter(Boolean).join(SEP);
        content.push({
          stack: [
            { text: [{ text: str(e.title), bold: true }, str(e.place) ? { text: SEP + str(e.place) } : ''] },
            line2 ? { text: line2, color: '#333333' } : null
          ].filter(Boolean),
          margin: [0, 0, 0, fs(3)]
        });
      });
    }

    // skills
    const skills = (D.skills || []).filter(k => str(k.name) || str(k.items));
    if (skills.length) {
      content.push(head('TECHNICAL SKILLS'));
      skills.forEach(k => content.push({ text: [{ text: str(k.name) + ': ', bold: true }, str(k.items)], margin: [0, 0, 0, 1] }));
    }

    // projects
    const projects = (D.projects || []).filter(p => p.onResume !== false && str(p.title));
    if (projects.length) {
      content.push(head('PROJECTS'));
      projects.forEach(p => {
        const stack = str(p.stack).split(/\s*[·•|]\s*/).filter(Boolean).join(', ');
        const block = [
          { text: [{ text: str(p.title), bold: true }, str(p.tag) ? { text: SEP + str(p.tag), color: '#444444' } : ''] },
          str(p.desc) ? { text: str(p.desc) } : null
        ];
        if (cv.showBullets && (p.points || []).length) block.push(bullets(p.points));
        if (stack) block.push({ text: [{ text: 'Technologies: ', bold: true }, stack] });
        const links = cv.showLinks === false ? [] : projectLinks(p);
        if (links.length) {
          const parts = [];
          links.forEach((l, i) => {
            if (i) parts.push({ text: SEP });
            if (l.source) {
              // Keep the actual URL embedded in the clickable label instead of
              // exposing a shortened domain in the printed resume.
              parts.push({ text: l.label, link: l.url, color: '#1A5FB4', decoration: 'underline' });
            } else {
              // Preserve the existing visible format for demo/preview links.
              parts.push({ text: l.label + ': ', bold: true }, { text: bare(l.url), link: l.url });
            }
          });
          block.push({ text: parts });
        }
        content.push({ stack: block.filter(Boolean), margin: [0, 0, 0, fs(3.5)] });
      });
    }

    // experience
    const exp = (D.experience || []).filter(x => str(x.role) || str(x.org));
    if (exp.length) {
      content.push(head('EXPERIENCE & LEADERSHIP'));
      exp.forEach(x => {
        const parts = [str(x.org), str(x.when)].filter(Boolean);
        const block = [{ text: [{ text: str(x.role), bold: true }, parts.length ? { text: SEP + parts.join(SEP) } : ''] }];
        if ((x.points || []).length) block.push(bullets(x.points));
        content.push({ stack: block, margin: [0, 0, 0, fs(3)] });
      });
    }

    // certifications and achievements
    const certs = (D.certs || []).filter(c => str(c.title));
    const ach = (cv.achievements || []).map(str).filter(Boolean);
    if (certs.length || ach.length) {
      content.push(head('CERTIFICATIONS & ACHIEVEMENTS'));
      certs.forEach(c => {
        const rest = [str(c.place), str(c.when)].filter(Boolean);
        content.push({ text: [{ text: str(c.title), bold: true }, rest.length ? { text: SEP + rest.join(SEP) } : ''], margin: [0, 0, 0, 1] });
      });
      if (ach.length) content.push(bullets(ach));
    }

    return {
      pageSize: 'A4',
      pageMargins: [45, 35, 45, 35],
      info: { title: name + ' - Resume', author: str(D.firstName) + ' ' + str(D.lastName) },
      defaultStyle: { font: fontName, fontSize: fs(9), lineHeight: 1.18, color: '#222222' },
      content
    };
  }

  function render(D, s) {
    return new Promise((resolve, reject) => {
      let overflow = false;
      const dd = docDef(D, s);
      dd.pageBreakBefore = node => { if (node.startPosition && node.startPosition.pageNumber > 1) overflow = true; return false; };
      try { window.pdfMake.createPdf(dd).getBlob(blob => resolve({ blob, overflow })); }
      catch (e) { reject(e); }
    });
  }

  async function generate(D) {
    await ensure();
    let last = null;
    for (const s of SCALES) {
      last = await render(D, s);
      if (!last.overflow) return last.blob;
    }
    return last.blob;   // still too long at the smallest size: allow a second page
  }

  function fileName(D) {
    return (str(D.firstName) + '_' + str(D.lastName) + '_Resume.pdf').replace(/\s+/g, '_');
  }

  window.Resume = {
    prefetch() { ensure().catch(() => {}); },
    async download(D) {
      const blob = await generate(D);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fileName(D);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    },
    async preview(D, win) {
      const blob = await generate(D);
      const url = URL.createObjectURL(blob);
      if (win && !win.closed) win.location = url; else window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 120000);
    }
  };
})();
