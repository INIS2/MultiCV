import { loadTemplateRenderer } from "../template-loader.js";
import { createInfoModal, iconImage } from "../ui.js";

export async function renderLanding(app, renderTopbar, entries) {
  const sourceEntries = Array.isArray(entries) ? entries : [];
  const templateCards = sourceEntries
    .filter((item) => item.manifest?.kind === "template")
    .map(createTemplateCardData);
  const dataFiles = sourceEntries
    .filter((item) => item.manifest?.kind !== "template")
    .map((item) => item.fileName);

  const templateMarkup = templateCards.map((item) => `
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
  `).join("");

  const dataMarkup = dataFiles.map((name) => `
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
  `).join("");

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
            <div class="template-rail marquee-rail">
              <div class="marquee-track">
                <div class="marquee-segment" data-marquee-segment="template-primary">
                  ${templateMarkup}
                </div>
                <div class="marquee-segment" data-marquee-segment="template-clone" aria-hidden="true"></div>
              </div>
            </div>
          ` : `<div class="path-card"><p class="muted">등록된 템플릿 샘플 데이터가 없습니다.</p></div>`}

          <h3 style="margin-top: 24px;">Data</h3>
          ${dataFiles.length ? `
            <div class="template-rail data-rail marquee-rail">
              <div class="marquee-track marquee-track-slow">
                <div class="marquee-segment" data-marquee-segment="data-primary">
                  ${dataMarkup}
                </div>
                <div class="marquee-segment" data-marquee-segment="data-clone" aria-hidden="true"></div>
              </div>
            </div>
          ` : `<div class="path-card"><p class="muted">등록된 일반 데이터가 없습니다.</p></div>`}
        </section>
      </section>
    </main>
  `;

  app.append(infoModal);

  const openInfoButton = app.querySelector("[data-action='open-info']");
  const closeInfoButtons = app.querySelectorAll("[data-action='close-info']");

  openInfoButton?.addEventListener("click", () => {
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

  cloneMarqueeSegment(app, "template-primary", "template-clone");
  cloneMarqueeSegment(app, "data-primary", "data-clone");
  initInteractiveMarquee(app, "template", 0.02);
  initInteractiveMarquee(app, "data", 0.05);
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

function cloneMarqueeSegment(root, sourceId, targetId) {
  const source = root.querySelector(`[data-marquee-segment="${sourceId}"]`);
  const target = root.querySelector(`[data-marquee-segment="${targetId}"]`);
  if (!source || !target) {
    return;
  }

  target.replaceChildren(...Array.from(source.children).map((node) => node.cloneNode(true)));
}

function initInteractiveMarquee(root, segmentName, speed) {
  const rail = root.querySelector(`[data-marquee-segment="${segmentName}-primary"]`)?.closest(".marquee-rail");
  const track = rail?.querySelector(".marquee-track");
  const primary = rail?.querySelector(`[data-marquee-segment="${segmentName}-primary"]`);
  if (!rail || !track || !primary) {
    return;
  }

  let offset = 0;
  let frameId = 0;
  let lastTime = 0;
  let hovering = false;
  let pointerDown = false;
  let dragging = false;
  let pointerId = null;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let suppressClick = false;
  const dragThreshold = 8;

  const getLoopWidth = () => primary.getBoundingClientRect().width;

  const normalizeOffset = () => {
    const loopWidth = getLoopWidth();
    if (!loopWidth) {
      return;
    }
    while (offset >= loopWidth) {
      offset -= loopWidth;
    }
    while (offset < 0) {
      offset += loopWidth;
    }
  };

  const render = () => {
    normalizeOffset();
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const tick = (time) => {
    if (!lastTime) {
      lastTime = time;
    }
    const delta = time - lastTime;
    lastTime = time;

    if (!hovering && !dragging) {
      offset += speed * delta;
      render();
    }

    frameId = window.requestAnimationFrame(tick);
  };

  const stopDrag = () => {
    if (!pointerDown && !dragging) {
      return;
    }

    pointerDown = false;
    dragging = false;
    rail.classList.remove("is-dragging");
    if (pointerId !== null && rail.hasPointerCapture(pointerId)) {
      rail.releasePointerCapture(pointerId);
    }
    pointerId = null;
    hovering = rail.matches(":hover");
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
  };

  rail.addEventListener("mouseenter", () => {
    hovering = true;
  });

  rail.addEventListener("mouseleave", () => {
    if (!dragging) {
      hovering = false;
    }
  });

  rail.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    pointerDown = true;
    dragging = false;
    hovering = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartOffset = offset;
    suppressClick = false;
  });

  rail.addEventListener("pointermove", (event) => {
    if (!pointerDown || pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartX;
    const dragDistance = Math.abs(deltaX);

    if (!dragging && dragDistance <= dragThreshold) {
      return;
    }

    if (!dragging) {
      dragging = true;
      suppressClick = true;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(pointerId);
    }

    event.preventDefault();
    offset = dragStartOffset - deltaX;
    render();
  });

  rail.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    stopDrag();
  });

  rail.addEventListener("pointercancel", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    suppressClick = false;
    stopDrag();
  });

  rail.addEventListener("click", (event) => {
    if (!suppressClick) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }, true);

  rail.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  window.addEventListener("resize", render);
  render();
  frameId = window.requestAnimationFrame(tick);

  rail.addEventListener("remove", () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
  });
}

function cssEscapeValue(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
