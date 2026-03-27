export function renderTopbar(options = {}) {
  const actions = options.actions ? `<div class="topbar-actions">${options.actions}</div>` : '<div class="topbar-actions"></div>';
  return `
    <header class="topbar">
      <div class="shell topbar-inner">
        <a class="brand-link" href="./index.html" aria-label="MultiCV 홈">
          <img class="brand-logo" src="./assets/img/brand/logo.png" alt="MultiCV 로고">
          <span class="brand-text">
            <span class="brand-name">MultiCV</span>
            <span class="brand-tag">One Source, Multi Resume</span>
          </span>
        </a>
        ${actions}
      </div>
    </header>
  `;
}

export function createInfoModal() {
  const infoModal = document.createElement("section");
  infoModal.className = "modal";
  infoModal.hidden = true;
  infoModal.setAttribute("aria-hidden", "true");
  infoModal.innerHTML = `
    <div class="modal-backdrop" data-action="close-info"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
      <div class="modal-head">
        <div>
          <h2 id="info-modal-title">정보</h2>
          <p>프로젝트 라이선스와 저장소 주소입니다.</p>
        </div>
        <button class="modal-close" type="button" data-action="close-info" aria-label="닫기">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-card">
          <strong>License</strong>
          <p>Apache License 2.0</p>
        </div>
        <div class="modal-card">
          <strong>GitHub</strong>
          <p><a href="https://github.com/INIS2/MultiCV" target="_blank" rel="noreferrer noopener">https://github.com/INIS2/MultiCV</a></p>
        </div>
      </div>
    </div>
  `;
  return infoModal;
}

export function iconImage(src, alt) {
  const staticSrc = src.replace(".gif", ".png");
  return `
    <span class="icon-stack" aria-hidden="true">
      <img class="icon-static" src="${staticSrc}" alt="">
      <img class="icon-animated" src="${src}" alt="">
    </span>
  `;
}
