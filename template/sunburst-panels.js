export function renderTemplate(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .sp { color:#231815; background:radial-gradient(circle at top left, rgba(255,166,0,.35), transparent 30%), radial-gradient(circle at top right, rgba(255,92,129,.26), transparent 34%), linear-gradient(180deg, #fff5dc 0%, #ffe4bc 100%); border-radius:34px; padding:26px; }
      .sp * { box-sizing:border-box; }
      .sp h1, .sp h2, .sp p { margin:0; }
      .sp a { color:inherit; text-decoration:none; }
      .sp ul { margin:0; padding-left:18px; }
      .sp__hero { display:grid; grid-template-columns:1fr 320px; gap:18px; }
      .sp__intro { padding:28px; border-radius:30px; background:linear-gradient(135deg, #ff7b54 0%, #ffb347 48%, #ffe066 100%); color:#2b130b; box-shadow:0 24px 54px rgba(171,83,18,.22); }
      .sp__eyebrow { display:inline-flex; padding:7px 12px; border-radius:999px; background:rgba(255,255,255,.35); font-size:.76rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
      .sp__intro h1 { margin-top:16px; font-size:clamp(2.4rem,4vw,4.3rem); line-height:.92; letter-spacing:-.05em; }
      .sp__role { margin-top:12px; font-size:1.08rem; }
      .sp__summary { margin-top:16px; max-width:720px; }
      .sp__stack { display:grid; gap:14px; }
      .sp__photo-card, .sp__location, .sp__contact, .sp__section { background:rgba(255,252,244,.84); border:1px solid rgba(133,77,23,.12); box-shadow:0 18px 36px rgba(149,93,41,.14); }
      .sp__photo-card { padding:14px; border-radius:28px; }
      .sp__photo { width:100%; aspect-ratio:4 / 5; border-radius:22px; object-fit:cover; display:block; }
      .sp__location { border-radius:24px; padding:18px; }
      .sp__location strong { display:block; margin-bottom:6px; text-transform:uppercase; letter-spacing:.12em; font-size:.76rem; color:#b34922; }
      .sp__contacts { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:14px; margin-top:16px; }
      .sp__contact { border-radius:22px; padding:16px; min-height:92px; }
      .sp__contact span { display:block; color:#ae5f2d; font-size:.84rem; }
      .sp__contact strong { display:block; margin-top:8px; word-break:break-word; }
      .sp__sections { display:grid; gap:16px; margin-top:18px; }
      .sp__section { border-radius:28px; padding:18px; }
      .sp__section:nth-child(3n + 1) { background:linear-gradient(135deg, #fffaf1, #ffe9ce); }
      .sp__section:nth-child(3n + 2) { background:linear-gradient(135deg, #fff4ee, #ffd5d0); }
      .sp__section:nth-child(3n + 3) { background:linear-gradient(135deg, #fffbea, #ffe8a3); }
      .sp__section-head { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
      .sp__badge { width:44px; height:44px; border-radius:14px; background:#231815; color:#fff8ed; display:inline-flex; align-items:center; justify-content:center; font-weight:800; }
      .sp__section-head h2 { font-size:1.08rem; }
      .sp__items { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:14px; }
      .sp__item { padding:16px; border-radius:22px; background:rgba(255,255,255,.68); border:1px solid rgba(133,77,23,.1); }
      .sp__item-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .sp__item-title { font-weight:800; }
      .sp__item-subtitle { margin-top:4px; color:#8f5128; }
      .sp__item-meta { text-align:right; white-space:nowrap; color:#8f5128; font-size:.92rem; }
      .sp__copy { margin-top:10px; }
      @media (max-width: 960px) { .sp__hero, .sp__contacts, .sp__items { grid-template-columns:1fr; } .sp__item-top { flex-direction:column; } .sp__item-meta { text-align:left; white-space:normal; } }
    </style>
    <div class="sp">
      <header class="sp__hero">
        <section class="sp__intro"><span class="sp__eyebrow">Sunburst Panels</span><h1>${escapeHtml(profile.name)}</h1><p class="sp__role">${escapeHtml(profile.position)}</p><p class="sp__summary">${escapeHtml(profile.introduction)}</p></section>
        <aside class="sp__stack"><div class="sp__photo-card"><img class="sp__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}"></div><div class="sp__location"><strong>Base</strong><p>${escapeHtml(profile.location)}</p></div></aside>
      </header>
      <section class="sp__contacts">${contacts.map((item) => `<a class="sp__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></a>`).join("")}</section>
      <section class="sp__sections">${sections.map((section, index) => `<section class="sp__section"><div class="sp__section-head"><div class="sp__badge">${String(index + 1).padStart(2, "0")}</div><h2>${escapeHtml(section.heading)}</h2></div><div class="sp__items">${section.entries.map(renderEntry).join("")}</div></section>`).join("")}</section>
    </div>
  `;
}

function renderEntry(entry) {
  const meta = getEntryMeta(entry);
  return `<article class="sp__item"><div class="sp__item-top"><div><div class="sp__item-title">${escapeHtml(getEntryTitle(entry))}</div>${getEntrySubtitle(entry) ? `<div class="sp__item-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="sp__item-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div><div class="sp__copy">${formatDescription(entry.description)}</div></article>`;
}

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading:(Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries:(Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "Entry"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary:pick(entry, ["period/date","date","startDate"]), secondary:pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
