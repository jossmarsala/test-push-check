export { cn } from "cn"

/**
 * Standard currency formatter for Argentine Pesos ($).
 * e.g., 15000 -> "$15.000", 15000.5 -> "$15.000,50"
 */
export function formatCurrency(
  val: number | undefined | null,
  options?: { showDecimals?: boolean }
): string {
  if (val === undefined || val === null || isNaN(val)) return '$0'
  const hasDecimals = options?.showDecimals ?? (val % 1 !== 0)
  return `$${val.toLocaleString('es-AR', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Standard date converter for HTML5 <input type="date"> (YYYY-MM-DD).
 */
export function toIsoDateInput(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  const clean = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean
  const parts = clean.split(/[-/]/)
  if (parts.length === 3) {
    if (parts[0].length <= 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
    }
  }
  return new Date().toISOString().split('T')[0]
}

/**
 * Converts ISO (YYYY-MM-DD) or other date strings into standard Argentine display format (DD-MM-YYYY).
 */
export function formatDateDisplay(isoStr?: string): string {
  if (!isoStr) return ''
  const clean = isoStr.trim()
  const parts = clean.split('-')
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return clean
}

