export function renderTemplate(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .ns { color:#f4f7fb; background:radial-gradient(circle at top left, rgba(255,102,196,.34), transparent 28%), radial-gradient(circle at top right, rgba(49,212,255,.28), transparent 30%), linear-gradient(135deg, #0f1226 0%, #17153d 45%, #0d1832 100%); border-radius:34px; padding:28px; overflow:hidden; }
      .ns * { box-sizing:border-box; }
      .ns h1, .ns h2, .ns p { margin:0; }
      .ns a { color:inherit; text-decoration:none; }
      .ns ul { margin:0; padding-left:18px; }
      .ns__hero { display:grid; grid-template-columns:1.2fr .8fr; gap:20px; align-items:stretch; }
      .ns__intro, .ns__photo-panel, .ns__contact, .ns__section { border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.08); backdrop-filter:blur(20px); box-shadow:0 24px 60px rgba(5,10,24,.38); }
      .ns__intro { border-radius:30px; padding:26px; }
      .ns__eyebrow { display:inline-flex; padding:7px 12px; border-radius:999px; background:rgba(255,255,255,.1); color:#7ef9ff; font-size:.78rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
      .ns__intro h1 { margin-top:16px; font-size:clamp(2.4rem,4vw,4.6rem); line-height:.9; letter-spacing:-.05em; }
      .ns__role { margin-top:12px; color:#ffd7f1; font-size:1.08rem; }
      .ns__summary { margin-top:18px; color:rgba(244,247,251,.86); }
      .ns__stripes { display:flex; gap:8px; margin-top:22px; }
      .ns__stripes span { height:8px; border-radius:999px; }
      .ns__stripes span:nth-child(1) { width:22%; background:#ff66c4; }
      .ns__stripes span:nth-child(2) { width:36%; background:#31d4ff; }
      .ns__stripes span:nth-child(3) { width:18%; background:#ffd166; }
      .ns__photo-panel { display:grid; gap:14px; padding:18px; border-radius:30px; }
      .ns__photo { width:100%; aspect-ratio:4 / 5; object-fit:cover; border-radius:22px; display:block; }
      .ns__location { padding:14px 16px; border-radius:20px; background:linear-gradient(135deg, rgba(255,102,196,.18), rgba(49,212,255,.18)); }
      .ns__location strong { display:block; margin-bottom:6px; color:#7ef9ff; text-transform:uppercase; font-size:.76rem; letter-spacing:.12em; }
      .ns__contacts { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:14px; margin-top:16px; }
      .ns__contact { padding:16px; border-radius:22px; min-height:92px; }
      .ns__contact span { display:block; color:#9fdcff; font-size:.84rem; }
      .ns__contact strong { display:block; margin-top:8px; word-break:break-word; }
      .ns__sections { display:grid; gap:16px; margin-top:18px; }
      .ns__section { display:grid; grid-template-columns:220px 1fr; gap:18px; padding:18px; border-radius:26px; }
      .ns__section-head { display:grid; align-content:start; gap:10px; }
      .ns__index { width:52px; height:52px; border-radius:18px; display:inline-flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #ff66c4, #31d4ff); color:#08101d; font-weight:800; }
      .ns__section-head h2 { font-size:1.02rem; letter-spacing:.06em; text-transform:uppercase; color:#7ef9ff; }
      .ns__items { display:grid; gap:14px; }
      .ns__item { padding:16px; border-radius:22px; background:rgba(5,10,24,.22); border:1px solid rgba(255,255,255,.08); }
      .ns__item-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .ns__item-title { font-weight:800; font-size:1.04rem; }
      .ns__item-subtitle { margin-top:4px; color:#ffd7f1; }
      .ns__item-meta { text-align:right; color:#9fdcff; white-space:nowrap; font-size:.92rem; }
      .ns__item-copy { margin-top:10px; color:rgba(244,247,251,.88); }
      @media (max-width: 960px) { .ns__hero, .ns__section, .ns__contacts { grid-template-columns:1fr; } .ns__item-top { flex-direction:column; } .ns__item-meta { text-align:left; white-space:normal; } }
    </style>
    <div class="ns">
      <header class="ns__hero">
        <section class="ns__intro">
          <span class="ns__eyebrow">Neon Sprint</span>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="ns__role">${escapeHtml(profile.position)}</p>
          <p class="ns__summary">${escapeHtml(profile.introduction)}</p>
          <div class="ns__stripes"><span></span><span></span><span></span></div>
        </section>
        <aside class="ns__photo-panel">
          <img class="ns__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}">
          <div class="ns__location"><strong>Location</strong><p>${escapeHtml(profile.location)}</p></div>
        </aside>
      </header>
      <section class="ns__contacts">
        ${contacts.map((item) => `<a class="ns__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></a>`).join("")}
      </section>
      <section class="ns__sections">
        ${sections.map((section, index) => `<section class="ns__section"><div class="ns__section-head"><div class="ns__index">${String(index + 1).padStart(2, "0")}</div><h2>${escapeHtml(section.heading)}</h2></div><div class="ns__items">${section.entries.map(renderEntry).join("")}</div></section>`).join("")}
      </section>
    </div>
  `;
}

function renderEntry(entry) {
  const meta = getEntryMeta(entry);
  return `<article class="ns__item"><div class="ns__item-top"><div><div class="ns__item-title">${escapeHtml(getEntryTitle(entry))}</div>${getEntrySubtitle(entry) ? `<div class="ns__item-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="ns__item-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div><div class="ns__item-copy">${formatDescription(entry.description)}</div></article>`;
}

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading:(Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries:(Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "Entry"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary:pick(entry, ["period/date","date","startDate"]), secondary:pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
