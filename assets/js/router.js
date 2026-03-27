export function resolveRoute(location) {
  const params = new URLSearchParams(location.search);
  const path = location.pathname.replace(/\\/g, "/");
  const segments = path.split("/").filter(Boolean);
  const last = segments.at(-1) || "";
  const isEditPath = segments.at(-2) === "edit";
  const queryResume = params.get("resume");
  const queryMode = params.get("mode");

  if (queryResume) {
    return {
      mode: queryMode === "edit" ? "edit" : "view",
      fileName: normalizeResumeName(queryResume),
    };
  }

  if (isEditPath && last) {
    return { mode: "edit", fileName: normalizeResumeName(last) };
  }

  if (last && !/\.[a-z0-9]+$/i.test(last) && last.toLowerCase() !== "multicv") {
    return { mode: "view", fileName: normalizeResumeName(last) };
  }

  return { mode: "landing", fileName: null };
}

export function normalizeResumeName(value) {
  return value.endsWith(".json") || value.endsWith(".zip") ? value : `${value}.json`;
}
