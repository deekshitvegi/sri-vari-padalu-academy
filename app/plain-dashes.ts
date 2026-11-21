/**
 * The owner does not want em-dashes on the public site. Saved content can still
 * contain them, so public reads rewrite dashes into plain punctuation:
 * "4:30 PM – 5:30 PM" becomes "4:30 PM to 5:30 PM", and an aside such as
 * "classes — all ages" becomes "classes, all ages".
 */
const EDGE_DASH = /^\s*[—–]\s*|\s*[—–]\s*$/g;
const RANGE_DASH = /(\d(?::\d{2})?(?:\s?[AaPp]\.?[Mm]\.?)?)\s*[—–]\s*(?=\d)/g;
const ASIDE_DASH = /\s*—\s*|\s+–\s+/g;

export function plainDashes(text: string) {
  if (!/[—–]/.test(text)) return text;
  return text
    .replace(EDGE_DASH, "")
    .replace(RANGE_DASH, "$1 to ")
    .replace(ASIDE_DASH, ", ")
    .replaceAll("–", "-");
}

export function withPlainDashes<T>(value: T): T {
  if (typeof value === "string") return plainDashes(value) as T;
  if (Array.isArray(value)) return value.map(withPlainDashes) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withPlainDashes(item)])) as T;
  }
  return value;
}
