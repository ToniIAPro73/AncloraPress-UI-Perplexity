import jsPDF from "jspdf"

interface BookTemplate {
  id: string
  name: string
  fonts: {
    title: { family: string; size: number; weight: string }
    subtitle: { family: string; size: number; weight: string }
    body: { family: string; size: number; lineHeight: number }
    chapter: { family: string; size: number; weight: string }
  }
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
  }
  layout: {
    margins: { top: number; right: number; bottom: number; left: number }
    pageSize: "A4" | "A5" | "Letter"
    columns: number
    spacing: {
      paragraph: number
      chapter: number
      section: number
    }
  }
  styles: {
    dropCap: boolean
    pageNumbers: boolean
    headers: boolean
    footers: boolean
  }
}

const templates: Record<string, BookTemplate> = {
  modern: {
    id: "modern",
    name: "Moderno",
    fonts: {
      title: { family: "Inter", size: 24, weight: "bold" },
      subtitle: { family: "Inter", size: 16, weight: "normal" },
      body: { family: "Inter", size: 11, lineHeight: 1.6 },
      chapter: { family: "Inter", size: 18, weight: "bold" },
    },
    colors: {
      primary: "#006EE6",
      secondary: "#00B8D9",
      text: "#1F2933",
      background: "#FFFFFF",
    },
    layout: {
      margins: { top: 25, right: 20, bottom: 25, left: 20 },
      pageSize: "A4",
      columns: 1,
      spacing: {
        paragraph: 6,
        chapter: 20,
        section: 12,
      },
    },
    styles: {
      dropCap: false,
      pageNumbers: true,
      headers: true,
      footers: false,
    },
  },
  classic: {
    id: "classic",
    name: "Clásico",
    fonts: {
      title: { family: "Times", size: 26, weight: "bold" },
      subtitle: { family: "Times", size: 18, weight: "normal" },
      body: { family: "Times", size: 12, lineHeight: 1.8 },
      chapter: { family: "Times", size: 20, weight: "bold" },
    },
    colors: {
      primary: "#2D3748",
      secondary: "#4A5568",
      text: "#1A202C",
      background: "#FFFFFF",
    },
    layout: {
      margins: { top: 30, right: 25, bottom: 30, left: 25 },
      pageSize: "A4",
      columns: 1,
      spacing: {
        paragraph: 8,
        chapter: 25,
        section: 15,
      },
    },
    styles: {
      dropCap: true,
      pageNumbers: true,
      headers: true,
      footers: true,
    },
  },
  creative: {
    id: "creative",
    name: "Creativo",
    fonts: {
      title: { family: "Helvetica", size: 22, weight: "bold" },
      subtitle: { family: "Helvetica", size: 14, weight: "normal" },
      body: { family: "Helvetica", size: 10, lineHeight: 1.5 },
      chapter: { family: "Helvetica", size: 16, weight: "bold" },
    },
    colors: {
      primary: "#E53E3E",
      secondary: "#F56565",
      text: "#2D3748",
      background: "#FFFFFF",
    },
    layout: {
      margins: { top: 20, right: 15, bottom: 20, left: 15 },
      pageSize: "A4",
      columns: 2,
      spacing: {
        paragraph: 5,
        chapter: 18,
        section: 10,
      },
    },
    styles: {
      dropCap: false,
      pageNumbers: true,
      headers: false,
      footers: true,
    },
  },
}

interface BookData {
  title: string
  subtitle?: string
  author: string
  content: string
  template: string
  coverImage?: string
  coverColor: string
}

export class PDFGenerator {
  private doc: jsPDF
  private template: BookTemplate
  private currentY = 0
  private pageNumber = 1
  private bookData: BookData

  constructor(bookData: BookData) {
    this.bookData = bookData
    this.template = templates[bookData.template] || templates.modern

    // Initialize jsPDF with template settings
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: this.template.layout.pageSize.toLowerCase() as any,
    })

    this.currentY = this.template.layout.margins.top
  }

  async generatePDF(): Promise<Blob> {
    try {
      // Generate cover page
      await this.generateCoverPage()

      // Add new page for content
      this.addNewPage()

      // Generate table of contents
      this.generateTableOfContents()

      // Add new page for main content
      this.addNewPage()

      // Generate content pages
      await this.generateContentPages()

      // Return PDF as blob
      return new Blob([this.doc.output("blob")], { type: "application/pdf" })
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw new Error("Failed to generate PDF")
    }
  }

  private async generateCoverPage(): Promise<void> {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()

    // Set background color
    this.doc.setFillColor(this.hexToRgb(this.bookData.coverColor))
    this.doc.rect(0, 0, pageWidth, pageHeight, "F")

    // Add cover image if exists
    if (this.bookData.coverImage) {
      try {
        // Convert base64 image to canvas and add to PDF
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = this.bookData.coverImage!
        })

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imgData = canvas.toDataURL("image/jpeg", 0.8)
        this.doc.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST")

        // Add overlay for text readability
        this.doc.setFillColor(0, 0, 0, 0.3)
        this.doc.rect(0, 0, pageWidth, pageHeight, "F")
      } catch (error) {
        console.warn("Failed to add cover image:", error)
      }
    }

    // Add title
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(28)

    const titleLines = this.doc.splitTextToSize(this.bookData.title, pageWidth - 40)
    const titleHeight = titleLines.length * 10
    const titleY = pageHeight * 0.6

    titleLines.forEach((line: string, index: number) => {
      const textWidth = this.doc.getTextWidth(line)
      const x = (pageWidth - textWidth) / 2
      this.doc.text(line, x, titleY + index * 10)
    })

    // Add subtitle
    if (this.bookData.subtitle) {
      this.doc.setFontSize(16)
      this.doc.setFont("helvetica", "normal")

      const subtitleLines = this.doc.splitTextToSize(this.bookData.subtitle, pageWidth - 40)
      const subtitleY = titleY + titleHeight + 15

      subtitleLines.forEach((line: string, index: number) => {
        const textWidth = this.doc.getTextWidth(line)
        const x = (pageWidth - textWidth) / 2
        this.doc.text(line, x, subtitleY + index * 6)
      })
    }

    // Add author
    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "normal")
    const authorY = pageHeight * 0.85
    const authorWidth = this.doc.getTextWidth(this.bookData.author)
    const authorX = (pageWidth - authorWidth) / 2
    this.doc.text(this.bookData.author, authorX, authorY)

    // Add publisher
    this.doc.setFontSize(10)
    const publisherY = pageHeight - 20
    const publisherText = "ANCLORA PRESS"
    const publisherWidth = this.doc.getTextWidth(publisherText)
    const publisherX = (pageWidth - publisherWidth) / 2
    this.doc.text(publisherText, publisherX, publisherY)
  }

  private generateTableOfContents(): void {
    const chapters = this.extractChapters()

    if (chapters.length === 0) return

    this.doc.setTextColor(this.hexToRgb(this.template.colors.text))
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(20)

    this.doc.text("Índice", this.template.layout.margins.left, this.currentY)
    this.currentY += 15

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(12)

    chapters.forEach((chapter, index) => {
      const pageNum = index + 3 // Approximate page numbers
      const dots = ".".repeat(50)
      const line = `${chapter.title} ${dots} ${pageNum}`

      this.doc.text(chapter.title, this.template.layout.margins.left, this.currentY)

      // Add page number aligned to right
      const pageNumWidth = this.doc.getTextWidth(pageNum.toString())
      const pageWidth = this.doc.internal.pageSize.getWidth()
      this.doc.text(pageNum.toString(), pageWidth - this.template.layout.margins.right - pageNumWidth, this.currentY)

      this.currentY += 8

      if (this.currentY > this.doc.internal.pageSize.getHeight() - this.template.layout.margins.bottom) {
        this.addNewPage()
      }
    })
  }

  private async generateContentPages(): Promise<void> {
    const content = this.parseMarkdownContent(this.bookData.content)

    for (const element of content) {
      await this.renderContentElement(element)

      // Check if we need a new page
      if (this.currentY > this.doc.internal.pageSize.getHeight() - this.template.layout.margins.bottom - 20) {
        this.addNewPage()
      }
    }
  }

  private parseMarkdownContent(content: string): Array<{
    type: "h1" | "h2" | "h3" | "p" | "quote" | "divider"
    content: string
    level?: number
  }> {
    const lines = content.split("\n")
    const elements: Array<any> = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith("# ")) {
        elements.push({ type: "h1", content: line.substring(2), level: 1 })
      } else if (line.startsWith("## ")) {
        elements.push({ type: "h2", content: line.substring(3), level: 2 })
      } else if (line.startsWith("### ")) {
        elements.push({ type: "h3", content: line.substring(4), level: 3 })
      } else if (line === "---") {
        elements.push({ type: "divider", content: "" })
      } else if (line.startsWith("*") && line.endsWith("*") && line.length > 2) {
        elements.push({ type: "quote", content: line.slice(1, -1) })
      } else if (line.length > 0) {
        elements.push({ type: "p", content: line })
      }
    }

    return elements
  }

  private async renderContentElement(element: any): Promise<void> {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const textWidth = pageWidth - this.template.layout.margins.left - this.template.layout.margins.right

    switch (element.type) {
      case "h1":
        this.currentY += this.template.layout.spacing.chapter
        this.doc.setFont("helvetica", this.template.fonts.chapter.weight as any)
        this.doc.setFontSize(this.template.fonts.chapter.size)
        this.doc.setTextColor(this.hexToRgb(this.template.colors.primary))

        const h1Lines = this.doc.splitTextToSize(element.content, textWidth)
        h1Lines.forEach((line: string, index: number) => {
          this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 8)
        })
        this.currentY += h1Lines.length * 8 + this.template.layout.spacing.section
        break

      case "h2":
        this.currentY += this.template.layout.spacing.section
        this.doc.setFont("helvetica", "bold")
        this.doc.setFontSize(16)
        this.doc.setTextColor(this.hexToRgb(this.template.colors.text))

        const h2Lines = this.doc.splitTextToSize(element.content, textWidth)
        h2Lines.forEach((line: string, index: number) => {
          this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 6)
        })
        this.currentY += h2Lines.length * 6 + 8
        break

      case "h3":
        this.currentY += 8
        this.doc.setFont("helvetica", "bold")
        this.doc.setFontSize(14)
        this.doc.setTextColor(this.hexToRgb(this.template.colors.text))

        const h3Lines = this.doc.splitTextToSize(element.content, textWidth)
        h3Lines.forEach((line: string, index: number) => {
          this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 5)
        })
        this.currentY += h3Lines.length * 5 + 6
        break

      case "p":
        this.doc.setFont("helvetica", "normal")
        this.doc.setFontSize(this.template.fonts.body.size)
        this.doc.setTextColor(this.hexToRgb(this.template.colors.text))

        const pLines = this.doc.splitTextToSize(element.content, textWidth)

        // Drop cap for first paragraph of chapter (classic template)
        if (this.template.styles.dropCap && element.content.length > 0) {
          const firstChar = element.content.charAt(0)
          const restOfFirstLine = pLines[0].substring(1)

          // Draw drop cap
          this.doc.setFont("helvetica", "bold")
          this.doc.setFontSize(36)
          this.doc.text(firstChar, this.template.layout.margins.left, this.currentY + 12)

          // Draw rest of text
          this.doc.setFont("helvetica", "normal")
          this.doc.setFontSize(this.template.fonts.body.size)
          this.doc.text(restOfFirstLine, this.template.layout.margins.left + 12, this.currentY)

          // Draw remaining lines
          for (let i = 1; i < pLines.length; i++) {
            this.doc.text(pLines[i], this.template.layout.margins.left, this.currentY + i * 5)
          }
        } else {
          pLines.forEach((line: string, index: number) => {
            this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 5)
          })
        }

        this.currentY += pLines.length * 5 + this.template.layout.spacing.paragraph
        break

      case "quote":
        this.currentY += 5
        this.doc.setFont("helvetica", "italic")
        this.doc.setFontSize(this.template.fonts.body.size - 1)
        this.doc.setTextColor(this.hexToRgb(this.template.colors.secondary))

        // Draw quote border
        this.doc.setDrawColor(this.hexToRgb(this.template.colors.primary))
        this.doc.setLineWidth(0.5)
        this.doc.line(
          this.template.layout.margins.left,
          this.currentY - 3,
          this.template.layout.margins.left,
          this.currentY + 10,
        )

        const quoteLines = this.doc.splitTextToSize(element.content, textWidth - 10)
        quoteLines.forEach((line: string, index: number) => {
          this.doc.text(line, this.template.layout.margins.left + 5, this.currentY + index * 5)
        })
        this.currentY += quoteLines.length * 5 + 8
        break

      case "divider":
        this.currentY += 10
        this.doc.setDrawColor(this.hexToRgb(this.template.colors.secondary))
        this.doc.setLineWidth(0.3)
        this.doc.line(
          this.template.layout.margins.left + textWidth * 0.3,
          this.currentY,
          this.template.layout.margins.left + textWidth * 0.7,
          this.currentY,
        )
        this.currentY += 10
        break
    }
  }

  private addNewPage(): void {
    this.doc.addPage()
    this.pageNumber++
    this.currentY = this.template.layout.margins.top

    // Add header
    if (this.template.styles.headers && this.pageNumber > 1) {
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(9)
      this.doc.setTextColor(150, 150, 150)
      this.doc.text(this.bookData.title, this.template.layout.margins.left, 15)
    }

    // Add page number
    if (this.template.styles.pageNumbers && this.pageNumber > 1) {
      const pageWidth = this.doc.internal.pageSize.getWidth()
      const pageHeight = this.doc.internal.pageSize.getHeight()
      const pageNumText = this.pageNumber.toString()
      const pageNumWidth = this.doc.getTextWidth(pageNumText)

      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      this.doc.setTextColor(100, 100, 100)

      if (this.template.styles.footers) {
        // Center page number in footer
        this.doc.text(pageNumText, (pageWidth - pageNumWidth) / 2, pageHeight - 15)
      } else {
        // Right-align page number in header
        this.doc.text(pageNumText, pageWidth - this.template.layout.margins.right - pageNumWidth, 15)
      }
    }
  }

  private extractChapters(): Array<{ title: string; page: number }> {
    const lines = this.bookData.content.split("\n")
    const chapters: Array<{ title: string; page: number }> = []

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        chapters.push({
          title: line.substring(2).trim(),
          page: Math.floor(index / 30) + 3, // Rough page estimation
        })
      }
    })

    return chapters
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
      : [0, 0, 0]
  }
}
