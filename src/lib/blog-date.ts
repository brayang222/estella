export function formatPostDate(iso: string): string {
  // Force UTC so a plain "YYYY-MM-DD" date doesn't shift a day back/forward
  // depending on the reader's local timezone.
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
