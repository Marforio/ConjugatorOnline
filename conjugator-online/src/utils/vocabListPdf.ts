import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export interface VocabPdfItem {
  term: string
  definition?: string | null
  additional_data?: Record<string, any> | null
}

interface ExportVocabListPdfOptions {
  title: string
  items: VocabPdfItem[]
  isIrregularVerbs?: boolean
  filenameSuffix?: string
}

type PdfRow = {
  term: string
  past_forms?: string
  definition: string
  French: string
  German: string
  Italian: string
}

function asStringArray(x: any): string[] {
  if (Array.isArray(x)) return x.map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof x === "string") return x.split(/[;,/]+/).map((s) => s.trim()).filter(Boolean)
  return []
}

function buildPastForms(item: VocabPdfItem): string {
  const additional = item.additional_data || {}
  const ps = asStringArray(additional.past_simple)
  const pp = asStringArray(additional.present_perfect)

  return ps.length || pp.length
    ? `${ps.join(" / ")}${ps.length && pp.length ? " • " : ""}${pp.join(" / ")}`
    : ""
}

function toPdfRows(items: VocabPdfItem[], isIrregularVerbs: boolean): PdfRow[] {
  return items
    .map((item) => {
      const additional = item.additional_data || {}

      return {
        term: String(item.term ?? "").trim(),
        definition: String(item.definition ?? "").trim(),
        past_forms: isIrregularVerbs ? buildPastForms(item) : "",
        French: String(additional.French ?? "").trim(),
        German: String(additional.German ?? "").trim(),
        Italian: String(additional.Italian ?? "").trim()
      }
    })
    .filter((row) => row.term.length > 0)
    .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }))
}

function fitColumnWidthsToPage(
  doc: jsPDF,
  widths: number[],
  marginLeft: number,
  marginRight: number
) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const available = pageWidth - marginLeft - marginRight
  const sum = widths.reduce((a, b) => a + b, 0)

  if (sum <= available) return widths

  const scale = available / sum
  return widths.map((w) => Math.floor(w * scale))
}

export async function exportVocabListPdf({
  title,
  items,
  isIrregularVerbs = false,
  filenameSuffix = ""
}: ExportVocabListPdfOptions) {
  const marginLeft = 30
  const marginRight = 30

  const rows = toPdfRows(items, isIrregularVerbs)

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  })

  doc.setFontSize(14)
  doc.text(`Vocab list: ${title}`, 40, 40)

  const head = isIrregularVerbs
    ? ["Term", "Past forms", "Definition", "French", "German", "Italian"]
    : ["Term", "Definition", "French", "German", "Italian"]

  const body = rows.map((r) =>
    isIrregularVerbs
      ? [r.term, r.past_forms || "", r.definition, r.French, r.German, r.Italian]
      : [r.term, r.definition, r.French, r.German, r.Italian]
  )

  const idealWidths = isIrregularVerbs
    ? [95, 140, 240, 125, 125, 125]
    : [110, 300, 140, 140, 140]

  const fitted = fitColumnWidthsToPage(doc, idealWidths, marginLeft, marginRight)

  const columnStyles: Record<number, { cellWidth: number }> = {}
  for (let i = 0; i < fitted.length; i++) {
    columnStyles[i] = { cellWidth: fitted[i] }
  }

  autoTable(doc, {
    startY: 60,
    margin: { left: marginLeft, right: marginRight },
    tableWidth: "wrap",
    head: [head],
    body,
    styles: {
      fontSize: 9,
      cellPadding: 4,
      overflow: "linebreak",
      valign: "top"
    },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: 255
    },
    columnStyles
  })

  const safeName = String(title)
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")

  doc.save(`${safeName || "vocab_list"}${filenameSuffix}.pdf`)
}