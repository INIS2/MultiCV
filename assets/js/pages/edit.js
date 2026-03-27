import { downloadText, parseResume } from "../data.js";
import { debounce } from "../helpers.js";
import { loadTemplateRenderer } from "../template-loader.js";
import { createInfoModal, iconImage, renderTopbar } from "../ui.js";

export async function renderEditPage(app, source, fileName) {
  const container = document.createElement("main");
  container.className = "shell editor-page";
  const infoModal = createInfoModal();

  container.innerHTML = `
    <section class="editor-shell">
      <div class="editor-head">
        <div class="editor-head-copy">
          <span class="eyebrow">Edit Mode</span>
          <h1>${fileName}</h1>
          <p class="muted">정적 사이트라 서버 저장은 하지 않습니다. 수정한 JSON은 검증 후 파일로 내려받을 수 있습니다.</p>
        </div>
        <div class="editor-actions">
          <button class="ghost-button" type="button" data-action="reset">초기화</button>
          <button class="button" type="button" data-action="download">JSON 저장</button>
        </div>
      </div>
      <div class="status" data-role="status">JSON을 불러왔습니다.</div>
      <div class="editor-grid">
        <div class="editor-pane">
          <textarea spellcheck="false"></textarea>
        </div>
        <div class="preview-pane"></div>
      </div>
    </section>
  `;

  app.innerHTML = renderTopbar({
    actions: `
      <button class="ghost-button icon-button" type="button" data-action="download-top" aria-label="다운로드" title="다운로드">
        ${iconImage("./assets/img/icons/top-download.gif", "다운로드")}
      </button>
      <a class="ghost-button icon-button" href="./index.html?resume=${encodeURIComponent(fileName)}" aria-label="뷰" title="뷰">
        ${iconImage("./assets/img/icons/top-view.gif", "뷰")}
      </a>
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
  });
  app.append(container);
  app.append(infoModal);

  const textarea = container.querySelector("textarea");
  const status = container.querySelector("[data-role='status']");
  const preview = container.querySelector(".preview-pane");
  const resetButton = container.querySelector("[data-action='reset']");
  const downloadButton = container.querySelector("[data-action='download']");
  const topDownloadButton = app.querySelector("[data-action='download-top']");
  const openInfoButton = app.querySelector("[data-action='open-info']");
  const closeInfoButtons = app.querySelectorAll("[data-action='close-info']");

  textarea.value = source.text;

  const updatePreview = () => {
    Promise.resolve().then(async () => {
      const data = parseResume(textarea.value, fileName);
      const renderTemplate = await loadTemplateRenderer(data?.meta?.template);

      preview.innerHTML = "";
      const inner = document.createElement("div");
      inner.className = "resume-shell";
      renderTemplate(inner, data, { fileName, embedded: true });
      preview.append(inner);
      status.textContent = "유효한 JSON입니다. 미리보기가 갱신되었습니다.";
      status.className = "status";
    }).catch((error) => {
      preview.innerHTML = "";
      status.textContent = error.message;
      status.className = "status error";
    });
  };

  textarea.addEventListener("input", debounce(updatePreview, 160));

  resetButton.addEventListener("click", () => {
    textarea.value = source.text;
    updatePreview();
    status.textContent = "원본 JSON으로 초기화했습니다.";
    status.className = "status";
  });

  const saveJson = () => {
    try {
      const json = JSON.parse(textarea.value);
      downloadText(fileName, `${JSON.stringify(json, null, 2)}\n`);
      status.textContent = "JSON 파일을 저장했습니다.";
      status.className = "status";
    } catch {
      status.textContent = "유효한 JSON일 때만 다운로드할 수 있습니다.";
      status.className = "status error";
    }
  };

  downloadButton.addEventListener("click", saveJson);
  topDownloadButton.addEventListener("click", saveJson);

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

  updatePreview();
}
