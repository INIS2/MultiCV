import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Static hosting can fetch known files but cannot reliably enumerate directories at runtime.
// Parsing /data or /template HTML listings would depend on host-specific directory indexing,
// which GitHub Pages and similar hosts do not guarantee for app logic.
// This script generates a stable manifest before deploy so the landing page can read one JSON file.
// 정적 호스팅 환경의 브라우저 JS는 파일명을 알고 있는 리소스만 가져올 수 있고,
// 런타임에 data/, template/ 디렉터리 목록을 안정적으로 조회할 수는 없습니다.
// /data, /template의 HTML 목록을 강제로 파싱하는 방식은 호스팅 설정에 의존하므로
// GitHub Pages 같은 환경에서 앱 로직의 기반으로 쓰기 어렵습니다.
// 그래서 배포 전에 이 스크립트로 manifest를 생성하고, 랜딩에서는 그 JSON만 읽습니다.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const templateDir = path.join(rootDir, "template");

async function main() {
  const templateIds = await loadTemplateIds();
  const dataManifest = await buildDataManifest(templateIds);

  await writeJson(path.join(dataDir, "manifest.json"), dataManifest);

  console.log(`Generated ${dataManifest.entries.length} data entries.`);
}

async function loadTemplateIds() {
  const names = await readdir(templateDir);
  return new Set(
    names
      .filter((name) => name.endsWith(".js"))
      .map((name) => path.basename(name, ".js")),
  );
}

async function buildDataManifest(templateIds) {
  const names = await readdir(dataDir);
  const entries = [];

  for (const name of names.sort((left, right) => left.localeCompare(right))) {
    if (!name.endsWith(".json") || name === "manifest.json") {
      continue;
    }

    const fullPath = path.join(dataDir, name);
    const text = await readFile(fullPath, "utf8");
    const data = JSON.parse(text);
    const templateId = data?.meta?.template ?? null;

    entries.push({
      fileName: name,
      kind: inferEntryKind(name),
      templateId,
      templateDescription: data?.meta?.template_desc ?? "",
      title: data?.profile?.top?.name || data?.meta?.title || name,
      templateExists: templateId ? templateIds.has(templateId) : false,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    entries,
  };
}

function inferEntryKind(fileName) {
  return fileName.toLowerCase().includes("(template)") ? "template" : "resume";
}

async function writeJson(targetPath, value) {
  await writeFile(targetPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
