/**
 * FlySmart Embeddable Widget — public/widget.js
 * Vanilla JS, Shadow DOM, aucune dépendance
 * Usage: <flysmart-widget data-api-key="..." data-accent-color="#E8A330"></flysmart-widget>
 */
(function () {
  'use strict';

  /* ── Dataset compact d'aéroports (inline) ─────────────────────── */
  const AIRPORTS = [
    ['CDG','Paris','Charles de Gaulle'],['ORY','Paris','Orly'],
    ['NCE','Nice','Côte d\'Azur'],['LYS','Lyon','Saint-Exupéry'],
    ['MRS','Marseille','Provence'],['TLS','Toulouse','Blagnac'],
    ['BOD','Bordeaux','Mérignac'],['NTE','Nantes','Atlantique'],
    ['LHR','Londres','Heathrow'],['LGW','Londres','Gatwick'],
    ['STN','Londres','Stansted'],['MAN','Manchester','Manchester'],
    ['BCN','Barcelone','El Prat'],['MAD','Madrid','Barajas'],
    ['PMI','Majorque','Son Sant Joan'],['AGP','Malaga','Costa del Sol'],
    ['FCO','Rome','Fiumicino'],['MXP','Milan','Malpensa'],
    ['VCE','Venise','Marco Polo'],['NAP','Naples','Capodichino'],
    ['FRA','Francfort','Frankfurt am Main'],['MUC','Munich','Franz Josef Strauss'],
    ['BER','Berlin','Brandenburg'],['AMS','Amsterdam','Schiphol'],
    ['BRU','Bruxelles','Brussels Airport'],['GVA','Genève','Cointrin'],
    ['ZRH','Zurich','Kloten'],['LIS','Lisbonne','Humberto Delgado'],
    ['ATH','Athènes','Venizelos'],['IST','Istanbul','Istanbul'],
    ['DXB','Dubaï','Dubai International'],['DOH','Doha','Hamad'],
    ['JFK','New York','John F. Kennedy'],['EWR','New York','Newark'],
    ['LAX','Los Angeles','LAX'],['SFO','San Francisco','SFO'],
    ['ORD','Chicago','O\'Hare'],['MIA','Miami','Miami International'],
    ['ATL','Atlanta','Hartsfield-Jackson'],['NRT','Tokyo','Narita'],
    ['HND','Tokyo','Haneda'],['ICN','Séoul','Incheon'],
    ['BKK','Bangkok','Suvarnabhumi'],['SIN','Singapour','Changi'],
    ['DPS','Bali','Ngurah Rai'],['SYD','Sydney','Kingsford Smith'],
    ['MEL','Melbourne','Melbourne'],['GRU','São Paulo','Guarulhos'],
    ['CMN','Casablanca','Mohamed V'],['RAK','Marrakech','Menara'],
    ['JNB','Johannesburg','O.R. Tambo'],['NBO','Nairobi','Jomo Kenyatta'],
    ['HKG','Hong Kong','Hong Kong Intl'],['PEK','Pékin','Capital'],
    ['PVG','Shanghai','Pudong'],['DEL','New Delhi','Indira Gandhi'],
    ['BOM','Mumbai','Chhatrapati Shivaji'],['YYZ','Toronto','Pearson'],
    ['YUL','Montréal','Trudeau'],['RUN','La Réunion','Roland Garros'],
    ['MRU','Maurice','Sir Seewoosagur'],['PTP','Guadeloupe','Pointe-à-Pitre'],
  ];

  function searchAirports(q) {
    q = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (q.length < 2) return [];
    return AIRPORTS.filter(([iata, city, name]) => {
      const ci = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const na = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      return iata.toLowerCase().startsWith(q) || ci.startsWith(q) || na.includes(q);
    }).slice(0, 6);
  }

  /* ── Styles CSS injectés dans le Shadow DOM ───────────────────── */
  function buildCSS(primary, accent, bg, text) {
    return `
      :host { display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .w { background: ${bg}; color: ${text}; border-radius: 12px; padding: 20px; border: 1px solid ${accent}40; }
      .title { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${accent}; margin-bottom: 14px; }
      .row { display: flex; gap: 8px; margin-bottom: 10px; }
      .field { flex: 1; position: relative; }
      label { display: block; font-size: 10px; color: ${text}99; margin-bottom: 4px; }
      input, select { width: 100%; background: ${primary}; color: ${text}; border: 1px solid ${text}20; border-radius: 8px; padding: 8px 10px; font-size: 13px; outline: none; }
      input:focus, select:focus { border-color: ${accent}; }
      .dropdown { position: absolute; top: 100%; left: 0; right: 0; background: ${primary}; border: 1px solid ${accent}30; border-radius: 8px; z-index: 10; margin-top: 2px; overflow: hidden; }
      .option { padding: 8px 12px; font-size: 12px; cursor: pointer; color: ${text}; }
      .option:hover, .option.active { background: ${accent}20; }
      .iata { font-weight: 700; color: ${accent}; margin-right: 6px; }
      .btn { width: 100%; background: ${accent}; color: ${primary}; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 4px; }
      .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .result { margin-top: 14px; border-radius: 10px; padding: 14px; }
      .result.low  { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); }
      .result.avg  { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); }
      .result.high { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); }
      .score-row { display: flex; align-items: center; gap: 12px; }
      .score-circle { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
      .score-circle.low  { background: #4ADE80; color: #0D1B2A; }
      .score-circle.avg  { background: #F97316; color: #fff; }
      .score-circle.high { background: #EF4444; color: #fff; }
      .rec { font-weight: 600; font-size: 14px; color: ${text}; }
      .savings { font-size: 12px; color: ${text}cc; margin-top: 4px; }
      .savings strong { color: #4ADE80; }
      svg.curve { width: 100%; margin-top: 12px; }
      .err { margin-top: 10px; font-size: 12px; color: #EF4444; text-align: center; }
    `;
  }

  /* ── Rendu de la courbe SVG ───────────────────────────────────── */
  function drawCurve(chart, accent) {
    const W = 260, H = 60;
    const prices = chart.map(p => p.price);
    const min = Math.min(...prices), max = Math.max(...prices);
    const pts = chart.map((p, i) => {
      const x = (i / (chart.length - 1)) * W;
      const y = H - ((p.price - min) / (max - min + 1)) * (H - 8) - 4;
      return `${x},${y}`;
    });
    const optIdx = chart.findIndex(p => p.isOptimal);
    const optPt = optIdx >= 0 ? pts[optIdx].split(',') : null;
    const d = `M${pts.join(' L')}`;
    const fill = `${d} L${W},${H} L0,${H} Z`;
    return `<svg class="curve" viewBox="0 0 ${W} ${H}" fill="none">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${fill}" fill="url(#cg)"/>
      <path d="${d}" stroke="${accent}" stroke-width="1.5" fill="none"/>
      ${optPt ? `<circle cx="${optPt[0]}" cy="${optPt[1]}" r="5" fill="#4ADE80"/>` : ''}
    </svg>`;
  }

  /* ── Custom Element ───────────────────────────────────────────── */
  class FlySmart extends HTMLElement {
    constructor() {
      super();
      this._shadow = this.attachShadow({ mode: 'open' });
      this._origin = '';
      this._dest   = '';
      this._month  = String(new Date().getMonth() + 2).padStart(2, '0');
      this._year   = new Date().getMonth() + 2 > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    }

    connectedCallback() {
      this._render();
      this._bind();
    }

    _cfg() {
      return {
        apiKey:  this.dataset.apiKey  || 'flysmart-trailix-test-key',
        title:   this.dataset.title   || 'Meilleur moment pour acheter',
        primary: this.dataset.primaryColor    || '#0D1B2A',
        accent:  this.dataset.accentColor     || '#E8A330',
        bg:      this.dataset.backgroundColor || '#111B35',
        text:    this.dataset.textColor       || '#F2EDE4',
      };
    }

    _render(result) {
      const c = this._cfg();
      const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
      const opts = months.map((l, i) => {
        const v = String(i + 1).padStart(2,'0');
        return `<option value="${v}" ${v === this._month ? 'selected' : ''}>${l}</option>`;
      }).join('');

      let resultHtml = '';
      if (result && !result.error) {
        const lvl  = result.priceLevel === 'LOW' ? 'low' : result.priceLevel === 'HIGH' ? 'high' : 'avg';
        const curve = result.chart ? drawCurve(result.chart, c.accent) : '';
        resultHtml = `<div class="result ${lvl}">
          <div class="score-row">
            <div class="score-circle ${lvl}">${result.score}</div>
            <div>
              <div class="rec">${result.recommendation}</div>
              <div class="savings">Fenêtre optimale : <strong>${result.bestBookingWindow}</strong></div>
              <div class="savings">Économie : <strong>−${result.potentialSavingsVsLastMinute} ${result.currency}</strong> vs last-minute</div>
            </div>
          </div>
          ${curve}
        </div>`;
      } else if (result && result.error) {
        resultHtml = `<p class="err">${result.error}</p>`;
      }

      this._shadow.innerHTML = `
        <style>${buildCSS(c.primary, c.accent, c.bg, c.text)}</style>
        <div class="w">
          <div class="title">${c.title}</div>
          <div class="row">
            <div class="field">
              <label>Départ</label>
              <input id="or" type="text" placeholder="Paris CDG" autocomplete="off" value="${this._origin}"/>
              <div class="dropdown" id="or-list" style="display:none"></div>
            </div>
            <div class="field">
              <label>Destination</label>
              <input id="de" type="text" placeholder="New York JFK" autocomplete="off" value="${this._dest}"/>
              <div class="dropdown" id="de-list" style="display:none"></div>
            </div>
          </div>
          <div class="row">
            <div class="field" style="max-width:120px">
              <label>Mois</label>
              <select id="mo">${opts}</select>
            </div>
          </div>
          <button class="btn" id="go" ${this._loading ? 'disabled' : ''}>${this._loading ? 'Analyse…' : 'Analyser →'}</button>
          ${resultHtml}
        </div>
      `;
      this._bind();
    }

    _autocomplete(inputId, listId, field) {
      const input = this._shadow.getElementById(inputId);
      const list  = this._shadow.getElementById(listId);
      if (!input || !list) return;

      input.addEventListener('input', () => {
        const q = input.value;
        const results = searchAirports(q);
        if (!results.length) { list.style.display = 'none'; return; }
        list.innerHTML = results.map(([iata, city, name], i) =>
          `<div class="option" data-iata="${iata}" data-idx="${i}">
            <span class="iata">${iata}</span>${city} — ${name}
          </div>`
        ).join('');
        list.style.display = 'block';
        list.querySelectorAll('.option').forEach(opt => {
          opt.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const iata = opt.dataset.iata;
            input.value = iata;
            if (field === 'origin') this._origin = iata;
            else this._dest = iata;
            list.style.display = 'none';
          });
        });
      });
      input.addEventListener('blur', () => setTimeout(() => { list.style.display = 'none'; }, 150));
    }

    _bind() {
      const btn = this._shadow.getElementById('go');
      const mo  = this._shadow.getElementById('mo');
      if (mo) mo.addEventListener('change', () => { this._month = mo.value; });
      if (btn) btn.addEventListener('click', () => this._analyze());
      this._autocomplete('or', 'or-list', 'origin');
      this._autocomplete('de', 'de-list', 'dest');
    }

    async _analyze() {
      const orEl = this._shadow.getElementById('or');
      const deEl = this._shadow.getElementById('de');
      if (!orEl || !deEl) return;
      this._origin = orEl.value.trim().toUpperCase();
      this._dest   = deEl.value.trim().toUpperCase();
      if (!this._origin || !this._dest) return;

      this._loading = true;
      const c = this._cfg();
      this._render({ loading: true });

      const origin = this._shadow.getElementById('go');
      if (origin) origin.disabled = true;

      try {
        const res = await fetch('/api/analyze', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': c.apiKey },
          body:    JSON.stringify({ origin: this._origin, destination: this._dest, month: `${this._year}-${this._month}` }),
        });
        const data = await res.json();
        this._loading = false;
        this._render(res.ok ? data : { error: data.error || 'Erreur serveur' });
      } catch {
        this._loading = false;
        this._render({ error: 'Impossible de contacter le serveur.' });
      }
    }
  }

  if (!customElements.get('flysmart-widget')) {
    customElements.define('flysmart-widget', FlySmart);
  }
})();
