export function renderTest3Template(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);
  const [primarySection, ...otherSections] = sections;

  root.innerHTML = `
    <style>
      .t3 { display:grid; grid-template-columns:300px 1fr; gap:24px; color:#1b1712; }
      .t3 * { box-sizing:border-box; }
      .t3 h1, .t3 h2, .t3 p { margin:0; }
      .t3 a { color:inherit; }
      .t3 ul { margin:0; padding-left:18px; }
      .t3__sidebar { padding:24px; border-radius:28px; background:linear-gradient(180deg,#132121 0%,#264242 100%); color:#edf7f6; }
      .t3__photo { width:100%; aspect-ratio:1 / 1.12; object-fit:cover; border-radius:22px; margin-bottom:18px; }
      .t3__badge { display:inline-flex; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.14); font-size:.75rem; text-transform:uppercase; letter-spacing:.1em; }
      .t3__sidebar h1 { margin:14px 0 8px; font-size:2.2rem; line-height:.95; }
      .t3__role, .t3__location, .t3__intro { color:rgba(237,247,246,.8); }
      .t3__intro { margin-top:18px; }
      .t3__contacts { display:grid; gap:10px; margin-top:22px; }
      .t3__contact { display:grid; gap:2px; padding:12px 14px; border-radius:16px; background:rgba(255,255,255,.08); text-decoration:none; }
      .t3__contact span { color:rgba(237,247,246,.66); font-size:.88rem; }
      .t3__main { display:grid; gap:18px; }
      .t3__feature, .t3__block { padding:22px; border:1px solid rgba(40,34,24,.14); border-radius:26px; background:#fff; }
      .t3__tag { font-size:.76rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; }
      .t3__timeline { position:relative; display:grid; gap:18px; margin-top:16px; }
      .t3__timeline::before { content:""; position:absolute; left:10px; top:8px; bottom:8px; width:2px; background:rgba(38,66,66,.16); }
      .t3__node { position:relative; display:grid; grid-template-columns:24px 1fr; gap:16px; }
      .t3__dot { width:22px; height:22px; border-radius:50%; background:#264242; border:4px solid #dbe8e6; position:relative; z-index:1; }
      .t3__node-body, .t3__block-items { display:grid; gap:16px; }
      .t3__node-top, .t3__item-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .t3__node-top h2 { font-size:1.08rem; }
      .t3__node-subtitle, .t3__node-meta, .t3__item-subtitle, .t3__item-meta { color:#645a4f; }
      .t3__node-meta, .t3__item-meta { text-align:right; white-space:nowrap; font-size:.92rem; }
      .t3__sections { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
      .t3__item-title { font-weight:700; }
      @media (max-width: 960px) {
        .t3, .t3__sections { grid-template-columns:1fr; }
        .t3__node-top, .t3__item-top { flex-direction:column; }
        .t3__node-meta, .t3__item-meta { text-align:left; white-space:normal; }
      }
    </style>
    <div class="t3">
      <aside class="t3__sidebar">
        <img class="t3__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}">
        <div class="t3__badge">Curriculum</div>
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="t3__role">${escapeHtml(profile.position)}</p>
        <p class="t3__location">${escapeHtml(profile.location)}</p>
        <p class="t3__intro">${escapeHtml(profile.introduction)}</p>
        <div class="t3__contacts">${contacts.map((item) => `<a class="t3__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></a>`).join("")}</div>
      </aside>
      <div class="t3__main">
        ${primarySection ? `<section class="t3__feature"><div class="t3__tag">${escapeHtml(primarySection.heading)}</div><div class="t3__timeline">${primarySection.entries.map((entry) => { const meta=getEntryMeta(entry); return `<article class="t3__node"><div class="t3__dot"></div><div class="t3__node-body"><div class="t3__node-top"><div><h2>${escapeHtml(getEntryTitle(entry))}</h2>${getEntrySubtitle(entry) ? `<div class="t3__node-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="t3__node-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div>${formatDescription(entry.description)}</div></article>`; }).join("")}</div></section>` : ""}
        <section class="t3__sections">
          ${otherSections.map((section) => `<section class="t3__block"><div class="t3__tag">${escapeHtml(section.heading)}</div><div class="t3__block-items">${section.entries.map((entry) => { const meta=getEntryMeta(entry); return `<article><div class="t3__item-top"><div><div class="t3__item-title">${escapeHtml(getEntryTitle(entry))}</div>${getEntrySubtitle(entry) ? `<div class="t3__item-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="t3__item-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div>${formatDescription(entry.description)}</article>`; }).join("")}</div></section>`).join("")}
        </section>
      </div>
    </div>
  `;
}

export const renderTemplate = renderTest3Template;

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading: (Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries: (Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "항목"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary: pick(entry, ["period/date","date","startDate"]), secondary: pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
