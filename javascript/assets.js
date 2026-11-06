/** Resolve relative asset paths (handles spaces and special characters). */
export function resolveAssetPath(base, assetPath) {
  if (!assetPath) return "";
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  const encoded = assetPath
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : ""))
    .join("/");
  return `${base}${encoded}`;
}
