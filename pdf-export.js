/*
 * pdf-export.js — Export PDF professionale per gli strumenti di davidemorabito.com
 * Uso: exportCalcPdf({ tool, subtitle, highlight:{label,value,note}, sections:[{title,rows:[[label,value],...]}], note, filename })
 * Richiede jsPDF (UMD) caricato prima di questo file.
 */
(function () {
  'use strict';

  window.exportCalcPdf = function (opts) {
    opts = opts || {};
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Il generatore PDF non è riuscito a caricarsi. Controlla la connessione e riprova.');
      return;
    }
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210, H = 297, m = 18, usable = W - 2 * m;

    // Palette brand (versione chiara/professionale)
    var navy = [26, 47, 69];
    var navySoft = [43, 72, 104];
    var amber = [255, 173, 1];
    var ink = [32, 42, 54];
    var gray = [112, 122, 133];
    var lightRow = [245, 247, 249];
    var boxBg = [247, 249, 251];

    function F(a) { doc.setFillColor(a[0], a[1], a[2]); }
    function T(a) { doc.setTextColor(a[0], a[1], a[2]); }
    function D(a) { doc.setDrawColor(a[0], a[1], a[2]); }
    function sw(t, size) { return doc.getStringUnitWidth(t) * size * 25.4 / 72; }
    function caps(x, y, text, size, color, sp, align) {
      sp = sp == null ? 0.5 : sp; doc.setFontSize(size); T(color);
      var ws = [], tot = 0, i;
      for (i = 0; i < text.length; i++) { var w = sw(text[i], size) + sp; ws.push(w); tot += w; }
      tot -= sp;
      var sx = align === 'right' ? x - tot : (align === 'center' ? x - tot / 2 : x), cx = sx;
      for (i = 0; i < text.length; i++) { doc.text(text[i], cx, y); cx += ws[i]; }
    }
    function fmtDate(d) {
      var dd = ('0' + d.getDate()).slice(-2), mo = ('0' + (d.getMonth() + 1)).slice(-2);
      return dd + '/' + mo + '/' + d.getFullYear();
    }
    var today = fmtDate(new Date());

    function footer() {
      var fy = H - 16;
      D(amber); doc.setLineWidth(0.5); doc.line(m, fy, W - m, fy);
      doc.setFont('helvetica', 'bold');
      caps(W / 2, fy + 6, 'GENERATO SU DAVIDEMORABITO.COM', 8.5, navy, 0.8, 'center');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); T(gray);
      doc.text('Strumenti gratuiti per creativi e freelance  ·  ' + today, W / 2, fy + 10.5, { align: 'center' });
    }

    // ===== HEADER (banda navy + accento amber) =====
    F(navy); doc.rect(0, 0, W, 30, 'F');
    F(amber); doc.rect(0, 30, W, 1.2, 'F');
    // wordmark
    doc.setFont('helvetica', 'normal'); doc.setFontSize(17); T([255, 255, 255]);
    doc.text('davide', m, 15);
    var wd = sw('davide', 17);
    doc.setFont('helvetica', 'bold'); T(amber); doc.text('morabito', m + wd, 15);
    // tagline sotto wordmark
    caps(m, 22.5, 'STRUMENTI PER CREATIVI E FREELANCE', 7, [168, 186, 202], 0.6);
    // data + dominio a destra
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); T([205, 216, 227]);
    doc.text(today, W - m, 13, { align: 'right' });
    caps(W - m, 22.5, 'DAVIDEMORABITO.COM', 7, amber, 0.6, 'right');

    // ===== TITOLO =====
    var y = 46;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(21); T(navy);
    doc.text(opts.tool || 'Riepilogo', m, y);
    y += 6.5;
    if (opts.subtitle) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); T(gray);
      var sub = doc.splitTextToSize(opts.subtitle, usable);
      doc.text(sub, m, y); y += 4.2 * sub.length;
    }
    y += 6;

    // ===== HIGHLIGHT (risultato principale) =====
    if (opts.highlight) {
      var bh = 24;
      F(boxBg); doc.rect(m, y, usable, bh, 'F');
      F(amber); doc.rect(m, y, 2.2, bh, 'F');
      caps(m + 8, y + 9, (opts.highlight.label || '').toUpperCase(), 8, gray, 0.8);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(22); T(navy);
      doc.text(String(opts.highlight.value == null ? '' : opts.highlight.value), m + 8, y + 19);
      if (opts.highlight.note) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); T(gray);
        doc.text(String(opts.highlight.note), W - m - 6, y + 19, { align: 'right' });
      }
      y += bh + 10;
    }

    // ===== SEZIONI =====
    (opts.sections || []).forEach(function (sec) {
      if (y > H - 40) { footer(); doc.addPage(); y = 24; }
      caps(m, y, (sec.title || '').toUpperCase(), 8.5, navySoft, 1.2);
      y += 2.5;
      D(amber); doc.setLineWidth(0.6); doc.line(m, y, m + 16, y);
      y += 6;
      doc.setFontSize(10);
      (sec.rows || []).forEach(function (row, i) {
        var rowH = 9;
        if (y + rowH > H - 24) { footer(); doc.addPage(); y = 24; }
        if (i % 2 === 0) { F(lightRow); doc.rect(m, y - 5.5, usable, rowH, 'F'); }
        doc.setFont('helvetica', 'normal'); T(gray);
        doc.text(String(row[0]), m + 4, y);
        doc.setFont('helvetica', 'bold'); T(ink);
        var val = String(row[1] == null ? '' : row[1]);
        doc.text(val, W - m - 4, y, { align: 'right' });
        y += rowH;
      });
      y += 8;
    });

    // Nota opzionale (es. disclaimer fiscale)
    if (opts.note) {
      if (y > H - 34) { footer(); doc.addPage(); y = 24; }
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8.2); T(gray);
      var nl = doc.splitTextToSize(opts.note, usable);
      doc.text(nl, m, y);
    }

    footer();
    if (opts.returnDataUri) { return doc.output('datauristring'); }
    doc.save(opts.filename || 'riepilogo-davidemorabito.pdf');
  };

  // ===== Export PALETTE (campioni colore) =====
  window.exportPalettePdf = function (opts) {
    opts = opts || {};
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Il generatore PDF non è riuscito a caricarsi. Controlla la connessione e riprova.');
      return;
    }
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210, H = 297, m = 18, usable = W - 2 * m;
    var navy = [26, 47, 69], amber = [255, 173, 1], gray = [112, 122, 133];

    function F(a) { doc.setFillColor(a[0], a[1], a[2]); }
    function T(a) { doc.setTextColor(a[0], a[1], a[2]); }
    function D(a) { doc.setDrawColor(a[0], a[1], a[2]); }
    function sw(t, size) { return doc.getStringUnitWidth(t) * size * 25.4 / 72; }
    function caps(x, y, text, size, color, sp, align) {
      sp = sp == null ? 0.5 : sp; doc.setFontSize(size); T(color);
      var ws = [], tot = 0, i;
      for (i = 0; i < text.length; i++) { var w = sw(text[i], size) + sp; ws.push(w); tot += w; }
      tot -= sp;
      var sx = align === 'right' ? x - tot : (align === 'center' ? x - tot / 2 : x), cx = sx;
      for (i = 0; i < text.length; i++) { doc.text(text[i], cx, y); cx += ws[i]; }
    }
    function fmtDate(d) { var dd = ('0' + d.getDate()).slice(-2), mo = ('0' + (d.getMonth() + 1)).slice(-2); return dd + '/' + mo + '/' + d.getFullYear(); }
    function hexToRgb(hex) { hex = (hex || '').replace('#', ''); if (hex.length === 3) hex = hex.split('').map(function (x) { return x + x; }).join(''); return { r: parseInt(hex.slice(0, 2), 16) || 0, g: parseInt(hex.slice(2, 4), 16) || 0, b: parseInt(hex.slice(4, 6), 16) || 0 }; }
    var today = fmtDate(new Date());

    function header() {
      F(navy); doc.rect(0, 0, W, 30, 'F');
      F(amber); doc.rect(0, 30, W, 1.2, 'F');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(17); T([255, 255, 255]);
      doc.text('davide', m, 15);
      var wd = sw('davide', 17);
      doc.setFont('helvetica', 'bold'); T(amber); doc.text('morabito', m + wd, 15);
      caps(m, 22.5, 'STRUMENTI PER CREATIVI E FREELANCE', 7, [168, 186, 202], 0.6);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); T([205, 216, 227]);
      doc.text(today, W - m, 13, { align: 'right' });
      caps(W - m, 22.5, 'DAVIDEMORABITO.COM', 7, amber, 0.6, 'right');
    }
    function footer() {
      var fy = H - 16;
      D(amber); doc.setLineWidth(0.5); doc.line(m, fy, W - m, fy);
      doc.setFont('helvetica', 'bold');
      caps(W / 2, fy + 6, 'GENERATO SU DAVIDEMORABITO.COM', 8.5, navy, 0.8, 'center');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); T(gray);
      doc.text('Strumenti gratuiti per creativi e freelance  ·  ' + today, W / 2, fy + 10.5, { align: 'center' });
    }

    header();
    var y = 46;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(21); T(navy);
    doc.text(opts.title || 'Palette colori', m, y);
    y += 6.5;
    if (opts.subtitle) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); T(gray);
      doc.text(opts.subtitle, m, y); y += 4;
    }
    y += 8;

    (opts.colors || []).forEach(function (col) {
      var barH = 20, blockH = barH + 11;
      if (y + blockH > H - 24) { footer(); doc.addPage(); y = 24; }
      var rgb = col.rgb || hexToRgb(col.hex);
      F([rgb.r, rgb.g, rgb.b]); doc.rect(m, y, usable, barH, 'F');
      var lum = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
      var tc = lum > 150 ? [20, 20, 20] : [255, 255, 255];
      doc.setFont('helvetica', 'bold'); doc.setFontSize(15); T(tc);
      doc.text((col.hex || '').toUpperCase(), m + 7, y + barH / 2 + 1.6);
      if (col.name) { doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); T(tc); doc.text(String(col.name), W - m - 7, y + barH / 2 + 1.6, { align: 'right' }); }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); T(gray);
      doc.text('RGB  ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b, m + 2, y + barH + 7);
      var hsb = col.hsb || (col.h != null ? ('HSB  ' + col.h + '\u00b0, ' + col.s + '%, ' + col.v + '%') : '');
      if (hsb) doc.text(hsb, W - m - 2, y + barH + 7, { align: 'right' });
      y += blockH + 3;
    });

    if (opts.note) {
      if (y > H - 34) { footer(); doc.addPage(); y = 24; }
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8.2); T(gray);
      var nl = doc.splitTextToSize(opts.note, usable);
      doc.text(nl, m, y);
    }

    footer();
    if (opts.returnDataUri) { return doc.output('datauristring'); }
    doc.save(opts.filename || 'palette-davidemorabito.pdf');
  };
})();
