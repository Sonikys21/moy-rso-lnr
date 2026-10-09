const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { resolve } = require('node:path');
const assert = require('node:assert/strict');

const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=9238', '--user-data-dir=C:/Users/sofia/AppData/Local/Temp/opencode/rso-clean-smoke', 'about:blank'
], { stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  let page;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:9238/json');
      page = (await response.json()).find(p => p.type === 'page');
      if (page) break;
    } catch { /* Waiting for Edge. */ }
    await sleep(250);
  }
  if (!page) throw Error('Could not connect to Edge DevTools');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    const promise = pending.get(message.id);
    if (promise) { pending.delete(message.id); message.error ? promise.reject(Error(message.error.message)) : promise.resolve(message.result); }
  };
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    return response.result.value;
  };
  await command('Runtime.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await command('Page.navigate', { url: pathToFileURL(resolve('app.html')).href });
  for (let i = 0; i < 30 && !(await evaluate('document.querySelector(".hero") !== null')); i++) await sleep(200);
  await evaluate('localStorage.removeItem("rso-lnr-mvp-v1"); location.hash = "home"; location.reload()');
  for (let i = 0; i < 30 && !(await evaluate('document.querySelector(".hero") !== null')); i++) await sleep(200);
  assert.equal(await evaluate('document.querySelector(".hero") !== null'), true);
  assert.equal(await evaluate('document.querySelector(".hero .button").getAttribute("href")'), '#navigator');
  assert.equal(await evaluate('document.querySelector(".brand img").naturalWidth > 0'), true);
  assert.equal(await evaluate('document.querySelectorAll("script[src],link[rel=stylesheet]").length + [...document.images].filter(img => !img.getAttribute("src").startsWith("data:")).length'), 0, 'standalone file references local assets');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'home horizontal overflow');
  for (const route of ['navigator', 'catalog', 'route', 'portfolio', 'coordinator']) {
    await evaluate(`location.hash = "${route}"`);
    await sleep(60);
    assert.equal(await evaluate('document.querySelector("main h1") !== null'), true, `${route}: missing heading`);
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `${route}: horizontal overflow`);
  }
  await evaluate('location.hash = "navigator"'); await sleep(60);
  await evaluate('document.querySelector("#age").value = "teen"; document.querySelector("#interest").value = "people"; document.querySelector("#navigator-form button[type=submit]").click()');
  assert.equal(await evaluate('document.querySelectorAll("[data-choose]").length'), 1, 'teen should only see age-appropriate start');
  await evaluate('document.querySelector("[data-case=plan]").click()');
  assert.equal(await evaluate('document.querySelector(".example-block").textContent.includes("командную работу")'), true);
  await evaluate('location.hash = "catalog"'); await sleep(60);
  assert.equal(await evaluate('document.querySelector(".empty-state").textContent.includes("Подтверждённых точек")'), true);
  await evaluate('document.querySelector("[data-choose=build]").click()');
  assert.equal(await evaluate('location.hash'), '#catalog', 'minor must not select adult pathway');
  await evaluate('location.hash = "navigator"'); await sleep(60);
  await evaluate('document.querySelector("#age").value = "adult"; document.querySelector("#interest").value = "tech"; document.querySelector("#navigator-form button[type=submit]").click()');
  await evaluate('document.querySelector("[data-choose=build]").click()');
  await sleep(100);
  assert.equal(await evaluate('location.hash'), '#route');
  await evaluate('document.querySelector("[data-step=\'0\']").click()');
  assert.equal(await evaluate('document.querySelector("[role=progressbar]").getAttribute("aria-valuenow")'), '1');
  await evaluate('document.querySelector("#draft-city").value = "Луганск"; document.querySelector("#draft-goal").value = "Профессиональная проба"; document.querySelector("#draft-form button[type=submit]").click()');
  assert.equal(await evaluate('document.querySelector(".example-block").textContent.includes("НЕ ОТПРАВЛЕНО")'), true);
  await evaluate('location.hash = "portfolio"'); await sleep(60);
  await evaluate('document.querySelector("#skill").value="Работа в команде"; document.querySelector("#action").value="Согласовал задачи и помог группе"; document.querySelector("#result").value="Смена завершилась в срок"; document.querySelector("#evidence-form button[type=submit]").click()');
  assert.equal(await evaluate('document.querySelectorAll(".record").length'), 1);
  await evaluate('location.hash = "coordinator"'); await sleep(60);
  assert.equal(await evaluate('document.querySelector(".record").textContent.includes("НЕ ПЕРЕДАНО")'), true);
  await command('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'desktop horizontal overflow');
  assert.deepEqual(exceptions, [], 'browser exceptions');
  console.log('Edge smoke: mobile/desktop, age guard, case, catalog, route, draft, portfolio, coordinator OK');
  ws.close();
}

run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => browser.kill());
