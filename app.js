const stage = document.querySelector('#stage');
const meterFill = document.querySelector('#meterFill');
const meter = document.querySelector('.meter');
const profilePercent = document.querySelector('#profilePercent');
const profileCode = document.querySelector('#profileCode');
const observedList = document.querySelector('#observedList');
const inferenceTags = document.querySelector('#inferenceTags');

const state = { step: -1, observations: [], inferences: [], answers: [] };

const questions = [
  {
    title: 'Qual è la prima cosa che controlli al mattino?',
    options: [
      ['Messaggi', ['connessione sociale', 'risposta rapida']],
      ['Social network', ['attenzione monetizzabile', 'uso frequente']],
      ['Notizie', ['interesse informativo', 'routine mattutina']],
      ['Agenda di lavoro', ['orientamento produttivo', 'routine strutturata']]
    ],
    reveal: 'Una preferenza quotidiana può indicare orari, interessi e abitudini di utilizzo.'
  },
  {
    title: 'Quando scegli un servizio, cosa conta di più?',
    options: [
      ['Il prezzo', ['sensibilità al prezzo', 'confronto offerte']],
      ['La velocità', ['bassa tolleranza all’attesa', 'acquisto impulsivo']],
      ['La comodità', ['preferenza per automazione', 'fedeltà potenziale']],
      ['La riservatezza', ['sensibilità alla privacy', 'profilo prudente']]
    ],
    reveal: 'Le tue priorità aiutano a prevedere quali messaggi potrebbero convincerti.'
  },
  {
    title: 'Quale contenuto fermerà più facilmente il tuo dito?',
    options: [
      ['Un volto', ['risposta emotiva', 'contenuti personali']],
      ['Un’offerta', ['intenzione commerciale', 'ricerca vantaggio']],
      ['Una polemica', ['coinvolgimento reattivo', 'alta permanenza']],
      ['Una scoperta', ['curiosità elevata', 'contenuti esplorativi']]
    ],
    reveal: 'Anche il tempo trascorso davanti a un contenuto diventa un segnale comportamentale.'
  },
  {
    title: '“Migliora la tua esperienza condividendo la posizione.”',
    options: [
      ['Consenti', ['propensione al consenso', 'posizione disponibile']],
      ['Solo durante l’uso', ['consenso condizionato', 'controllo medio']],
      ['Non ora', ['resistenza iniziale', 'possibile consenso futuro']],
      ['Rifiuta', ['alta resistenza', 'attenzione ai permessi']]
    ],
    reveal: 'In questa opera la posizione non viene richiesta. Anche un rifiuto, però, può essere registrato come comportamento.'
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function setProgress(value) {
  const safe = Math.max(0, Math.min(100, value));
  meterFill.style.width = `${safe}%`;
  profilePercent.textContent = `${safe}%`;
  meter.setAttribute('aria-valuenow', String(safe));
  document.body.classList.toggle('intensity-2', safe >= 50);
  document.body.classList.toggle('intensity-3', safe >= 75);
}

function renderObserved() {
  observedList.innerHTML = state.observations.length
    ? state.observations.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')
    : '<div class="empty-state">Nessun dato visualizzato</div>';
}

function renderInferences() {
  inferenceTags.innerHTML = state.inferences.length
    ? state.inferences.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')
    : '<span class="tag muted-tag">in attesa</span>';
}

function replaceStage(html) {
  stage.style.animation = 'none';
  stage.innerHTML = html;
  void stage.offsetWidth;
  stage.style.animation = '';
  const heading = stage.querySelector('h1, h2');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function getBrowserObservations() {
  const language = navigator.language || 'non disponibile';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'non disponibile';
  const device = window.matchMedia('(max-width: 820px)').matches ? 'mobile / tablet' : 'desktop';
  const screenSize = `${window.screen.width} × ${window.screen.height}`;
  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} core logici` : 'non disponibile';
  const ua = navigator.userAgent;
  let browser = 'browser moderno';
  if (/Edg\//.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome\//.test(ua)) browser = 'Chrome / Chromium';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';
  return [
    ['Lingua', language], ['Fuso orario', timezone], ['Dispositivo', device],
    ['Schermo', screenSize], ['Browser', browser], ['Processore', cores]
  ];
}

function renderIntro(message = '') {
  replaceStage(`
    <p class="eyebrow">ESPERIENZA 01 / PROFILAZIONE</p>
    <h1 id="screenTitle">Quanto vali?</h1>
    <p class="lead">Non hai ancora detto nulla. Eppure, qualcosa di te è già visibile.</p>
    ${message ? `<div class="reveal-card"><strong>SESSIONE AZZERATA</strong><p>${escapeHtml(message)}</p></div>` : ''}
    <div class="actions"><button id="startButton" class="primary-button" type="button">Scopri il tuo profilo</button></div>
    <p class="microcopy">L’esperienza non usa cookie, non invia informazioni e non conserva le risposte.</p>
  `);
  document.querySelector('#startButton').addEventListener('click', beginExperience);
}

function beginExperience() {
  state.step = 0;
  state.answers = [];
  state.inferences = [];
  state.observations = getBrowserObservations();
  profileCode.textContent = `#${Math.floor(10000 + Math.random() * 89999)}`;
  renderObserved();
  renderInferences();
  setProgress(18);
  replaceStage(`
    <p class="eyebrow">PRIMA DI COMINCIARE</p>
    <h2 id="screenTitle" class="question-title">Sappiamo già qualcosa.</h2>
    <p class="lead">Il tuo browser ha appena mostrato lingua, schermo, fuso orario e caratteristiche del dispositivo. Non hai compilato alcun modulo.</p>
    <div class="reveal-card"><strong>OSSERVAZIONE</strong><p>Presi singolarmente sembrano dettagli innocui. Uniti, contribuiscono a rendere riconoscibile un dispositivo.</p></div>
    <div class="actions"><button id="continueButton" class="primary-button" type="button">Continua</button></div>
  `);
  document.querySelector('#continueButton').addEventListener('click', () => renderQuestion(0));
}

function renderQuestion(index) {
  const question = questions[index];
  state.step = index;
  replaceStage(`
    <p class="step-count">DOMANDA ${String(index + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}</p>
    <h2 id="screenTitle" class="question-title">${escapeHtml(question.title)}</h2>
    <p class="lead">Scegli la risposta più vicina a te.</p>
    <div class="choice-grid">
      ${question.options.map((option, optionIndex) => `<button class="choice-button" data-option="${optionIndex}" type="button">${escapeHtml(option[0])}</button>`).join('')}
    </div>
  `);
  stage.querySelectorAll('[data-option]').forEach(button => {
    button.addEventListener('click', () => selectAnswer(index, Number(button.dataset.option)));
  });
}

function selectAnswer(questionIndex, optionIndex) {
  const question = questions[questionIndex];
  const option = question.options[optionIndex];
  state.answers.push(option[0]);
  state.inferences.push(...option[1]);
  renderInferences();
  setProgress(18 + Math.round(((questionIndex + 1) / questions.length) * 70));
  const isLast = questionIndex === questions.length - 1;
  replaceStage(`
    <p class="eyebrow">SEGNALE ACQUISITO</p>
    <h2 id="screenTitle" class="question-title">“${escapeHtml(option[0])}”</h2>
    <p class="lead">La risposta è diventata una categoria. La categoria è diventata una previsione.</p>
    <div class="reveal-card"><strong>COSA RIVELA</strong><p>${escapeHtml(question.reveal)}</p></div>
    <div class="actions"><button id="nextButton" class="primary-button" type="button">${isLast ? 'Genera il profilo' : 'Prossima domanda'}</button></div>
  `);
  document.querySelector('#nextButton').addEventListener('click', () => isLast ? renderFinal() : renderQuestion(questionIndex + 1));
}

function renderFinal() {
  setProgress(100);
  const value = (0.18 + state.inferences.length * 0.031).toFixed(2).replace('.', ',');
  state.inferences = [...new Set(state.inferences)].slice(0, 5);
  renderInferences();
  replaceStage(`
    <p class="eyebrow">PROFILO COMPLETATO</p>
    <h2 id="screenTitle" class="question-title">Sei diventato un pubblico.</h2>
    <p class="lead">Non una persona intera, ma un insieme di categorie abbastanza preciso da scegliere cosa mostrarti e come convincerti.</p>
    <div class="final-value"><strong>€ ${value}</strong><span>valore simbolico della sessione</span></div>
    <p class="microcopy">Questa cifra è narrativa e non rappresenta una valutazione economica reale dei tuoi dati.</p>
    <blockquote class="quote">“Hai usato il servizio per pochi minuti. Il servizio ha usato te per tutto il tempo.”</blockquote>
    <div class="actions">
      <button id="deleteButton" class="primary-button" type="button">Cancella il mio profilo</button>
      <button id="restartButton" class="secondary-button" type="button">Ripeti l’esperienza</button>
    </div>
  `);
  document.querySelector('#deleteButton').addEventListener('click', deleteProfile);
  document.querySelector('#restartButton').addEventListener('click', resetExperience);
}

function clearState() {
  state.step = -1;
  state.observations = [];
  state.inferences = [];
  state.answers = [];
  profileCode.textContent = '#—';
  setProgress(0);
  renderObserved();
  renderInferences();
  document.body.classList.remove('intensity-2', 'intensity-3');
}

function deleteProfile() {
  clearState();
  replaceStage(`
    <div class="deleted-screen">
      <div class="deleted-icon" aria-hidden="true">✓</div>
      <p class="eyebrow">MEMORIA DELLA SESSIONE</p>
      <h2 id="screenTitle" class="question-title">Profilo eliminato.</h2>
      <p class="lead">Le informazioni esistevano soltanto nella memoria temporanea di questa pagina. Non sono mai state inviate o archiviate.</p>
      <div class="actions"><button id="homeButton" class="secondary-button" type="button">Torna all’inizio</button></div>
    </div>
  `);
  document.querySelector('#homeButton').addEventListener('click', () => renderIntro('Nessuna traccia della sessione precedente è rimasta nella pagina.'));
}

function resetExperience() { clearState(); renderIntro(); }

function completeProfileFromAnswers(answerIndexes) {
  if (!Array.isArray(answerIndexes) || answerIndexes.length !== questions.length ||
      answerIndexes.some(index => !Number.isInteger(index) || index < 0 || index > 3)) {
    throw new Error('Servono quattro risposte, ciascuna con un indice da 0 a 3.');
  }
  state.observations = getBrowserObservations();
  state.answers = [];
  state.inferences = [];
  answerIndexes.forEach((optionIndex, questionIndex) => {
    const option = questions[questionIndex].options[optionIndex];
    state.answers.push(option[0]);
    state.inferences.push(...option[1]);
  });
  profileCode.textContent = `#${Math.floor(10000 + Math.random() * 89999)}`;
  renderObserved();
  renderFinal();
  return { completed: true, profile: profileCode.textContent, answers: [...state.answers] };
}

function registerModelTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const register = tool => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
  register({
    name: 'generate_simulated_profile',
    title: 'Genera profilo simulato',
    description: 'Completa l’esperienza Quanto vali? scegliendo una risposta per ognuna delle quattro domande e mostra il profilo finale.',
    inputSchema: {
      type: 'object',
      properties: {
        answerIndexes: {
          type: 'array', minItems: 4, maxItems: 4,
          items: { type: 'integer', minimum: 0, maximum: 3 },
          description: 'Quattro indici di risposta da 0 a 3, nell’ordine delle domande.'
        }
      },
      required: ['answerIndexes'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) { return completeProfileFromAnswers(input?.answerIndexes); }
  });
  register({
    name: 'delete_simulated_profile',
    title: 'Cancella profilo simulato',
    description: 'Cancella dalla memoria temporanea della pagina il profilo simulato e mostra la conferma.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute() { deleteProfile(); return { deleted: true }; }
  });
}

document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault();
  resetExperience();
});

renderIntro();
registerModelTools();
