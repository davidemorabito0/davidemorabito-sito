# D&F — Deadline & Farts

Gioco pixel-art isometrico in **un unico file HTML** (Canvas + WebAudio, zero dipendenze).
Vesti i panni di un montatore video che deve chiudere la **deadline** senza esplodere per il
**gas** e senza restare a secco di **energia**: monta le clip al PC, ordina cibo alla porta,
sfoga il gas nella *Fart Zone*, e sopravvivi giorno dopo giorno. Tra una giornata e l'altra,
il minigioco in **bici** attraverso Milano.

▶ **Gioca:** apri `index.html` in un browser, oppure vai alla pagina pubblicata (GitHub Pages).

---

## Comandi

**Schermata titolo (stile CRT)** — all'avvio compare l'artwork originale del titolo (incorporato nel file) con il logo, il faccione pixel del protagonista e **PRESS START** lampeggiante. Premuto Start, la scritta in basso diventa il menu a **una voce alla volta**: `↑↓` (o croce del pad) per scorrere *Nuova Partita*, *Continua* (se c'è un salvataggio; riprende dall'inizio della giornata in corso, il game over lo cancella), *Guida* e *Opzioni* (musica, effetti, scosse, vignettatura, schermo intero — salvate automaticamente). Conferma con `SPAZIO`/`INVIO`/`A` o un tap; `ESC`/`B` torna indietro. Su touch: tap sulle frecce ▲▼ per scorrere, tap sulla voce per confermare. *Nuova Partita* apre la scheda con **nome e difficoltà** (`‹ ›` o croce sx/dx, anche `LB/RB`).

**Tastiera**
- `WASD` / frecce — muoviti
- `SHIFT` — scatto
- `SPAZIO` — azione (e salto nel minigioco bici)
- `Z` o **rotellina del mouse** — zoom sul personaggio
- `P` — pausa · `E` — battuta al collega

**Touch (mobile)**
- Trascina il dito per muoverti (a fondo corsa = scatto) · tap = azione
- 🔍 — zoom

**Controller Xbox 360 / gamepad**
- Stick sinistro o croce — muovi
- `A` — azione / salto
- `B` — battuta · `X` — invio telematico · `Y` — velocità x1/x2/x4
- `LT/RT` (o stick a fondo) — scatto
- `LB/RB` — zoom −/+ (si parte già zoommati di 1 stop; `Back` o clic stick destro cicla i livelli)
- `Back` o clic dello stick destro — zoom
- `Start` — pausa
- Nel menu iniziale: croce su/giù — scorri le voci · `A` — conferma · `B` — indietro · difficoltà nella schermata *Nuova Partita* (croce sx/dx o `LB`/`RB`)

---

## Tecnologia

- HTML5 `<canvas>` con rendering isometrico, super-sampling per bordi netti
- Audio procedurale via Web Audio API (nessun file audio esterno richiesto)
- Salvataggi locali nel browser: record, difficoltà, opzioni e checkpoint della run (voce *Continua*)
- Musica del menu: se accanto alla pagina metti un file `menu.mp3`, parte in loop nella schermata titolo (opzionale: senza file, silenzio)
- Nessuna build, nessuna dipendenza: è tutto in `index.html`

## Sviluppo locale

Basta aprire il file. Per servirlo in locale con un server statico:

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Pubblicazione su GitHub Pages

Dopo il push (vedi sotto): **Settings → Pages → Branch: `main` / root → Save**.
Il file `.nojekyll` fa sì che GitHub serva i file così come sono.

---

## Crediti

Creato da **Davide Morabito**. Licenza [MIT](LICENSE).
