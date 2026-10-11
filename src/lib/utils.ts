export { cn } from "cn";

export function generateLinkId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `lnk_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `lnk_${Date.now()}`;
}
