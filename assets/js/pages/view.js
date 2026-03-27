import { loadTemplateRenderer } from "../template-loader.js";
import { createInfoModal, iconImage, renderTopbar } from "../ui.js";

export async function renderViewPage(app, data, fileName) {
  const templateId = data?.meta?.template;
  const renderTemplate = await loadTemplateRenderer(templateId);

  const wrapper = document.createElement("main");
  wrapper.className = "shell resume-page";
  const resumeRoot = document.createElement("section");
  resumeRoot.className = "resume-shell";
  renderTemplate(resumeRoot, data, { fileName });

  const infoModal = createInfoModal();

  app.innerHTML = renderTopbar({
    actions: `
      <button class="ghost-button icon-button" type="button" data-action="print" aria-label="인쇄" title="인쇄">
        ${iconImage("./assets/img/icons/top-print.gif", "인쇄")}
      </button>
      <a class="ghost-button icon-button" href="./index.html?resume=${encodeURIComponent(fileName)}&mode=edit" aria-label="편집" title="편집">
        ${iconImage("./assets/img/icons/top-edit.gif", "편집")}
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
  wrapper.append(resumeRoot);
  app.append(wrapper);
  app.append(infoModal);

  const printButton = app.querySelector("[data-action='print']");
  const openInfoButton = app.querySelector("[data-action='open-info']");
  const closeInfoButtons = app.querySelectorAll("[data-action='close-info']");

  printButton.addEventListener("click", () => {
    window.print();
  });

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
}
