export function renderTest2Template(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .t2 { display:grid; gap:24px; color:#1b1712; }
      .t2 * { box-sizing:border-box; }
      .t2 h1, .t2 h2, .t2 p { margin:0; }
      .t2 a { color:inherit; }
      .t2 ul { margin:0; padding-left:18px; }
      .t2__hero { display:grid; grid-template-columns:1.4fr .8fr; gap:20px; padding:24px; border-radius:24px; background:linear-gradient(135deg,#19263b 0%,#354b6e 100%); color:#f6f7fb; }
      .t2__label { font-size:.76rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; }
      .t2__hero h1 { margin:10px 0; font-size:clamp(2.1rem,4vw,3.5rem); line-height:.95; }
      .t2__role { color:rgba(255,255,255,.82); }
      .t2__intro { margin-top:18px; color:rgba(255,255,255,.86); }
      .t2__side { display:grid; gap:14px; justify-items:end; }
      .t2__photo { width:100%; max-width:230px; aspect-ratio:4 / 5; object-fit:cover; border-radius:26px; border:1px solid rgba(255,255,255,.2); }
      .t2__location { padding:10px 14px; border-radius:999px; background:rgba(255,255,255,.12); }
      .t2__contacts, .t2__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
      .t2__grid { gap:18px; }
      .t2__contact, .t2__panel { border:1px solid rgba(40,34,24,.14); border-radius:18px; background:#fff; }
      .t2__contact { display:grid; gap:2px; padding:14px 16px; text-decoration:none; }
      .t2__contact span { color:#645a4f; }
      .t2__panel { overflow:hidden; border-radius:24px; }
      .t2__panel-head { padding:16px 18px; background:#f4efe6; border-bottom:1px solid rgba(40,34,24,.14); }
      .t2__panel-head h2 { font-size:1rem; }
      .t2__panel-body { display:grid; gap:18px; padding:18px; }
      .t2__entry { display:grid; gap:10px; }
      .t2__entry-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .t2__entry-title { font-weight:700; }
      .t2__entry-subtitle, .t2__entry-meta { color:#645a4f; }
      .t2__entry-meta { text-align:right; white-space:nowrap; font-size:.92rem; }
      @media (max-width: 960px) {
        .t2__hero, .t2__contacts, .t2__grid { grid-template-columns:1fr; }
        .t2__side { justify-items:start; }
        .t2__entry-top { flex-direction:column; }
        .t2__entry-meta { text-align:left; white-space:normal; }
      }
    </style>
    <div class="t2">
      <header class="t2__hero">
        <div>
          <div class="t2__label">Profile Deck</div>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="t2__role">${escapeHtml(profile.position)}</p>
          <p class="t2__intro">${escapeHtml(profile.introduction)}</p>
        </div>
        <div class="t2__side">
          <img class="t2__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}">
          <div class="t2__location">${escapeHtml(profile.location)}</div>
        </div>
      </header>
      <section class="t2__contacts">
        ${contacts.map((item) => `<a class="t2__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></a>`).join("")}
      </section>
      <section class="t2__grid">
        ${sections.map((section) => `
          <section class="t2__panel">
            <div class="t2__panel-head"><h2>${escapeHtml(section.heading)}</h2></div>
            <div class="t2__panel-body">
              ${section.entries.map((entry) => {
                const meta = getEntryMeta(entry);
                return `<article class="t2__entry"><div class="t2__entry-top"><div><div class="t2__entry-title">${escapeHtml(getEntryTitle(entry))}</div>${getEntrySubtitle(entry) ? `<div class="t2__entry-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}</div><div class="t2__entry-meta">${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}</div></div>${formatDescription(entry.description)}</article>`;
              }).join("")}
            </div>
          </section>
        `).join("")}
      </section>
    </div>
  `;
}

export const renderTemplate = renderTest2Template;

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading: (Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries: (Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "항목"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary: pick(entry, ["period/date","date","startDate"]), secondary: pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
