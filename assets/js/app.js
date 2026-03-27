import { discoverResumeEntries, loadResumeSource, parseResume } from "./data.js";
import { escapeHtml } from "./helpers.js";
import { renderEditPage } from "./pages/edit.js";
import { renderLanding } from "./pages/landing.js";
import { renderViewPage } from "./pages/view.js";
import { resolveRoute } from "./router.js";
import { renderTopbar } from "./ui.js";

const app = document.querySelector("#app");

bootstrap().catch((error) => {
  console.error(error);
  app.innerHTML = `
    ${renderTopbar({
      actions: `
        <a class="button" href="./index.html">홈으로 이동</a>
      `,
    })}
    <main class="shell hero">
      <section class="hero-panel">
        <span class="eyebrow">Error</span>
        <h1>페이지를 불러오지 못했습니다.</h1>
        <p class="hero-copy">${escapeHtml(error.message)}</p>
      </section>
    </main>
  `;
});

async function bootstrap() {
  const route = resolveRoute(window.location);

  if (route.mode === "landing") {
    const entries = await discoverResumeEntries();
    await renderLanding(app, renderTopbar, entries);
    return;
  }

  const source = await loadResumeSource(route.fileName);

  if (route.mode === "edit") {
    await renderEditPage(app, source, route.fileName);
    return;
  }

  const data = parseResume(source.text, route.fileName);
  await renderViewPage(app, data, route.fileName);
}
