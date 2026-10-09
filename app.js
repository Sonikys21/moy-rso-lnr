// Project MVP: no server, verified regional registry or transmission of applications is connected.
const platformUrl = 'https://лк.трудкрут.рф/';
const directions = [
  { id: 'ped', name: 'Педагогическое', icon: '✳', interest: 'people', description: 'Работа с детьми, программы смен и командная ответственность.', skill: 'Коммуникация и организация группы', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'service', name: 'Сервисное', icon: '↗', interest: 'people', description: 'Гостеприимство, работа с гостями и событиями.', skill: 'Сервис и решение рабочих ситуаций', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'build', name: 'Строительное', icon: '▦', interest: 'tech', description: 'Инфраструктура, работа с объектами и производственные задачи.', skill: 'Работа по инструкции и в бригаде', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'medical', name: 'Медицинское', icon: '+', interest: 'people', description: 'Работа по профилю в пределах квалификации и допуска.', skill: 'Внимание к процедурам и людям', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'production', name: 'Производственное', icon: '⚙', interest: 'tech', description: 'Знакомство с предприятием и технологическими процессами.', skill: 'Точность и соблюдение требований', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'agro', name: 'Сельскохозяйственное', icon: '☼', interest: 'nature', description: 'Сезонные задачи и знакомство с агропроизводством.', skill: 'Самоорганизация и командная работа', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'train', name: 'Отряды проводников', icon: '⇢', interest: 'people', description: 'Работа с пассажирами после необходимой подготовки.', skill: 'Ответственность и клиентский сервис', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' },
  { id: 'teen', name: 'Отряды подростков', icon: '✦', interest: 'first', description: 'Первое знакомство с трудом и доступными возрастными пробами.', skill: 'Первый опыт и профессиональный выбор', link: 'https://трудкрут.рф/deyatelnost/napravleniya_raboty.html' }
];
const municipalities = ['Луганск', 'Алчевск', 'Антрацит', 'Брянка', 'Краснодон', 'Лисичанск', 'Ровеньки', 'Свердловск', 'Северодонецк', 'Стаханов', 'Другой населённый пункт'];
// Only a signed-off and current partner registry may be entered here for publication.
const verifiedPoints = [];
const nav = [
  ['home', 'Главная', '⌂'], ['navigator', 'Навигатор', '◇'], ['catalog', 'Возможности', '▦'],
  ['route', 'Мой маршрут', '⇢'], ['portfolio', 'Мои навыки', '✳'], ['coordinator', 'Куратору', '≡']
];
const main = document.getElementById('main');
const notice = document.getElementById('notice');
const storageKey = 'rso-lnr-mvp-v1';
const defaultState = () => ({ age: '', interest: '', city: '', direction: '', steps: [], draft: null, evidence: [] });
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const base = defaultState();
    return { ...base, ...saved, steps: Array.isArray(saved.steps) ? saved.steps.filter(n => Number.isInteger(n) && n >= 0 && n < 8) : [], evidence: Array.isArray(saved.evidence) ? saved.evidence.slice(0, 20) : [] };
  } catch { return defaultState(); }
}
let state = loadState();
let catalogFilter = 'all';
let caseChoice = '';
let timer;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const linkButton = (label = 'Открыть платформу РСО ↗') => `<a class="button" href="${platformUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const heading = (eyebrow, title, text) => `<header class="page-head"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${text}</p></header>`;
const message = (text, warn = false) => `<div class="message${warn ? ' warn' : ''}">${text}</div>`;
function save() { try { localStorage.setItem(storageKey, JSON.stringify(state)); return true; } catch { alertNotice('Браузер не сохранил данные. Используйте экспорт черновика.'); return false; } }
function alertNotice(text) { notice.textContent = text; notice.hidden = false; clearTimeout(timer); timer = setTimeout(() => { notice.hidden = true; }, 4500); }
function routeName() { const key = location.hash.slice(1) || 'home'; return nav.some(item => item[0] === key) ? key : 'home'; }
function renderNav() {
  for (const id of ['desktop-nav', 'mobile-nav']) {
    document.getElementById(id).innerHTML = nav.map(([key, label, icon]) => `<a class="nav-item" href="#${key}" ${routeName() === key ? 'aria-current="page"' : ''}><span class="icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`).join('');
  }
}
function home() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">ЛУГАНСКОЕ РЕГИОНАЛЬНОЕ ОТДЕЛЕНИЕ РСО</p><h1>Твой путь<br>начинается здесь.</h1><p>Найди направление, попробуй себя в деле, собери опыт и сделай следующий шаг к профессии.</p><a class="button" href="#navigator">Собрать свой маршрут <span aria-hidden="true">↗</span></a></div><div class="hero-art"><img src="Лого реготделения.png" alt=""><span class="hero-marker">ТРУД · КАРЬЕРА · УСПЕХ</span></div></section>
  <div class="section-head"><h2>От интереса — к первому делу</h2><a href="#route">Весь путь ↗</a></div>
  <div class="steps-mini"><div class="step-mini"><span>01 / НАЙТИ</span><strong>Выбери направление</strong><small>По интересу и возрасту</small></div><div class="step-mini"><span>02 / ПОПРОБОВАТЬ</span><strong>Пройди пробу</strong><small>Узнай реальные задачи</small></div><div class="step-mini"><span>03 / ПОРАБОТАТЬ</span><strong>Вступи в отряд</strong><small>Подготовка и трудовой сезон</small></div><div class="step-mini"><span>04 / ПРОДОЛЖИТЬ</span><strong>Сделай карьерный шаг</strong><small>Отзыв, резюме и выбор</small></div></div>
  <div class="section-head"><h2>Что можно сделать сейчас</h2></div><div class="tiles">
    <a class="tile" href="#navigator"><span class="tile-icon">◇</span><h3>Подобрать направление</h3><p>Возраст, интерес и понятный первый шаг ↗</p></a>
    <a class="tile" href="#catalog"><span class="tile-icon">▦</span><h3>Изучить возможности</h3><p>Направления РСО и статус региональных площадок ↗</p></a>
    <a class="tile" href="#portfolio"><span class="tile-icon">✳</span><h3>Описать свой опыт</h3><p>Навыки, доказательства и черновик резюме ↗</p></a>
  </div><div class="info-strip"><div><h2>Реальное участие — на платформе РСО</h2><p>Этот прототип помогает выстроить путь. Действующий личный кабинет открывается отдельно.</p></div>${linkButton('Перейти в личный кабинет ↗')}</div>`;
}
function directionCards(items, withChoice = false) {
  return `<div class="direction-list">${items.map(d => `<article class="direction-card"><span class="symbol" aria-hidden="true">${d.icon}</span><h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.description)}</p><span class="tag">Развивает: ${escapeHtml(d.skill)}</span><div class="button-row"><a class="button outline small" href="${d.link}" target="_blank" rel="noopener noreferrer">О направлении ↗</a>${withChoice ? `<button class="button small" type="button" data-choose="${d.id}">Выбрать →</button>` : ''}</div></article>`).join('')}</div>`;
}
function navigator() {
  const suggested = state.age === 'teen' ? directions.filter(d => d.id === 'teen') : directions.filter(d => d.id !== 'teen' && (!state.interest || d.interest === state.interest));
  return heading('01 / ПРОФОРИЕНТАЦИЯ', 'Найди своё направление', 'Выбор здесь — первый ориентир, а не автоматический допуск к работе. Условия участия всегда уточняются у организатора.') +
  `<div class="split"><section class="panel"><h2>С чего начнём?</h2><form id="navigator-form" class="form-grid">
  <div class="field"><label for="age">Возрастная группа</label><select id="age" name="age" required><option value="">Выберите возраст</option><option value="teen" ${state.age === 'teen' ? 'selected' : ''}>14–17 лет</option><option value="adult" ${state.age === 'adult' ? 'selected' : ''}>18 лет и старше</option></select></div>
  <div class="field"><label for="interest">Что тебе ближе?</label><select id="interest" name="interest" required><option value="">Выберите интерес</option><option value="people" ${state.interest === 'people' ? 'selected' : ''}>Работа с людьми</option><option value="tech" ${state.interest === 'tech' ? 'selected' : ''}>Техника и производство</option><option value="nature" ${state.interest === 'nature' ? 'selected' : ''}>Природа и сезонные задачи</option><option value="first" ${state.interest === 'first' ? 'selected' : ''}>Пока хочу попробовать разное</option></select></div>
  <div class="field full"><button class="button" type="submit">Показать подходящий старт ↗</button></div></form><p class="form-help">Возраст и интерес сохраняются только в этом браузере. Имя и контакты здесь не запрашиваются.</p></section>
  <aside class="panel"><p class="eyebrow">ПОПРОБУЙ СИТУАЦИЮ</p><h2>Один рабочий день. Твой ход?</h2><p class="muted">В команде изменился план смены. Коллега не успевает выполнить свою часть. Что сделаешь?</p>
  <div class="scenario-options"><button type="button" data-case="plan" aria-pressed="${caseChoice === 'plan'}">Обсужу задачи и пересоберу план</button><button type="button" data-case="alone" aria-pressed="${caseChoice === 'alone'}">Молча сделаю всё сам(а)</button><button type="button" data-case="ignore" aria-pressed="${caseChoice === 'ignore'}">Подожду, пока решит руководитель</button></div>
  ${caseChoice ? `<div class="example-block"><strong>${caseChoice === 'plan' ? 'Хороший шаг: совместное решение' : caseChoice === 'alone' ? 'Инициатива — хорошо, но нужен разговор' : 'Попросить помощи можно, но сначала обозначь проблему'}</strong><p>${caseChoice === 'plan' ? 'Ты проявляешь командную работу и самоорганизацию. Согласуй новый план с ответственным за смену.' : caseChoice === 'alone' ? 'Попытка помочь полезна, но можно перегрузиться и нарушить сроки. Обсудите приоритеты и подключите наставника.' : 'Сообщи команде о риске, предложи вариант и передай вопрос наставнику, если полномочий недостаточно.'}</p><small>Это учебный кейс без оценки личности и автоматического рейтинга.</small></div>` : '<p class="small-text">Выбери вариант, чтобы увидеть разбор, а не оценку.</p>'}</aside></div>
  ${state.age ? `<section class="results"><div class="section-head"><h2>${state.age === 'teen' ? 'Доступный первый ориентир' : 'Направления для изучения'}</h2></div>${state.age === 'teen' ? message('Для 14–17 лет показываем ознакомление и возрастные пробы. Конкретную работу, согласия, допуск и условия организатор проверяет отдельно.', true) : message('Это справочные направления РСО, а не подтверждённые вакансии в ЛНР. Наличие набора и требования уточняй у организатора.')}${suggested.length ? directionCards(suggested, true) : `<div class="empty-state"><span>◇</span><div><h3>Универсального совпадения пока нет</h3><p>Попробуй другое направление или изучи полный каталог без автоматических рекомендаций.</p><a class="button outline small" href="#catalog">Открыть каталог ↗</a></div></div>`}</section>` : ''}`;
}
function catalog() {
  const points = verifiedPoints.filter(p => (!state.city || p.city === state.city) && (catalogFilter === 'all' || p.direction === catalogFilter));
  const filtered = directions.filter(d => catalogFilter === 'all' || d.id === catalogFilter);
  return heading('02 / КАРТА ВОЗМОЖНОСТЕЙ', 'Изучи возможности', 'Здесь различаются направления РСО и подтверждённые региональные точки. Пустой реестр нельзя выдавать за действующий набор.') +
  `<section class="panel"><h2>Региональные точки и пробы</h2><div class="field" style="max-width:310px"><label for="city">Населённый пункт</label><select id="city"><option value="">Вся ЛНР</option>${municipalities.map(c => `<option value="${escapeHtml(c)}" ${state.city === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}</select></div><p class="form-help">В справочник включаются только точки, которые отделение проверило и согласовало с партнёром. Координаты и контакты не выдумываются.</p>
  <div style="margin-top:18px">${points.length ? points.map(p => `<article class="record"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.city)} · ${escapeHtml(p.kind)}</p><p>${escapeHtml(p.conditions)}</p></article>`).join('') : `<div class="empty-state"><span>⌖</span><div><h3>Подтверждённых точек пока нет в каталоге</h3><p>Реестр проходит наполнение и проверку. Можно изучить направления ниже и зарегистрироваться на официальной платформе РСО. Для очного маршрута уточни действующий штаб через региональное отделение.</p>${linkButton('Перейти к регистрации ↗')}</div></div>`}</div></section>
  <div class="section-head"><h2>Справочник направлений</h2></div><div class="filter-row" aria-label="Фильтр направлений"><button type="button" class="chip" data-filter="all" aria-pressed="${catalogFilter === 'all'}">Все</button>${directions.map(d => `<button type="button" class="chip" data-filter="${d.id}" aria-pressed="${catalogFilter === d.id}">${escapeHtml(d.name)}</button>`).join('')}</div>${directionCards(filtered, true)}`;
}
const steps = [
  ['Знакомство и выбор', 'Изучи направления, свой интерес и требования входа.', 'Ты и куратор штаба'],
  ['Очная проба', 'Уточни доступную площадку и попробуй типовую задачу.', 'Штаб / площадка'],
  ['Подготовка', 'Пройди нужное обучение и узнай условия участия.', 'Образовательный партнёр'],
  ['Оформленный сезон', 'Перед выходом проверь оформление и требования безопасности.', 'Работодатель и командир'],
  ['Работа в отряде', 'Собери примеры задач, сотрудничества и результата.', 'Наставник и отряд'],
  ['Отзыв и навыки', 'Попроси конкретную обратную связь, опиши опыт.', 'Наставник / работодатель'],
  ['Следующая возможность', 'Подготовь резюме, встреться с работодателем или выбери новую пробу.', 'Штаб и карьерный центр'],
  ['Карьерный старт', 'При наличии предложения пройди отбор либо выбери альтернативу.', 'Ты и работодатель']
];
function route() {
  const count = state.steps.length;
  const chosen = directions.find(d => d.id === state.direction);
  const draft = state.draft;
  return heading('03 / ЛИЧНАЯ ТРАЕКТОРИЯ', 'Маршрут к профессии', 'От первой идеи до карьерного контакта. Отмеченные шаги — личные заметки в браузере, а не подтверждение участия РСО.') +
  `<div class="split"><section class="panel"><div class="section-head" style="margin:0 0 12px"><h2>Твой прогресс</h2><span class="tag">${count} / ${steps.length} шагов</span></div><div class="route-progress" role="progressbar" aria-label="Личный прогресс" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${steps.length}"><span style="width:${count / steps.length * 100}%"></span></div><p class="progress-copy">Выбрано направление: <strong>${chosen ? escapeHtml(chosen.name) : 'пока не выбрано'}</strong></p>
  <div class="route-list">${steps.map(([name, description, owner], i) => `<article class="step-card ${state.steps.includes(i) ? 'is-done' : ''}"><span class="step-number">${state.steps.includes(i) ? '✓' : i + 1}</span><div><h3>${name}</h3><p>${description}</p><span class="step-owner">КТО ПОМОГАЕТ: ${owner}</span></div><button type="button" class="button outline small" data-step="${i}" aria-pressed="${state.steps.includes(i)}">${state.steps.includes(i) ? 'Снять отметку' : 'Отметить для себя'}</button></article>`).join('')}</div><p class="timeline-note">Работодатель отвечает за допуск, оформление и решение о найме; сайт не подтверждает пройденные этапы автоматически.</p></section>
  <aside><section class="panel"><p class="eyebrow">ЧЕРНОВИК ОБРАЩЕНИЯ</p><h2>Сформулируй запрос</h2><p class="small-text">Здесь нет отправки куратору: можно скачать черновик и затем обратиться через официальный канал или очно.</p>
  <form id="draft-form" class="form-grid" style="grid-template-columns:1fr"><div class="field"><label for="draft-city">Где тебе удобно начать?</label><select id="draft-city" name="city" required><option value="">Выберите населённый пункт</option>${municipalities.map(c => `<option value="${escapeHtml(c)}" ${state.city === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}</select></div><div class="field"><label for="draft-goal">Что хочешь уточнить?</label><select id="draft-goal" name="goal" required><option value="">Выберите тему</option><option value="Профессиональная проба">Профессиональная проба</option><option value="Обучение и вступление в отряд">Обучение и вступление в отряд</option><option value="Отзыв после сезона и карьерная встреча">Отзыв после сезона и карьерная встреча</option></select></div><button class="button" type="submit">Подготовить черновик ↗</button></form>
  ${draft ? `<div class="example-block"><span class="tag gray">НЕ ОТПРАВЛЕНО · ЛОКАЛЬНО</span><p><strong>${escapeHtml(draft.goal)}</strong><br>${escapeHtml(draft.city)} · ${escapeHtml(draft.direction || 'направление не выбрано')}</p><div class="button-row"><button class="button small" type="button" data-export="draft">Скачать черновик ↓</button><button class="button outline small" type="button" data-clear="draft">Удалить</button></div></div>` : ''}</section>
  <section class="panel" style="margin-top:15px"><h3>Следующий реальный шаг</h3><p class="muted">Узнай об условиях и зарегистрируйся через официальный личный кабинет. Подтверждение от куратора появится только после подключения сервиса.</p>${linkButton('Регистрация бойца ↗')}</section></aside></div>`;
}
function portfolio() {
  return heading('04 / ОПЫТ И НАВЫКИ', 'Из опыта — в резюме', 'Запиши действие, результат и чему научился. Здесь создаётся только личный черновик, а не подтверждённое работодателем портфолио.') +
  `<div class="split"><section class="panel"><h2>Новый пример из практики</h2><form id="evidence-form" class="form-grid"><div class="field full"><label for="skill">Какой навык показываешь?</label><select id="skill" name="skill" required><option value="">Выберите навык</option><option>Работа в команде</option><option>Ответственность</option><option>Коммуникация</option><option>Самоорганизация</option><option>Профессиональный навык</option><option>Решение рабочей задачи</option></select></div><div class="field full"><label for="action">Что именно ты сделал(а)?</label><textarea id="action" name="action" maxlength="240" minlength="12" required placeholder="Например: согласовал задачи перед сменой и помог команде изменить план"></textarea></div><div class="field full"><label for="result">Каким был результат?</label><textarea id="result" name="result" maxlength="240" minlength="8" required placeholder="Что получилось и кто может подтвердить результат?"></textarea></div><div class="field full"><button type="submit" class="button">Сохранить пример локально ↗</button></div></form><p class="form-help">Не вводи фамилии, телефоны, сведения клиентов, названия закрытых объектов и конфиденциальные документы. Для подтверждения попроси отзыв наставника вне этого прототипа.</p></section>
  <aside><section class="panel"><p class="eyebrow">ПОСЛЕ СЕЗОНА</p><h2>Формула сильного примера</h2><p><strong>Задача → моё действие → результат → компетенция.</strong></p><p class="muted">«В смене распределил задачи между тремя участниками, согласовал обновлённый план с наставником и выполнил участок в срок» сильнее, чем «я лидер».</p><div class="example-block"><strong>Что делать дальше?</strong><p>Попроси письменный отзыв, проверь требования вакансии, перенеси только подтверждённые примеры в резюме и обсуди следующий шаг со штабом.</p></div></section></aside></div>
  <div class="section-head"><h2>Мои примеры <span class="tag gray">${state.evidence.length}</span></h2>${state.evidence.length ? '<button type="button" class="button outline small" data-export="portfolio">Скачать черновик резюме ↓</button>' : ''}</div>
  ${state.evidence.length ? state.evidence.map((item, i) => `<article class="record"><span class="tag">${escapeHtml(item.skill)}</span><h3>Пример ${i + 1}</h3><p><strong>Действие:</strong> ${escapeHtml(item.action)}</p><p><strong>Результат:</strong> ${escapeHtml(item.result)}</p><p class="small-text">Самостоятельная запись · отзыв наставника не прикреплён</p><button type="button" class="danger" data-remove="${i}">Удалить пример</button></article>`).join('') : `<div class="empty-state"><span>✳</span><div><h3>Твой опыт ещё не записан</h3><p>Добавь первый пример из учёбы, проекта или трудового сезона. Необязательно ждать подтверждения, чтобы начать черновик.</p></div></div>`}`;
}
function coordinator() {
  return heading('05 / КУРАТОРУ', 'Маршрут под контролем', 'Экран для демонстрации процесса. Реальных заявок, персональных данных, кабинетов партнёров и интеграции здесь нет.') +
  `<div class="tiles"><div class="tile"><span class="tile-icon">01</span><h3>Проверить площадку</h3><p>Соглашение, ответственный, возрастные условия и срок актуальности</p></div><div class="tile"><span class="tile-icon">02</span><h3>Ответить на запрос</h3><p>Контакт, согласия, запись или понятная причина отказа</p></div><div class="tile"><span class="tile-icon">03</span><h3>Закрыть переход</h3><p>Подготовка, отзыв, следующий шаг и альтернативная проба</p></div></div>
  <div class="section-head"><h2>Очередь на этом устройстве</h2></div><div class="two-col"><section class="panel"><h3>Локальные черновики</h3>${state.draft ? `<article class="record"><span class="tag gray">НЕ ПЕРЕДАНО</span><h3>${escapeHtml(state.draft.goal)}</h3><p>${escapeHtml(state.draft.city)} · ${escapeHtml(state.draft.direction || 'направление не выбрано')}</p><p>Статус: черновик. Куратор не получит его автоматически.</p><a class="text-link" href="#route">Открыть черновик ↗</a></article>` : '<div class="empty-state"><span>∅</span><div><h3>Очередь пуста</h3><p>Когда пользователь подготовит черновик на этом устройстве, он появится здесь как демонстрация карточки.</p></div></div>'}</section><section class="panel"><h3>Что нужно для реального запуска?</h3><p class="muted">Подтверждённый реестр организаций; защищённая передача заявки; согласия и роли доступа; рабочие контакты куратора; журнал сроков ответа; проверка возрастных ограничений.</p>${message('Сейчас на этой странице нельзя подтвердить участие или отправить заявку от имени регионального отделения.', true)}</section></div>
  <div class="section-head"><h2>Контроль качества перехода</h2></div><div class="steps-mini"><div class="step-mini"><span>ПЕРЕД ПРОБОЙ</span><strong>Условия и ответственный</strong><small>Опубликованы и проверены</small></div><div class="step-mini"><span>ПЕРЕД СЕЗОНОМ</span><strong>Обучение и допуск</strong><small>Подтверждает организатор</small></div><div class="step-mini"><span>ПОСЛЕ СЕЗОНА</span><strong>Отзыв и результат</strong><small>Конкретные навыки, не рейтинг</small></div><div class="step-mini"><span>СЛЕДУЮЩИЙ ШАГ</span><strong>Работа или новая проба</strong><small>Без обещания вакансии</small></div></div>`;
}
function render() {
  const key = routeName();
  renderNav();
  main.innerHTML = { home, navigator, catalog, route, portfolio, coordinator }[key]();
  document.title = `${nav.find(item => item[0] === key)[1]} · Мой РСО ЛНР`;
}
function download(name, text) {
  const blob = new Blob(['\ufeff', text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
document.addEventListener('submit', event => {
  if (!['navigator-form', 'draft-form', 'evidence-form'].includes(event.target.id)) return;
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (form.id === 'navigator-form') {
    state.age = String(data.get('age')); state.interest = String(data.get('interest'));
    if (state.age === 'teen' && state.direction !== 'teen') state.direction = '';
    save(); render(); document.querySelector('.results')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  if (form.id === 'draft-form') {
    state.city = String(data.get('city')); state.draft = { city: state.city, goal: String(data.get('goal')), direction: directions.find(d => d.id === state.direction)?.name || '' };
    save(); render(); alertNotice('Черновик сохранён только в этом браузере. Куратору он не отправлен.');
  }
  if (form.id === 'evidence-form') {
    state.evidence.unshift({ skill: String(data.get('skill')), action: String(data.get('action')).trim(), result: String(data.get('result')).trim() });
    state.evidence = state.evidence.slice(0, 20); save(); render(); alertNotice('Пример добавлен в локальный черновик.');
  }
});
document.addEventListener('change', event => {
  if (event.target.id === 'city') { state.city = event.target.value; save(); render(); }
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-choose],[data-filter],[data-case],[data-step],[data-export],[data-clear],[data-remove]');
  if (!button) return;
  if (button.dataset.choose) {
    if (state.age === 'teen' && button.dataset.choose !== 'teen') {
      alertNotice('Для 14–17 лет сначала уточни доступную возрастную пробу и условия участия у организатора.');
      return;
    }
    state.direction = button.dataset.choose; save(); location.hash = 'route'; render(); alertNotice('Направление сохранено только на этом устройстве.');
  }
  if (button.dataset.filter) { catalogFilter = button.dataset.filter; render(); }
  if (button.dataset.case) { caseChoice = button.dataset.case; render(); }
  if (button.dataset.step !== undefined) {
    const id = Number(button.dataset.step); state.steps = state.steps.includes(id) ? state.steps.filter(n => n !== id) : [...state.steps, id].sort((a, b) => a - b);
    save(); render();
  }
  if (button.dataset.export === 'draft' && state.draft) download('rso-zapros.txt', `Черновик запроса — НЕ ОТПРАВЛЕН\nНаселённый пункт: ${state.draft.city}\nТема: ${state.draft.goal}\nНаправление: ${state.draft.direction || 'не выбрано'}\n\nДля реальной записи обратитесь к куратору или в личный кабинет РСО: ${platformUrl}`);
  if (button.dataset.export === 'portfolio') download('rso-portfolio.txt', `Мои навыки — личный черновик, не подтверждённый РСО\n\n${state.evidence.map((e, i) => `${i + 1}. ${e.skill}\nДействие: ${e.action}\nРезультат: ${e.result}`).join('\n\n')}\n\nПроверьте примеры с наставником перед отправкой работодателю.`);
  if (button.dataset.clear === 'draft') { state.draft = null; save(); render(); }
  if (button.dataset.remove !== undefined) { state.evidence.splice(Number(button.dataset.remove), 1); save(); render(); }
});
render();
