import { loadTemplateRenderer } from "../template-loader.js";
import { createInfoModal, iconImage } from "../ui.js";

export async function renderLanding(app, renderTopbar, entries) {
  const sourceEntries = Array.isArray(entries) ? entries : [];
  const templateCards = sourceEntries
    .filter((item) => item.fileName.toLowerCase().includes("template"))
    .map(createTemplateCardData);
  const dataFiles = sourceEntries
    .filter((item) => !item.fileName.toLowerCase().includes("template"))
    .map((item) => item.fileName);

  const infoModal = createInfoModal();

  app.innerHTML = `
    ${renderTopbar({
      actions: `
        <div class="menu-anchor">
          <button class="ghost-button icon-button" type="button" aria-label="설정" title="설정">
            ${iconImage("./assets/img/icons/top-manage.gif", "설정")}
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item" type="button">환경설정</button>
            <button class="dropdown-item" type="button" data-action="open-info">정보</button>
          </div>
        </div>
      `,
    })}
    <main class="shell hero">
      <section class="hero-panel">
        <h1>One Source, Multi Resume.</h1>
        <p class="hero-copy">
          하나의 JSON 소스로 여러 이력서 템플릿을 렌더링하는 정적 워크플로우입니다.<br>
          아래 목록에서 템플릿 샘플과 일반 데이터를 바로 열거나 편집할 수 있습니다.
        </p>
      </section>

      <section class="grid landing-grid">
        <section class="panel landing-full">
          <h3>Template</h3>
          ${templateCards.length ? `
            <div class="template-rail">
              ${templateCards.map((item) => `
                <article class="template-portrait">
                  <a class="template-portrait-link" href="./index.html?resume=${encodeURIComponent(item.file)}" aria-label="${item.file}">
                    <div class="template-portrait-preview">
                      <div class="template-portrait-canvas" data-preview-id="${encodeURIComponent(item.file)}"></div>
                    </div>
                    <div class="template-portrait-meta">
                      <div class="template-meta-card">
                        <strong>${item.templateId}</strong>
                        ${item.description ? `<p>${item.description}</p>` : ""}
                      </div>
                      <div class="template-meta-card template-meta-card-secondary">
                        <span>${item.file}</span>
                      </div>
                    </div>
                  </a>
                </article>
              `).join("")}
            </div>
          ` : `<div class="path-card"><p class="muted">template가 파일명에 포함된 데이터가 없습니다.</p></div>`}

          <h3 style="margin-top: 24px;">Data</h3>
          ${dataFiles.length ? `
            <div class="template-rail data-rail">
              ${dataFiles.map((name) => `
                <article class="template-portrait data-portrait">
                  <a class="template-portrait-link" href="./index.html?resume=${encodeURIComponent(name)}" aria-label="${name}">
                    <div class="template-portrait-preview data-portrait-preview">
                      <div class="data-preview-mock">
                        <div class="data-preview-bar data-preview-bar-short"></div>
                        <div class="data-preview-bar"></div>
                        <div class="data-preview-bar data-preview-bar-mid"></div>
                        <div class="data-preview-grid">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <div class="template-portrait-meta">
                      <div class="template-meta-card template-meta-card-secondary template-meta-card-single">
                        <span>${name}</span>
                      </div>
                    </div>
                  </a>
                </article>
              `).join("")}
            </div>
          ` : `<div class="path-card"><p class="muted">template가 파일명에 없는 데이터가 없습니다.</p></div>`}
        </section>
      </section>
    </main>
  `;
  app.append(infoModal);

  const openInfoButton = app.querySelector("[data-action='open-info']");
  const closeInfoButtons = app.querySelectorAll("[data-action='close-info']");

  openInfoButton.addEventListener("click", () => {
    infoModal.hidden = false;
    infoModal.setAttribute("aria-hidden", "false");
  });

  closeInfoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      infoModal.hidden = true;
      infoModal.setAttribute("aria-hidden", "true");
    });
  });

  await Promise.all(templateCards.map(async (item) => {
    const previewRoot = app.querySelector(`[data-preview-id="${cssEscapeValue(encodeURIComponent(item.file))}"]`);
    if (!previewRoot || !item.data) {
      if (previewRoot) {
        previewRoot.classList.add("is-empty");
        previewRoot.innerHTML = `<div class="template-preview-empty">Preview unavailable</div>`;
      }
      return;
    }

    try {
      const renderTemplate = await loadTemplateRenderer(item.templateId);
      const previewFrame = document.createElement("div");
      previewFrame.className = "template-portrait-frame";
      renderTemplate(previewFrame, item.data, { fileName: item.file, embedded: true, preview: true });
      previewRoot.replaceChildren(previewFrame);
    } catch {
      previewRoot.classList.add("is-empty");
      previewRoot.innerHTML = `<div class="template-preview-empty">Preview unavailable</div>`;
    }
  }));
}

function createTemplateCardData(entry) {
  const file = entry.fileName;
  const data = entry.data;

  return {
    file,
    templateId: data?.meta?.template || "template",
    description: data?.meta?.template_desc || "",
    data,
  };
}

function cssEscapeValue(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
