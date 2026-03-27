export function renderTestTemplate(root, data) {
  const profile = data?.profile?.top ?? {};
  const contacts = getContactItems(data?.profile?.Contact ?? {});
  const sections = getSections(data);

  root.innerHTML = `
    <style>
      .t1 { color: #1b1712; }
      .t1 * { box-sizing: border-box; }
      .t1 h1, .t1 h2, .t1 p { margin: 0; }
      .t1 a { color: inherit; }
      .t1 ul { margin: 0; padding-left: 18px; }
      .t1__hero { display:grid; grid-template-columns:120px 1fr; gap:24px; align-items:start; padding-bottom:28px; border-bottom:1px solid rgba(40,34,24,.14); }
      .t1__photo { width:120px; height:120px; border-radius:28px; object-fit:cover; border:1px solid rgba(40,34,24,.14); background:#e8dfcf; }
      .t1__kicker { color:#a34f2f; font-weight:700; letter-spacing:.08em; text-transform:uppercase; font-size:.78rem; }
      .t1__hero h1 { margin:18px 0 12px; font-family:"Fraunces", serif; font-size:clamp(2.3rem,4vw,4.2rem); line-height:.95; letter-spacing:-.04em; }
      .t1__headline { display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center; color:#645a4f; }
      .t1__summary { margin-top:10px; color:#645a4f; }
      .t1__contacts { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
      .t1__contact { display:inline-flex; gap:8px; align-items:center; padding:9px 14px; border-radius:999px; border:1px solid rgba(40,34,24,.14); background:#fffdf8; text-decoration:none; }
      .t1__sections { display:grid; gap:30px; padding-top:28px; }
      .t1__section { display:grid; grid-template-columns:180px 1fr; gap:18px; }
      .t1__title { color:#a34f2f; font-size:.88rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
      .t1__items { display:grid; gap:18px; }
      .t1__entry { display:grid; gap:8px; padding-bottom:18px; border-bottom:1px solid rgba(40,34,24,.14); }
      .t1__entry:last-child { padding-bottom:0; border-bottom:0; }
      .t1__entry-top { display:flex; justify-content:space-between; gap:16px; align-items:start; }
      .t1__entry-title { font-weight:700; font-size:1.02rem; }
      .t1__entry-subtitle { color:#645a4f; margin-top:-2px; }
      .t1__entry-meta { color:#645a4f; text-align:right; white-space:nowrap; font-size:.94rem; }
      @media (max-width: 960px) {
        .t1__hero, .t1__section { grid-template-columns:1fr; }
        .t1__entry-top { flex-direction:column; }
        .t1__entry-meta { text-align:left; white-space:normal; }
      }
    </style>
    <div class="t1">
      <header class="t1__hero">
        <img class="t1__photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name || "프로필 사진")}">
        <div>
          <div class="t1__kicker">Resume</div>
          <h1>${escapeHtml(profile.name || "이름 없음")}</h1>
          <div class="t1__headline">
            <p>${escapeHtml(profile.position)}</p>
            <p>${escapeHtml(profile.location)}</p>
          </div>
          <p class="t1__summary">${escapeHtml(profile.introduction)}</p>
          <div class="t1__contacts">
            ${contacts.map((item) => `<a class="t1__contact" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></a>`).join("")}
          </div>
        </div>
      </header>
      <section class="t1__sections">
        ${sections.map((section) => `
          <section class="t1__section">
            <div class="t1__title">${escapeHtml(section.heading)}</div>
            <div class="t1__items">
              ${section.entries.map(renderEntry).join("")}
            </div>
          </section>
        `).join("")}
      </section>
    </div>
  `;
}

export const renderTemplate = renderTestTemplate;

function renderEntry(entry) {
  const meta = getEntryMeta(entry);
  return `
    <article class="t1__entry">
      <div class="t1__entry-top">
        <div>
          <div class="t1__entry-title">${escapeHtml(getEntryTitle(entry))}</div>
          ${getEntrySubtitle(entry) ? `<div class="t1__entry-subtitle">${escapeHtml(getEntrySubtitle(entry))}</div>` : ""}
        </div>
        <div class="t1__entry-meta">
          ${meta.primary ? `<div>${escapeHtml(meta.primary)}</div>` : ""}
          ${meta.secondary ? `<div>${escapeHtml(meta.secondary)}</div>` : ""}
        </div>
      </div>
      ${formatDescription(entry.description)}
    </article>
  `;
}

function getSections(data) {
  return Object.entries(data?.sections ?? {}).map(([key, items]) => ({
    heading: (Array.isArray(items) ? items.find((item) => item["show head"])?.["show head"] : "") || key,
    entries: (Array.isArray(items) ? items.filter((item) => !item["show head"]) : []),
  })).filter((section) => section.entries.length);
}

function getContactItems(contacts) {
  const list = [];
  if (contacts.Email) list.push({ label: "Email", value: contacts.Email, url: `mailto:${contacts.Email}` });
  if (contacts.Phone) list.push({ label: "Phone", value: contacts.Phone, url: `tel:${contacts.Phone}` });
  for (const link of Array.isArray(contacts.Link) ? contacts.Link.filter((item) => !item["show head"]) : []) {
    list.push({ label: link.label || "Link", value: link.text || link.url || "", url: link.url || "#" });
  }
  return list;
}

function getEntryTitle(entry) {
  return pick(entry, ["company", "school,institution", "title", "name", "category"]) || "항목";
}

function getEntrySubtitle(entry) {
  return pick(entry, ["position", "major/degree", "organization", "publisher", "team/organization", "role", "issuing organization", "Writer"]);
}

function getEntryMeta(entry) {
  return {
    primary: pick(entry, ["period/date", "date", "startDate"]),
    secondary: pick(entry, ["location", "Location", "issuing location", "url"]),
  };
}

function formatDescription(text) {
  const lines = String(text || "").split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return "";
  const bullets = lines.filter((line) => line.startsWith("- "));
  if (bullets.length === lines.length) {
    return `<ul>${bullets.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join("")}</ul>`;
  }
  return `<p>${escapeHtml(text)}</p>`;
}

function pick(source, keys) {
  for (const key of keys) if (source?.[key]) return source[key];
  return "";
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
