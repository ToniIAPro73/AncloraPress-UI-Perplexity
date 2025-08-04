import JSZip from "jszip"
import { marked } from "marked"
import DOMPurify from "dompurify"

interface EpubTemplate {
  id: string
  name: string
  css: string
  fonts: string[]
  layout: {
    pageMargins: string
    lineHeight: number
    fontSize: string
    fontFamily: string
  }
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
    link: string
  }
}

const epubTemplates: Record<string, EpubTemplate> = {
  modern: {
    id: "modern",
    name: "Moderno",
    css: `
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1F2933;
        background-color: #FFFFFF;
        margin: 0;
        padding: 2em;
        text-align: justify;
        hyphens: auto;
      }
      
      h1 {
        font-size: 2.5em;
        font-weight: 700;
        color: #006EE6;
        margin: 2em 0 1em 0;
        text-align: center;
        page-break-before: always;
      }
      
      h2 {
        font-size: 1.8em;
        font-weight: 600;
        color: #1F2933;
        margin: 1.5em 0 0.8em 0;
        border-bottom: 2px solid #006EE6;
        padding-bottom: 0.3em;
      }
      
      h3 {
        font-size: 1.4em;
        font-weight: 600;
        color: #1F2933;
        margin: 1.2em 0 0.6em 0;
      }
      
      p {
        margin: 0 0 1em 0;
        text-indent: 1.5em;
      }
      
      p:first-child, h1 + p, h2 + p, h3 + p {
        text-indent: 0;
      }
      
      blockquote {
        font-style: italic;
        color: #00B8D9;
        border-left: 4px solid #006EE6;
        padding-left: 1em;
        margin: 1.5em 0;
        background-color: #F8FAFC;
        padding: 1em;
        border-radius: 4px;
      }
      
      hr {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, #006EE6, transparent);
        margin: 2em 0;
      }
      
      .chapter-number {
        font-size: 0.8em;
        color: #8492A6;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.5em;
      }
      
      .drop-cap {
        float: left;
        font-size: 4em;
        line-height: 0.8;
        padding-right: 0.1em;
        padding-top: 0.1em;
        color: #006EE6;
        font-weight: bold;
      }
      
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #1F2933;
          color: #F7FAFC;
        }
        
        h1, h2, h3 {
          color: #63B3ED;
        }
        
        blockquote {
          background-color: #2D3748;
          color: #90CDF4;
        }
      }
    `,
    fonts: ["Inter"],
    layout: {
      pageMargins: "2em",
      lineHeight: 1.6,
      fontSize: "16px",
      fontFamily: "Inter, sans-serif",
    },
    colors: {
      primary: "#006EE6",
      secondary: "#00B8D9",
      text: "#1F2933",
      background: "#FFFFFF",
      link: "#006EE6",
    },
  },
  classic: {
    id: "classic",
    name: "Clásico",
    css: `
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 18px;
        line-height: 1.8;
        color: #1A202C;
        background-color: #FFFFFF;
        margin: 0;
        padding: 3em 2.5em;
        text-align: justify;
        hyphens: auto;
      }
      
      h1 {
        font-size: 2.8em;
        font-weight: bold;
        color: #2D3748;
        margin: 2.5em 0 1.5em 0;
        text-align: center;
        page-break-before: always;
        font-variant: small-caps;
        letter-spacing: 0.05em;
      }
      
      h2 {
        font-size: 2em;
        font-weight: bold;
        color: #2D3748;
        margin: 2em 0 1em 0;
        text-align: center;
      }
      
      h3 {
        font-size: 1.5em;
        font-weight: bold;
        color: #4A5568;
        margin: 1.5em 0 0.8em 0;
        font-style: italic;
      }
      
      p {
        margin: 0 0 1.2em 0;
        text-indent: 2em;
      }
      
      p:first-child, h1 + p, h2 + p, h3 + p {
        text-indent: 0;
      }
      
      p:first-child:first-letter {
        float: left;
        font-size: 4.5em;
        line-height: 0.8;
        padding-right: 0.1em;
        padding-top: 0.15em;
        color: #2D3748;
        font-weight: bold;
      }
      
      blockquote {
        font-style: italic;
        color: #4A5568;
        text-align: center;
        margin: 2em 0;
        font-size: 1.1em;
        position: relative;
      }
      
      blockquote:before {
        content: '"';
        font-size: 3em;
        color: #CBD5E0;
        position: absolute;
        left: -0.5em;
        top: -0.2em;
      }
      
      blockquote:after {
        content: '"';
        font-size: 3em;
        color: #CBD5E0;
        position: absolute;
        right: -0.5em;
        bottom: -0.8em;
      }
      
      hr {
        border: none;
        text-align: center;
        margin: 3em 0;
      }
      
      hr:after {
        content: '* * *';
        font-size: 1.5em;
        color: #4A5568;
        letter-spacing: 1em;
      }
      
      .chapter-number {
        font-size: 0.9em;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        text-align: center;
        margin-bottom: 1em;
      }
    `,
    fonts: ["Times New Roman"],
    layout: {
      pageMargins: "3em 2.5em",
      lineHeight: 1.8,
      fontSize: "18px",
      fontFamily: "Times New Roman, serif",
    },
    colors: {
      primary: "#2D3748",
      secondary: "#4A5568",
      text: "#1A202C",
      background: "#FFFFFF",
      link: "#2D3748",
    },
  },
  creative: {
    id: "creative",
    name: "Creativo",
    css: `
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.5;
        color: #2D3748;
        background-color: #FFFFFF;
        margin: 0;
        padding: 1.5em;
        text-align: left;
      }
      
      h1 {
        font-size: 2.2em;
        font-weight: 300;
        color: #E53E3E;
        margin: 1.5em 0 1em 0;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        border-left: 5px solid #E53E3E;
        padding-left: 1em;
        page-break-before: always;
      }
      
      h2 {
        font-size: 1.6em;
        font-weight: 400;
        color: #2D3748;
        margin: 1.2em 0 0.6em 0;
        position: relative;
      }
      
      h2:before {
        content: '';
        position: absolute;
        left: -1.5em;
        top: 0.5em;
        width: 1em;
        height: 2px;
        background-color: #F56565;
      }
      
      h3 {
        font-size: 1.3em;
        font-weight: 500;
        color: #4A5568;
        margin: 1em 0 0.5em 0;
        font-style: italic;
      }
      
      p {
        margin: 0 0 0.8em 0;
        text-indent: 0;
      }
      
      blockquote {
        font-style: italic;
        color: #E53E3E;
        background-color: #FED7D7;
        padding: 1em 1.5em;
        margin: 1.5em 0;
        border-radius: 8px;
        position: relative;
        font-size: 1.1em;
      }
      
      blockquote:before {
        content: '💭';
        position: absolute;
        left: 0.5em;
        top: 0.3em;
        font-size: 1.5em;
      }
      
      hr {
        border: none;
        height: 20px;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><circle cx="20" cy="10" r="3" fill="%23E53E3E"/><circle cx="50" cy="10" r="3" fill="%23F56565"/><circle cx="80" cy="10" r="3" fill="%23FEB2B2"/></svg>') center center no-repeat;
        margin: 2em 0;
      }
      
      .sidebar {
        background-color: #F7FAFC;
        border-left: 4px solid #E53E3E;
        padding: 1em;
        margin: 1.5em 0;
        font-size: 0.9em;
        color: #4A5568;
      }
      
      .highlight {
        background-color: #FFF5F5;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        color: #C53030;
        font-weight: 500;
      }
    `,
    fonts: ["Helvetica Neue"],
    layout: {
      pageMargins: "1.5em",
      lineHeight: 1.5,
      fontSize: "15px",
      fontFamily: "Helvetica Neue, sans-serif",
    },
    colors: {
      primary: "#E53E3E",
      secondary: "#F56565",
      text: "#2D3748",
      background: "#FFFFFF",
      link: "#E53E3E",
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

export class EPUBGenerator {
  private bookData: BookData
  private template: EpubTemplate
  private zip: JSZip
  private chapters: Array<{ title: string; content: string; id: string }> = []

  constructor(bookData: BookData) {
    this.bookData = bookData
    this.template = epubTemplates[bookData.template] || epubTemplates.modern
    this.zip = new JSZip()
    this.parseContent()
  }

  async generateEPUB(): Promise<Blob> {
    try {
      // Create EPUB structure
      this.createMimeType()
      this.createContainer()
      this.createPackageDocument()
      this.createTableOfContents()
      this.createNavigationDocument()
      this.createStylesheet()
      await this.createCoverPage()
      this.createContentPages()

      // Generate and return EPUB file
      return await this.zip.generateAsync({ type: "blob" })
    } catch (error) {
      console.error("Error generating EPUB:", error)
      throw new Error("Failed to generate EPUB")
    }
  }

  private parseContent(): void {
    const lines = this.bookData.content.split("\n")
    let currentChapter: { title: string; content: string; id: string } | null = null
    let chapterCount = 0

    for (const line of lines) {
      if (line.startsWith("# ")) {
        // Save previous chapter
        if (currentChapter) {
          this.chapters.push(currentChapter)
        }

        // Start new chapter
        chapterCount++
        currentChapter = {
          title: line.substring(2).trim(),
          content: "",
          id: `chapter-${chapterCount}`,
        }
      } else if (currentChapter) {
        currentChapter.content += line + "\n"
      }
    }

    // Add last chapter
    if (currentChapter) {
      this.chapters.push(currentChapter)
    }

    // If no chapters found, create a single chapter with all content
    if (this.chapters.length === 0) {
      this.chapters.push({
        title: this.bookData.title,
        content: this.bookData.content,
        id: "chapter-1",
      })
    }
  }

  private createMimeType(): void {
    this.zip.file("mimetype", "application/epub+zip")
  }

  private createContainer(): void {
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`

    this.zip.folder("META-INF")!.file("container.xml", containerXml)
  }

  private createPackageDocument(): void {
    const manifestItems = [
      '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
      '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
      '<item id="stylesheet" href="styles.css" media-type="text/css"/>',
      '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
      ...this.chapters.map(
        (chapter) => `<item id="${chapter.id}" href="${chapter.id}.xhtml" media-type="application/xhtml+xml"/>`,
      ),
    ]

    if (this.bookData.coverImage) {
      manifestItems.push('<item id="cover-image" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>')
    }

    const spineItems = [
      '<itemref idref="cover"/>',
      ...this.chapters.map((chapter) => `<itemref idref="${chapter.id}"/>`),
    ]

    const packageOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:${this.generateUUID()}</dc:identifier>
    <dc:title>${this.escapeXml(this.bookData.title)}</dc:title>
    <dc:creator>${this.escapeXml(this.bookData.author)}</dc:creator>
    <dc:language>es</dc:language>
    <dc:publisher>Anclora Press</dc:publisher>
    <dc:date>${new Date().toISOString().split("T")[0]}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString()}</meta>
    ${this.bookData.subtitle ? `<dc:description>${this.escapeXml(this.bookData.subtitle)}</dc:description>` : ""}
  </metadata>
  
  <manifest>
    ${manifestItems.join("\n    ")}
  </manifest>
  
  <spine toc="ncx">
    ${spineItems.join("\n    ")}
  </spine>
  
  <guide>
    <reference type="cover" title="Portada" href="cover.xhtml"/>
  </guide>
</package>`

    this.zip.folder("OEBPS")!.file("package.opf", packageOpf)
  }

  private createTableOfContents(): void {
    const navPoints = this.chapters
      .map(
        (chapter, index) => `
    <navPoint id="navpoint-${index + 1}" playOrder="${index + 1}">
      <navLabel>
        <text>${this.escapeXml(chapter.title)}</text>
      </navLabel>
      <content src="${chapter.id}.xhtml"/>
    </navPoint>`,
      )
      .join("")

    const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${this.generateUUID()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  
  <docTitle>
    <text>${this.escapeXml(this.bookData.title)}</text>
  </docTitle>
  
  <navMap>
    ${navPoints}
  </navMap>
</ncx>`

    this.zip.folder("OEBPS")!.file("toc.ncx", tocNcx)
  }

  private createNavigationDocument(): void {
    const navItems = this.chapters
      .map((chapter) => `<li><a href="${chapter.id}.xhtml">${this.escapeXml(chapter.title)}</a></li>`)
      .join("\n      ")

    const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Índice</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Índice</h1>
    <ol>
      ${navItems}
    </ol>
  </nav>
</body>
</html>`

    this.zip.folder("OEBPS")!.file("nav.xhtml", navXhtml)
  }

  private createStylesheet(): void {
    this.zip.folder("OEBPS")!.file("styles.css", this.template.css)
  }

  private async createCoverPage(): Promise<void> {
    let coverImageHtml = ""

    if (this.bookData.coverImage) {
      try {
        // Convert base64 to blob and add to EPUB
        const response = await fetch(this.bookData.coverImage)
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()

        this.zip.folder("OEBPS")!.file("cover.jpg", arrayBuffer)
        coverImageHtml = '<img src="cover.jpg" alt="Portada" style="width: 100%; height: auto;"/>'
      } catch (error) {
        console.warn("Failed to add cover image to EPUB:", error)
      }
    }

    const coverXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Portada</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
  <style>
    body {
      margin: 0;
      padding: 0;
      text-align: center;
      background-color: ${this.bookData.coverColor};
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100vh;
    }
    .cover-container {
      padding: 2em;
    }
    .cover-title {
      font-size: 3em;
      font-weight: bold;
      margin-bottom: 0.5em;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .cover-subtitle {
      font-size: 1.5em;
      margin-bottom: 1em;
      opacity: 0.9;
    }
    .cover-author {
      font-size: 1.2em;
      margin-top: 2em;
      opacity: 0.8;
    }
    .cover-publisher {
      font-size: 0.9em;
      margin-top: auto;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="cover-container">
    ${coverImageHtml}
    <h1 class="cover-title">${this.escapeXml(this.bookData.title)}</h1>
    ${this.bookData.subtitle ? `<p class="cover-subtitle">${this.escapeXml(this.bookData.subtitle)}</p>` : ""}
    <p class="cover-author">por ${this.escapeXml(this.bookData.author)}</p>
    <p class="cover-publisher">ANCLORA PRESS</p>
  </div>
</body>
</html>`

    this.zip.folder("OEBPS")!.file("cover.xhtml", coverXhtml)
  }

  private createContentPages(): void {
    this.chapters.forEach((chapter, index) => {
      const htmlContent = this.markdownToHtml(chapter.content)
      const chapterNumber = index + 1

      const chapterXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${this.escapeXml(chapter.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div class="chapter">
    <div class="chapter-number">Capítulo ${chapterNumber}</div>
    <h1>${this.escapeXml(chapter.title)}</h1>
    ${htmlContent}
  </div>
</body>
</html>`

      this.zip.folder("OEBPS")!.file(`${chapter.id}.xhtml`, chapterXhtml)
    })
  }

  private markdownToHtml(markdown: string): string {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    // Convert markdown to HTML
    let html = marked(markdown) as string

    // Sanitize HTML
    html = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "strong",
        "em",
        "u",
        "blockquote",
        "ul",
        "ol",
        "li",
        "br",
        "hr",
        "a",
      ],
      ALLOWED_ATTR: ["href", "title", "class", "id"],
    })

    // Add drop cap to first paragraph if using classic template
    if (this.template.id === "classic") {
      html = html.replace(/<p>([^<])/g, '<p><span class="drop-cap">$1</span>')
    }

    // Convert quotes to styled blockquotes
    html = html.replace(/\*([^*]+)\*/g, "<blockquote>$1</blockquote>")

    return html
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  }

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
