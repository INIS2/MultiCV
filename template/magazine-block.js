export function renderTest4Template(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .t4 { display:grid; gap:18px; color:#1b1712; }
      .t4 * { box-sizing:border-box; }
      .t4 h1, .t4 h2, .t4 p { margin:0; }
      .t4 a { color:inherit; }
      .t4 ul { margin:0; padding-left:18px; }
      .t4__hero { display:grid; grid-template-columns:1.2fr .7fr; gap:18px; align-items:stretch; }
      .t4__copy { padding:26px; border-radius:30px; background:#c75b35; color:#fff8f2; }
      .t4__kicker { font-size:.76rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; }
      .t4__hero h1 { margin:10px 0; font-size:clamp(2.1rem,4vw,3.5rem); line-height:.95; }
      .t4__meta { display:flex; flex-wrap:wrap; gap:10px 18px; margin-bottom:16px; color:rgba(255,255,255,.82); }
      .t4__photo { width:100%; max-width:230px; aspect-ratio:4 / 5; object-fit:cover; border-radius:26px; }
      .t4__contacts { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
      .t4__contact { display:grid; gap:2px; padding:14px 16px; border-radius:18px; background:#fffaf2; border:1px solid rgba(199,91,53,.16); text-decoration:none; }
      .t4__contact span { color:#96654d; }
      .t4__sections { display:grid; gap:16px; }
      .t4__section { padding:20px; border-radius:28px; }
      .t4__section.is-sand { background:#fff7ec; }
      .t4__section.is-ink { background:#1e1d25; color:#f6f4ff; }
      .t4__section.is-ink .t4__card, .t4__section.is-ink .t4__card-subtitle, .t4__section.is-ink .t4__card-meta, .t4__section.is-ink .t4__card-copy { color:inherit; }
      .t4__section.is-ink .t4__card { background:rgba(255,255,255,.06); }
      .t4__head { display:flex; align-items:center; gap:14px; margin-bottom:16px; }
      .t4__index { display:inline-flex; width:38px; height:38px; align-items:center; justify-content:center; border-radius:12px; background:rgba(27,23,18,.08); font-weight:700; }
      .t4__list { display:grid; gap:12px; }
      .t4__card { display:grid; gap:10px; padding:16px; border-radius:20px; background:rgba(255,255,255,.6); }
      .t4__card-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .t4__card-title { font-weight:700; }
      .t4__card-subtitle, .t4__card-meta { color:#645a4f; }
      .t4__card-meta { text-align:right; white-space:nowrap; font-size:.92rem; }
      @media (max-width: 960px) {
        .t4__hero, .t4__contacts { grid-template-columns:1fr; }
        .t4__card-top { flex-direction:column; }
        .t4__card-meta { text-align:left; white-space:normal; }
      }
    </style>
    <div class="t4">
      <header class="t4__hero">
        <div class="t4__copy">
          <div class="t4__kicker">Selected Resume</div>
          <h1>${escapeHtml(profile.name)}</h1>
          <div class="t4__meta"><span>${escapeHtml(profile.position)}</span><span>${escapeHtml(profile.location)}</span></div>
          <p>${escapeHtml(profile.introduction)}</p>
        </div>
        <img class="t4__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}">
      </header>
      <section class="t4__contacts">${contacts.map((item) => `<a class="t4__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></a>`).join("")}</section>
      <section class="t4__sections">
        ${sections.map((section, index) => `<section class="t4__section ${index % 2 === 0 ? "is-sand" : "is-ink"}"><div class="t4__head"><div class="t4__index">${String(index + 1).padStart(2, "0")}</div><h2>${escapeHtml(section.heading)}</h2></div><div class="t4__list">${section.entries.map((entry) => { const meta=getEntryMeta(entry); return `<article class="t4__card"><div class="t4__card-top"><div><div class="t4__card-title">${escapeHtml(getEntryTitle(entry))}</div>${getEntrySubtitle(entry) ? `<div class="t4__card-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="t4__card-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div><div class="t4__card-copy">${formatDescription(entry.description)}</div></article>`; }).join("")}</div></section>`).join("")}
      </section>
    </div>
  `;
}

export const renderTemplate = renderTest4Template;

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading: (Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries: (Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "항목"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary: pick(entry, ["period/date","date","startDate"]), secondary: pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
