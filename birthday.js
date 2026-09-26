/* Visual behavior lives here; client copy is kept in birthday-content.js. */
const CONTENT = window.BIRTHDAY_CONTENT;
const CONFIG = {
  ASSETS: {
    COVER_VIDEO_URL: CONTENT.assets.coverVideo, COVER_POSTER_URL: CONTENT.assets.coverPoster, HERO_VIDEO_URL: CONTENT.assets.heroVideo, MUSIC_URL: CONTENT.assets.music,
    BABY_PHOTO_01: CONTENT.assets.babyPhoto01, BABY_PHOTO_02: CONTENT.assets.babyPhoto02,
    PARENTS_PHOTO: CONTENT.assets.parentsPhoto, GRANDPARENTS_PHOTO: CONTENT.assets.grandparentsPhoto,
    DECORATIVE_BACKGROUND: CONTENT.assets.decorativeBackground
  },
  CHILD_NAME: CONTENT.childName, NICKNAME: CONTENT.nickname,
  BIRTH_DATE_LABEL: CONTENT.birthDateLabel, BIRTH_TIME: CONTENT.birthTime, BIRTH_WEIGHT: CONTENT.birthWeight,
  PARENT_NAMES: CONTENT.parentNames, HERO_MESSAGE: CONTENT.heroMessage,
  EVENT_DAY: CONTENT.eventDay, EVENT_DATE_LABEL: CONTENT.eventDateLabel, EVENT_TIME_LABEL: CONTENT.eventTimeLabel,
  BIRTHDAY_DATE_TIME: CONTENT.birthdayDateTime, TIMEZONE: CONTENT.timezone,
  VENUE_NAME: CONTENT.venueName, VENUE_ADDRESS: CONTENT.venueAddress, GOOGLE_MAPS_URL: CONTENT.googleMapsUrl,
  RSVP_WHATSAPP_NUMBER: CONTENT.rsvpWhatsAppNumber, RSVP_WHATSAPP_MESSAGE: CONTENT.rsvpWhatsAppMessage
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fill = (key, value) => $$(`[data-config="${key}"]`).forEach((node) => {
  if (node.tagName === "P" && key === "venueAddress") node.innerHTML = escapeHTML(value).replace(/\n/g, "<br>");
  else node.textContent = value;
});
function escapeHTML(text) { return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }

function applyConfig() {
  const assetTargets = [
    ["#coverVideo source", CONFIG.ASSETS.COVER_VIDEO_URL], ["#heroVideo source", CONFIG.ASSETS.HERO_VIDEO_URL],
    ["#birthdayMusic source", CONFIG.ASSETS.MUSIC_URL], [".photo-frame--baby img", CONFIG.ASSETS.BABY_PHOTO_01],
    [".memory--one img", CONFIG.ASSETS.BABY_PHOTO_01], [".memory--two img", CONFIG.ASSETS.BABY_PHOTO_02],
    [".memory--three img", CONFIG.ASSETS.PARENTS_PHOTO], [".family__photo img", CONFIG.ASSETS.PARENTS_PHOTO],
    [".memory--four img", CONFIG.ASSETS.GRANDPARENTS_PHOTO], [".grandparents__photo img", CONFIG.ASSETS.GRANDPARENTS_PHOTO],
    [".thankyou__photo img", CONFIG.ASSETS.BABY_PHOTO_01]
  ];
  assetTargets.forEach(([selector, url]) => { const target = $(selector); if (target && url) target.src = url; });
  const coverVideo = $("#coverVideo");
  if (coverVideo && CONFIG.ASSETS.COVER_POSTER_URL) coverVideo.poster = CONFIG.ASSETS.COVER_POSTER_URL;
  if (CONFIG.ASSETS.DECORATIVE_BACKGROUND) document.documentElement.style.setProperty("--decorative-background", `url("${CONFIG.ASSETS.DECORATIVE_BACKGROUND}")`);
  const heroPoster = $("#heroVideo");
  if (heroPoster && CONFIG.ASSETS.BABY_PHOTO_01) heroPoster.poster = CONFIG.ASSETS.BABY_PHOTO_01;
  const values = {
    childName: CONFIG.CHILD_NAME, nickname: CONFIG.NICKNAME, birthDate: CONFIG.BIRTH_DATE_LABEL,
    birthTime: CONFIG.BIRTH_TIME, birthWeight: CONFIG.BIRTH_WEIGHT, parentNames: CONFIG.PARENT_NAMES,
    heroMessage: CONFIG.HERO_MESSAGE, eventDay: CONFIG.EVENT_DAY, eventDateLabel: CONFIG.EVENT_DATE_LABEL,
    eventTimeLabel: CONFIG.EVENT_TIME_LABEL, venueName: CONFIG.VENUE_NAME, venueAddress: CONFIG.VENUE_ADDRESS,
    chapter1Title: CONTENT.chapters[0].title, chapter1Caption: CONTENT.chapters[0].caption, chapter1PhotoNote: CONTENT.chapters[0].photoNote,
    chapter2Title: CONTENT.chapters[1].title, chapter2Caption: CONTENT.chapters[1].caption, chapter2PhotoNote: CONTENT.chapters[1].photoNote,
    chapter3Title: CONTENT.chapters[2].title, chapter3Caption: CONTENT.chapters[2].caption, chapter3PhotoNote: CONTENT.chapters[2].photoNote,
    chapter4Title: CONTENT.chapters[3].title, chapter4Caption: CONTENT.chapters[3].caption, chapter4PhotoNote: CONTENT.chapters[3].photoNote
  };
  Object.entries(values).forEach(([key, value]) => fill(key, value));
  $$(".optional-fact").forEach((fact) => { fact.hidden = !fact.querySelector("strong")?.textContent.trim(); });
  const date = new Date(CONFIG.BIRTHDAY_DATE_TIME);
  if (!Number.isNaN(date.getTime())) {
    const fmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: CONFIG.TIMEZONE });
    fill("eventDateLong", fmt.format(date).replace(" at ", " · "));
  }
  const mapsLink = $(`[data-maps-link]`);
  if (mapsLink) mapsLink.href = CONFIG.GOOGLE_MAPS_URL || "#venue";
}

const cover = $("#cover"), coverVideo = $("#coverVideo");
const story = $("#story"), heroVideo = $("#heroVideo"), music = $("#birthdayMusic");
const musicToggle = $("#musicToggle"), musicLabel = $(".music-toggle__label", musicToggle);
let storyStarted = false;

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "error-toast"; toast.setAttribute("role", "status"); toast.textContent = message;
  document.body.append(toast); window.setTimeout(() => toast.remove(), 3600);
}
function revealStory() {
  if (storyStarted) return;
  storyStarted = true;
  heroVideo.play().catch(() => {});
  cover.classList.add("is-leaving"); story.classList.add("is-open"); story.setAttribute("aria-hidden", "false");
  document.body.classList.remove("no-scroll"); musicToggle.classList.add("is-visible");
  window.setTimeout(() => {
    cover.setAttribute("hidden", "");
    story.style.marginTop = "0";
  }, 1250);
  requestAnimationFrame(() => observeReveals());
}
function beginCover() {
  if (storyStarted || !coverVideo.paused) return;
  coverVideo.addEventListener("playing", () => window.setTimeout(revealStory, 5500), { once: true });
  coverVideo.play().catch(() => showToast("Tap the cover to begin the story."));
  music.volume = 0.72;
  music.play().then(() => updateMusicButton(true)).catch(() => updateMusicButton(false));
}
cover.addEventListener("pointerdown", beginCover);
coverVideo.addEventListener("ended", revealStory);
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try { await music.play(); updateMusicButton(true); }
    catch { showToast("Music could not be played on this device."); }
  } else { music.pause(); updateMusicButton(false); }
});
function updateMusicButton(playing) {
  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute("aria-pressed", String(playing));
  musicToggle.setAttribute("aria-label", playing ? "Turn music off" : "Turn music on");
  musicLabel.textContent = playing ? "Sound on" : "Sound off";
}

let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("is-visible")); return; }
  if (!revealObserver) revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
  }, { threshold: 0.13, rootMargin: "0px 0px -35px 0px" });
  $$(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
}

// Canvas scratch surface: destination-out strokes are measured to clear at 60% coverage.
const scratchCanvas = $("#scratchCanvas"), scratchWrap = $("#scratchWrap");
const scratchContext = scratchCanvas.getContext("2d", { willReadFrequently: true });
let isScratching = false, lastPoint = null, scratchComplete = false, checkAt = 0, scratchMask = [], scratchAreaSamples = 0;
function paintScratchSurface() {
  const bounds = scratchWrap.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (!bounds.width || !bounds.height) return;
  scratchCanvas.width = Math.round(bounds.width * dpr); scratchCanvas.height = Math.round(bounds.height * dpr);
  scratchCanvas.style.width = `${bounds.width}px`; scratchCanvas.style.height = `${bounds.height}px`;
  scratchContext.setTransform(dpr, 0, 0, dpr, 0, 0); scratchContext.globalCompositeOperation = "source-over"; scratchContext.globalAlpha = 1;
  const gradient = scratchContext.createLinearGradient(0, 0, bounds.width, bounds.height);
  gradient.addColorStop(0, "#d9bd76"); gradient.addColorStop(.28, "#f1e4bd"); gradient.addColorStop(.54, "#c9a45b"); gradient.addColorStop(.8, "#edddae"); gradient.addColorStop(1, "#be9952");
  scratchContext.fillStyle = gradient; scratchContext.fillRect(0, 0, bounds.width, bounds.height);
  scratchContext.save(); scratchContext.globalAlpha = .15; scratchContext.strokeStyle = "#fff9e8"; scratchContext.lineWidth = 1;
  for (let x = -bounds.height; x < bounds.width + bounds.height; x += 6) { scratchContext.beginPath(); scratchContext.moveTo(x, 0); scratchContext.lineTo(x - bounds.height, bounds.height); scratchContext.stroke(); }
  scratchContext.restore(); scratchContext.fillStyle = "#fff9e8"; scratchContext.globalAlpha = .9;
  scratchContext.font = `24px Georgia`; scratchContext.textAlign = "center"; scratchContext.fillText("✦", bounds.width / 2, bounds.height / 2 - 31);
  scratchContext.fillStyle = "#665738"; scratchContext.globalAlpha = .92; scratchContext.font = `700 12px ${getComputedStyle(document.body).fontFamily}`; scratchContext.letterSpacing = "3px";
  scratchContext.fillText("SCRATCH HERE", bounds.width / 2, bounds.height / 2 + 4);
  scratchContext.globalAlpha = .82; scratchContext.font = `italic 13px Georgia`; scratchContext.letterSpacing = "0"; scratchContext.fillText("rub gently to reveal", bounds.width / 2, bounds.height / 2 + 28);
  scratchContext.globalAlpha = 1;
  const initialPixels = scratchContext.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  scratchMask = []; scratchAreaSamples = 0;
  for (let i = 3; i < initialPixels.length; i += 32) { const insideHeart = initialPixels[i] > 40; scratchMask.push(insideHeart); if (insideHeart) scratchAreaSamples++; }
  if (scratchComplete) clearScratch();
}
function pointFromEvent(event) { const rect = scratchCanvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
function beginScratch(event) { if (scratchComplete) return; event.preventDefault(); scratchCanvas.setPointerCapture?.(event.pointerId); isScratching = true; lastPoint = pointFromEvent(event); scratchAt(lastPoint, lastPoint); }
function moveScratch(event) { if (!isScratching || scratchComplete) return; event.preventDefault(); const point = pointFromEvent(event); scratchAt(lastPoint, point); lastPoint = point; const now = performance.now(); if (now - checkAt > 110) { checkAt = now; checkScratchProgress(); } }
function endScratch() { isScratching = false; lastPoint = null; checkScratchProgress(); }
function scratchAt(from, to) {
  const rect = scratchCanvas.getBoundingClientRect(), scaleX = scratchCanvas.width / rect.width, scaleY = scratchCanvas.height / rect.height;
  scratchContext.save(); scratchContext.setTransform(scaleX, 0, 0, scaleY, 0, 0); scratchContext.globalCompositeOperation = "destination-out"; scratchContext.lineCap = "round"; scratchContext.lineJoin = "round"; scratchContext.lineWidth = 38;
  scratchContext.beginPath(); scratchContext.moveTo(from.x, from.y); scratchContext.lineTo(to.x, to.y); scratchContext.stroke(); scratchContext.restore();
}
function checkScratchProgress() {
  if (scratchComplete || !scratchCanvas.width) return;
  const pixels = scratchContext.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clear = 0, sample = 0;
  for (let i = 3; i < pixels.length; i += 32, sample++) if (scratchMask[sample] && pixels[i] < 40) clear++;
  const ratio = clear / Math.max(scratchAreaSamples, 1);
  if (ratio >= .6) finishScratch();
}
function clearScratch() { scratchContext.save(); scratchContext.setTransform(1, 0, 0, 1, 0, 0); scratchContext.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height); scratchContext.restore(); }
function finishScratch() {
  if (scratchComplete) return; scratchComplete = true; clearScratch(); $("#dateCard").classList.add("is-revealed"); $("#scratchHelp").textContent = "We can’t wait to celebrate with you!"; popConfetti();
}
function popConfetti() {
  const layer = $("#confettiLayer"), box = scratchWrap.getBoundingClientRect(), colors = ["#f7f0e5", "#d3a13d", "#d9785e", "#416e69", "#c5a05b"];
  for (let i = 0; i < 28; i++) {
    const dot = document.createElement("i"); dot.className = "confetti"; dot.style.left = `${box.left - layer.getBoundingClientRect().left + box.width / 2}px`; dot.style.top = `${box.top - layer.getBoundingClientRect().top + box.height / 2}px`;
    dot.style.background = colors[i % colors.length]; dot.style.setProperty("--dx", `${(Math.random() - .5) * 230}px`); dot.style.setProperty("--dy", `${(Math.random() - .65) * 220}px`); dot.style.setProperty("--rot", `${Math.random() * 300}deg`); layer.append(dot); window.setTimeout(() => dot.remove(), 1600);
  }
}
scratchCanvas.addEventListener("pointerdown", beginScratch); scratchCanvas.addEventListener("pointermove", moveScratch); scratchCanvas.addEventListener("pointerup", endScratch); scratchCanvas.addEventListener("pointercancel", endScratch);
window.addEventListener("resize", () => { window.clearTimeout(paintScratchSurface.timer); paintScratchSurface.timer = window.setTimeout(paintScratchSurface, 120); });

function updateCountdown() {
  const target = new Date(CONFIG.BIRTHDAY_DATE_TIME).getTime(), remaining = target - Date.now();
  if (!Number.isFinite(target) || remaining <= 0) { $("#countdownTimer").hidden = true; $("#countdownToday").hidden = false; return; }
  const seconds = Math.floor(remaining / 1000);
  $("#days").textContent = String(Math.floor(seconds / 86400)).padStart(2, "0");
  $("#hours").textContent = String(Math.floor(seconds % 86400 / 3600)).padStart(2, "0");
  $("#minutes").textContent = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
  $("#seconds").textContent = String(seconds % 60).padStart(2, "0");
}

function formatMessage(template, data) { return template.replace(/\{([A-Z_]+)\}/g, (_, key) => data[key] ?? ""); }
$("#rsvpWhatsApp").addEventListener("click", () => {
  const number = CONFIG.RSVP_WHATSAPP_NUMBER.replace(/\D/g, "");
  if (number && !/^\d{8,15}$/.test(number)) {
    showToast("Please add the WhatsApp number with country code in birthday-content.js.");
    return;
  }
  const message = formatMessage(CONFIG.RSVP_WHATSAPP_MESSAGE, { CHILD_NAME: CONFIG.CHILD_NAME });
  const recipient = number ? `${number}/` : "";
  window.open(`https://wa.me/${recipient}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

applyConfig(); paintScratchSurface(); updateCountdown(); window.setInterval(updateCountdown, 1000); observeReveals();



