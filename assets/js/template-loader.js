const templateCache = new Map();

export async function loadTemplateRenderer(templateId) {
  if (!templateId) {
    throw new Error("템플릿 id가 없습니다.");
  }

  if (templateCache.has(templateId)) {
    return templateCache.get(templateId);
  }

  try {
    const module = await import(`../../template/${templateId}.js`);
    const renderer = module.renderTemplate;
    if (typeof renderer !== "function") {
      throw new Error(`${templateId} 템플릿 렌더러를 찾지 못했습니다.`);
    }

    templateCache.set(templateId, renderer);
    return renderer;
  } catch {
    throw new Error(`등록되지 않은 템플릿입니다: ${templateId}`);
  }
}
