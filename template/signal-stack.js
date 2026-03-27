export function renderSignalStackTemplate(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .t5 { display:grid; gap:22px; color:#16181d; }
      .t5 * { box-sizing:border-box; }
      .t5 h1, .t5 h2, .t5 p { margin:0; }
      .t5 a { color:inherit; }
      .t5 ul { margin:0; padding-left:18px; }
      .t5__hero { display:grid; grid-template-columns:1.2fr .9fr; gap:18px; }
      .t5__intro { padding:26px; border-radius:30px; background:linear-gradient(145deg,#111827 0%,#1f3a5f 62%,#5d88b8 100%); color:#f7fafc; }
      .t5__eyebrow { display:inline-flex; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.12); font-size:.74rem; letter-spacing:.12em; text-transform:uppercase; font-weight:700; }
      .t5__intro h1 { margin:14px 0 12px; font-size:clamp(2.2rem,4vw,3.8rem); line-height:.92; letter-spacing:-.04em; }
      .t5__headline { color:rgba(247,250,252,.84); }
      .t5__summary { margin-top:18px; color:rgba(247,250,252,.88); }
      .t5__side { display:grid; gap:14px; }
      .t5__photo-wrap { padding:14px; border-radius:30px; background:linear-gradient(180deg,#f5f7fb 0%,#e8edf5 100%); border:1px solid rgba(17,24,39,.08); }
      .t5__photo { width:100%; aspect-ratio:4 / 5; object-fit:cover; border-radius:22px; display:block; }
      .t5__location { padding:16px 18px; border-radius:22px; background:#f6efe7; border:1px solid rgba(124,58,28,.1); }
      .t5__location strong { display:block; font-size:.76rem; text-transform:uppercase; letter-spacing:.12em; color:#9a5d37; margin-bottom:6px; }
      .t5__contact-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
      .t5__contact { display:grid; gap:4px; min-height:84px; padding:14px 16px; border-radius:20px; border:1px solid rgba(17,24,39,.1); background:#fff; text-decoration:none; }
      .t5__contact span { color:#6b7280; font-size:.9rem; }
      .t5__sections { display:grid; gap:16px; }
      .t5__section { display:grid; grid-template-columns:180px 1fr; gap:16px; padding:18px; border-radius:26px; border:1px solid rgba(17,24,39,.1); background:#fff; }
      .t5__section:nth-child(odd) { background:linear-gradient(180deg,#fff 0%,#f8fafc 100%); }
      .t5__section:nth-child(even) { background:linear-gradient(180deg,#fff8f3 0%,#fff 100%); }
      .t5__section-head { display:grid; gap:8px; align-content:start; }
      .t5__index { width:42px; height:42px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; background:#1f3a5f; color:#fff; font-weight:700; }
      .t5__section-head h2 { font-size:1rem; letter-spacing:.02em; }
      .t5__items { display:grid; gap:14px; }
      .t5__item { display:grid; gap:8px; padding-bottom:14px; border-bottom:1px dashed rgba(17,24,39,.14); }
      .t5__item:last-child { padding-bottom:0; border-bottom:0; }
      .t5__item-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .t5__item-title { font-weight:700; }
      .t5__item-subtitle { color:#6b7280; margin-top:2px; }
      .t5__item-meta { text-align:right; white-space:nowrap; color:#6b7280; font-size:.92rem; }
      @media (max-width: 960px) {
        .t5__hero, .t5__contact-grid, .t5__section { grid-template-columns:1fr; }
        .t5__item-top { flex-direction:column; }
        .t5__item-meta { text-align:left; white-space:normal; }
      }
    </style>
    <div class="t5">
      <header class="t5__hero">
        <section class="t5__intro">
          <div class="t5__eyebrow">Signal Stack</div>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="t5__headline">${escapeHtml(profile.position)}</p>
          <p class="t5__summary">${escapeHtml(profile.introduction)}</p>
        </section>
        <section class="t5__side">
          <div class="t5__photo-wrap">
            <img class="t5__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)}">
          </div>
          <div class="t5__location">
            <strong>Location</strong>
            <p>${escapeHtml(profile.location)}</p>
          </div>
        </section>
      </header>

      <section class="t5__contact-grid">
        ${contacts.map((item) => `
          <a class="t5__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.value)}</span>
          </a>
        `).join("")}
      </section>

      <section class="t5__sections">
        ${sections.map((section, index) => `
          <section class="t5__section">
            <div class="t5__section-head">
              <div class="t5__index">${String(index + 1).padStart(2, "0")}</div>
              <h2>${escapeHtml(section.heading)}</h2>
            </div>
            <div class="t5__items">
              ${section.entries.map((entry) => {
                const meta = getEntryMeta(entry);
                return `
                  <article class="t5__item">
                    <div class="t5__item-top">
                      <div>
                        <div class="t5__item-title">${escapeHtml(getEntryTitle(entry))}</div>
                        ${getEntrySubtitle(entry) ? `<div class="t5__item-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}
                      </div>
                      <div class="t5__item-meta">
                        ${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}
                        ${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}
                      </div>
                    </div>
                    ${formatDescription(entry.description)}
                  </article>
                `;
              }).join("")}
            </div>
          </section>
        `).join("")}
      </section>
    </div>
  `;
}

export const renderTemplate = renderSignalStackTemplate;

function getSections(data) { return Object.entries(data?.sections ?? {}).map(([key, items]) => ({ heading: (Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key, entries: (Array.isArray(items) ? items.filter((item) => !item["show head"]) : []) })).filter((section) => section.entries.length); }
function getContactItems(contacts) { const list=[]; if (contacts.Email) list.push({ label:"Email", value:contacts.Email, url:`mailto:${contacts.Email}` }); if (contacts.Phone) list.push({ label:"Phone", value:contacts.Phone, url:`tel:${contacts.Phone}` }); for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) list.push({ label:link.label || "Link", value:link.text || link.url || "", url:link.url || "#" }); return list; }
function getEntryTitle(entry) { return pick(entry, ["company","school,institution","title","name","category"]) || "Entry"; }
function getEntrySubtitle(entry) { return pick(entry, ["position","major/degree","organization","publisher","team/organization","role","issuing organization","Writer"]); }
function getEntryMeta(entry) { return { primary: pick(entry, ["period/date","date","startDate"]), secondary: pick(entry, ["location","Location","issuing location","url"]) }; }
function formatDescription(text) { const lines=String(text || "").split("\n").map((line) => line.trim()).filter(Boolean); if (!lines.length) return ""; const bullets=lines.filter((line) => line.startsWith("- ")); if (bullets.length === lines.length) return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`; return `<p>${escapeHtml(text)}</p>`; }
function pick(source, keys) { for (const key of keys) if (source?.[key]) return source[key]; return ""; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
