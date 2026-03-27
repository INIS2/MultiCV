export async function loadResumeSource(fileName) {
  if (fileName.endsWith(".zip")) {
    throw new Error("ZIP 데이터 로딩은 아직 구현하지 않았습니다. 현재는 JSON 파일만 바로 열 수 있습니다.");
  }

  const url = `./data/${encodeURIComponent(fileName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${fileName} 파일을 찾지 못했습니다.`);
  }

  return {
    text: await response.text(),
    url,
  };
}

export async function discoverResumeEntries() {
  const candidates = buildResumeCandidates();
  const entries = await Promise.all(candidates.map(loadCandidateEntry));
  return entries.filter(Boolean);
}

export function parseResume(text, fileName) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${fileName} 파싱에 실패했습니다. JSON 문법을 확인해 주세요.`);
  }
}

export function downloadText(fileName, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function buildResumeCandidates() {
  const files = [];
  const templateNames = [
    "classic-column",
    "board-grid",
    "sidebar-timeline",
    "magazine-block",
    "signal-stack",
  ];

  for (let index = 1; index <= 12; index += 1) {
    files.push(`resume${index}.json`);
  }

  for (const templateName of templateNames) {
    files.push(`(Template) ${templateName}.json`);
  }

  return [...new Set(files)];
}

async function loadCandidateEntry(fileName) {
  try {
    const response = await fetch(`./data/${encodeURIComponent(fileName)}`);
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    const data = JSON.parse(text);
    return { fileName, data };
  } catch {
    return null;
  }
}
