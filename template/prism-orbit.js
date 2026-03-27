export function renderTemplate(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .po { color:#eef5ff; background:radial-gradient(circle at top left, rgba(120,255,214,.22), transparent 32%), radial-gradient(circle at bottom right, rgba(154,120,255,.24), transparent 34%), linear-gradient(145deg, #081421 0%, #12273d 40%, #1c1840 100%); border-radius:34px; padding:28px; overflow:hidden; }
      .po * { box-sizing:border-box; }
      .po h1, .po h2, .po p { margin:0; }
      .po a { color:inherit; text-decoration:none; }
      .po ul { margin:0; padding-left:18px; }
      .po__hero { display:grid; grid-template-columns:300px 1fr; gap:20px; }
      .po__sidebar { padding:20px; border-radius:28px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); backdrop-filter:blur(20px); }
      .po__photo { width:100%; aspect-ratio:1 / 1.12; object-fit:cover; border-radius:24px; display:block; }
      .po__eyebrow { display:inline-flex; margin-top:16px; padding:7px 12px; border-radius:999px; background:linear-gradient(135deg, rgba(120,255,214,.22), rgba(154,120,255,.26)); color:#9ffff0; font-size:.76rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; }
      .po__sidebar h1 { margin-top:14px; font-size:2.5rem; line-height:.94; letter-spacing:-.05em; }
      .po__role, .po__location { margin-top:10px; color:rgba(238,245,255,.82); }
      .po__main { display:grid; gap:16px; }
      .po__intro, .po__contact-grid, .po__feature, .po__section { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); backdrop-filter:blur(22px); box-shadow:0 24px 56px rgba(5,8,22,.34); }
      .po__intro { border-radius:30px; padding:24px; }
      .po__intro p { max-width:780px; color:rgba(238,245,255,.88); }
      .po__rings { display:flex; gap:10px; margin-top:18px; }
      .po__rings span { width:18px; height:18px; border-radius:50%; border:3px solid rgba(255,255,255,.18); }
      .po__rings span:nth-child(1) { border-color:#78ffd6; }
      .po__rings span:nth-child(2) { border-color:#9a78ff; }
      .po__rings span:nth-child(3) { border-color:#ff7bd5; }
      .po__contact-grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:14px; border-radius:28px; padding:16px; }
      .po__contact { padding:16px; border-radius:20px; background:rgba(10,19,33,.34); border:1px solid rgba(255,255,255,.08); min-height:92px; }
      .po__contact span { display:block; color:#9ffff0; font-size:.82rem; }
      .po__contact strong { display:block; margin-top:8px; word-break:break-word; }
      .po__feature { border-radius:30px; padding:18px; }
      .po__feature-head { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:16px; }
      .po__feature-head h2 { font-size:1.04rem; text-transform:uppercase; letter-spacing:.08em; color:#9ffff0; }
      .po__line { flex:1; height:1px; background:linear-gradient(90deg, rgba(120,255,214,.7), rgba(154,120,255,0)); }
      .po__timeline { display:grid; gap:14px; }
      .po__sections { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; }
      .po__section { border-radius:28px; padding:18px; }
      .po__section:nth-child(odd) { background-color:rgba(11,27,45,.55); }
      .po__section:nth-child(even) { background-color:rgba(33,18,62,.48); }
      .po__section h2 { margin-bottom:14px; font-size:1rem; color:#9ffff0; text-transform:uppercase; letter-spacing:.08em; }
      .po__item { padding:14px 0; border-bottom:1px solid rgba(255,255,255,.08); }
      .po__item:last-child { padding-bottom:0; border-bottom:0; }
      .po__item-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .po__item-title { font-weight:800; }
      .po__item-subtitle { margin-top:4px; color:rgba(238,245,255,.76); }
      .po__item-meta { text-align:right; white-space:nowrap; color:#9ffff0; font-size:.92rem; }
      .po__copy { margin-top:10px; }
      @media (max-width: 960px) { .po__hero, .po__contact-grid, .po__sections { grid-template-columns:1fr; } .po__item-top { flex-direction:column; } .po__item-meta { text-align:left; white-space:normal; } }
    </style>
    <div class="po">
      <section class="po__hero">
        <aside class="po__sidebar"><img class="po__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}"><span class="po__eyebrow">Prism Orbit</span><h1>${escapeHtml(profile.name)}</h1><p class="po__role">${escapeHtml(profile.position)}</p><p class="po__location">${escapeHtml(profile.location)}</p></aside>
        <div class="po__main">
          <section class="po__intro"><p>${escapeHtml(profile.introduction)}</p><div class="po__rings"><span></span><span></span><span></span></div></section>
          <section class="po__contact-grid">${contacts.map((item) => `<a class="po__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></a>`).join("")}</section>
          ${sections[0] ? `<section class="po__feature"><div class="po__feature-head"><h2>${escapeHtml(sections[0].heading)}</h2><div class="po__line"></div></div><div class="po__timeline">${sections[0].entries.map(renderEntry).join("")}</div></section>` : ""}
        </div>
      </section>
      <section class="po__sections">${sections.slice(1).map((section) => `<section class="po__section"><h2>${escapeHtml(section.heading)}</h2>${section.entries.map(renderEntry).join("")}</section>`).join("")}</section>
    </div>
  `;
}

function renderEntry(entry) {
  const meta = getEntryMeta(entry);
  return `<article class="po__item"><div class="po__item-top"><div><div class="po__item-title">${escapeHtml(getEntryTitle(entry))}</div>${getEntrySubtitle(entry) ? `<div class="po__item-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="po__item-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div><div class="po__copy">${formatDescription(entry.description)}</div></article>`;
}

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading:(Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries:(Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "Entry"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary:pick(entry, ["period/date","date","startDate"]), secondary:pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
