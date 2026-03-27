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
  const manifest = await loadDataManifest();
  const fileNames = manifest.entries.map((entry) => entry.fileName);
  const entries = await Promise.all(fileNames.map(loadCandidateEntry));
  const loadedByFileName = new Map(entries.filter(Boolean).map((entry) => [entry.fileName, entry]));

  return manifest.entries
    .map((entry) => {
      const loadedEntry = loadedByFileName.get(entry.fileName);
      if (!loadedEntry) {
        return null;
      }

      return {
        ...loadedEntry,
        manifest: entry,
      };
    })
    .filter(Boolean);
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

async function loadDataManifest() {
  const response = await fetch("./data/manifest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("data/manifest.json 파일을 찾지 못했습니다. 배포 전에 manifest 생성 스크립트를 실행해 주세요.");
  }

  const manifest = await response.json();
  if (!Array.isArray(manifest?.entries)) {
    throw new Error("data/manifest.json 형식이 올바르지 않습니다.");
  }

  return manifest;
}
