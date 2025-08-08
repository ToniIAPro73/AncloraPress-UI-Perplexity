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
    this.setFillColorHex(this.bookData.coverColor)
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
        this.doc.setFillColor(0, 0, 0, 0.3 as any)
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
      this.doc.text(line, x, titleY + index * 10, { baseline: "middle" as any })
    })

    // Add subtitle if present
    if (this.bookData.subtitle) {
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(16)
      const subtitleLines = this.doc.splitTextToSize(this.bookData.subtitle, pageWidth - 60)
      subtitleLines.forEach((line: string, index: number) => {
        const textWidth = this.doc.getTextWidth(line)
        const x = (pageWidth - textWidth) / 2
        this.doc.text(line, x, titleY + titleHeight + 10 + index * 8)
      })
    }

    // Add author name
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(14)
    const authorText = `por ${this.bookData.author}`
    const authorWidth = this.doc.getTextWidth(authorText)
    this.doc.text(authorText, (pageWidth - authorWidth) / 2, pageHeight - 30)
  }

  private addNewPage(): void {
    this.doc.addPage()
    this.currentY = this.template.layout.margins.top
  }

  private generateTableOfContents(): void {
    const pageWidth = this.doc.internal.pageSize.getWidth()

    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(18)
    const tocTitle = "Tabla de Contenidos"
    const tocWidth = this.doc.getTextWidth(tocTitle)
    this.doc.text(tocTitle, (pageWidth - tocWidth) / 2, this.currentY)
    this.currentY += 10

    const chapters = this.extractChapters()

    if (chapters.length === 0) return

    this.setTextColorHex(this.template.colors.text)
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(20)

    chapters.forEach((chapter: { title: string; page: number }, index: number) => {
      const chapterTitle = `${index + 1}. ${chapter.title}`
      this.doc.text(chapterTitle, this.template.layout.margins.left, this.currentY)

      const dotsWidth = this.doc.getTextWidth(".") * 50
      const pageNumberX = this.doc.internal.pageSize.getWidth() - this.template.layout.margins.right
      this.doc.text(".".repeat(50), pageNumberX - dotsWidth, this.currentY)
      this.doc.text(chapter.page.toString(), pageNumberX, this.currentY)

      this.currentY += 8
    })

    this.currentY += 10
  }

  private async generateContentPages(): Promise<void> {
    const content = this.bookData.content
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const textWidth = pageWidth - this.template.layout.margins.left - this.template.layout.margins.right

    const elements = this.parseContentToElements(content)

    elements.forEach((element) => {
      if (this.currentY > this.doc.internal.pageSize.getHeight() - this.template.layout.margins.bottom) {
        this.addNewPage()
      }

      switch (element.type) {
        case "h1":
          this.currentY += this.template.layout.spacing.chapter
          this.doc.setFont("helvetica", this.template.fonts.chapter.weight as any)
          this.doc.setFontSize(this.template.fonts.chapter.size)
          this.setTextColorHex(this.template.colors.primary)

          const h1Lines = this.doc.splitTextToSize(element.content, textWidth)
          h1Lines.forEach((line: string, index: number) => {
            this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 10)
          })

          this.currentY += h1Lines.length * 10 + 4
          break

        case "h2":
          this.currentY += this.template.layout.spacing.section
          this.doc.setFont("helvetica", "bold")
          this.doc.setFontSize(16)
          this.setTextColorHex(this.template.colors.text)

          const h2Lines = this.doc.splitTextToSize(element.content, textWidth)
          h2Lines.forEach((line: string, index: number) => {
            this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 8)
          })

          this.currentY += h2Lines.length * 8 + 4
          break

        case "h3":
          this.currentY += 8
          this.doc.setFont("helvetica", "bold")
          this.doc.setFontSize(14)
          this.setTextColorHex(this.template.colors.text)

          const h3Lines = this.doc.splitTextToSize(element.content, textWidth)
          h3Lines.forEach((line: string, index: number) => {
            this.doc.text(line, this.template.layout.margins.left, this.currentY + index * 7)
          })

          this.currentY += h3Lines.length * 7 + 3
          break

        case "p":
          this.doc.setFont("helvetica", "normal")
          this.doc.setFontSize(this.template.fonts.body.size)
          this.setTextColorHex(this.template.colors.text)

          const pLines = this.doc.splitTextToSize(element.content, textWidth)

          pLines.forEach((line: string) => {
            if (this.currentY > this.doc.internal.pageSize.getHeight() - this.template.layout.margins.bottom) {
              this.addNewPage()
            }
            this.doc.text(line, this.template.layout.margins.left, this.currentY)
            this.currentY += this.template.fonts.body.lineHeight * 4
          })
          break

        case "blockquote":
          this.currentY += 5
          this.doc.setFont("helvetica", "italic")
          this.doc.setFontSize(this.template.fonts.body.size - 1)
          this.setTextColorHex(this.template.colors.secondary)

          // Draw quote border
          this.setDrawColorHex(this.template.colors.primary)
          this.doc.setLineWidth(0.5)
          this.doc.line(
            this.template.layout.margins.left,
            this.currentY - 4,
            pageWidth - this.template.layout.margins.right,
            this.currentY - 4
          )

          const quoteLines = this.doc.splitTextToSize(`“${element.content}”`, textWidth * 0.95)
          quoteLines.forEach((line: string) => {
            this.doc.text(line, this.template.layout.margins.left + textWidth * 0.05, this.currentY)
            this.currentY += this.template.fonts.body.lineHeight * 4
          })
          break

        case "divider":
          this.currentY += 10
          this.setDrawColorHex(this.template.colors.secondary)
          this.doc.setLineWidth(0.3)
          this.doc.line(
            this.template.layout.margins.left + textWidth * 0.3,
            this.currentY,
            this.template.layout.margins.left + textWidth * 0.7,
            this.currentY
          )
          this.currentY += 10
          break
      }
    })
  }

  private parseContentToElements(content: string): Array<{ type: string; content: string }> {
    const lines = content.split("\n")
    const elements: Array<{ type: string; content: string }> = []

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        elements.push({ type: "h1", content: line.substring(2).trim() })
      } else if (line.startsWith("## ")) {
        elements.push({ type: "h2", content: line.substring(3).trim() })
      } else if (line.startsWith("### ")) {
        elements.push({ type: "h3", content: line.substring(4).trim() })
      } else if (line.startsWith("> ")) {
        elements.push({ type: "blockquote", content: line.substring(2).trim() })
      } else if (line.trim() === "---") {
        elements.push({ type: "divider", content: "" })
      } else if (line.trim() !== "") {
        elements.push({ type: "p", content: line.trim() })
      }
    })

    return elements
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

  private setTextColorHex(hex: string): void {
    const [r, g, b] = this.hexToRgb(hex)
    this.doc.setTextColor(r, g, b)
  }

  private setFillColorHex(hex: string): void {
    const [r, g, b] = this.hexToRgb(hex)
    this.doc.setFillColor(r, g, b)
  }

  private setDrawColorHex(hex: string): void {
    const [r, g, b] = this.hexToRgb(hex)
    this.doc.setDrawColor(r, g, b)
  }
}
