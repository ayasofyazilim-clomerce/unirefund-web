export function randDigits(len: number) {
  return Array.from({length: len}, () => Math.floor(Math.random() * 10)).join("");
}
export function randGuidLike() {
  const d = (n: number) => randDigits(n);
  return `${d(8)}-${d(4)}-${d(4)}-${d(4)}-${d(12)}`;
}
