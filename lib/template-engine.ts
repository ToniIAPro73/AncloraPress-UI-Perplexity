export interface TemplateConfig {
  id: string
  name: string
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    textLight: string
    background: string
    surface: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    h1: { size: string; weight: string; lineHeight: string }
    h2: { size: string; weight: string; lineHeight: string }
    h3: { size: string; weight: string; lineHeight: string }
    body: { size: string; weight: string; lineHeight: string }
    caption: { size: string; weight: string; lineHeight: string }
  }
  layout: {
    maxWidth: string
    margins: string
    columnGap: string
    rowGap: string
  }
}

export const templateConfigs: Record<string, TemplateConfig> = {
  modern: {
    id: "modern",
    name: "Moderno",
    fonts: {
      primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      secondary: "Inter, sans-serif",
      mono: "JetBrains Mono, Consolas, monospace",
    },
    colors: {
      primary: "#006EE6",
      secondary: "#00B8D9",
      accent: "#4A90E2",
      text: "#1F2933",
      textLight: "#8492A6",
      background: "#FFFFFF",
      surface: "#F9FAFB",
    },
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
    },
    typography: {
      h1: { size: "2.5rem", weight: "700", lineHeight: "1.2" },
      h2: { size: "2rem", weight: "600", lineHeight: "1.3" },
      h3: { size: "1.5rem", weight: "600", lineHeight: "1.4" },
      body: { size: "1rem", weight: "400", lineHeight: "1.6" },
      caption: { size: "0.875rem", weight: "400", lineHeight: "1.5" },
    },
    layout: {
      maxWidth: "65ch",
      margins: "2rem",
      columnGap: "2rem",
      rowGap: "1.5rem",
    },
  },
  classic: {
    id: "classic",
    name: "Clásico",
    fonts: {
      primary: "Times New Roman, Times, serif",
      secondary: "Georgia, serif",
      mono: "Courier New, monospace",
    },
    colors: {
      primary: "#2D3748",
      secondary: "#4A5568",
      accent: "#718096",
      text: "#1A202C",
      textLight: "#718096",
      background: "#FFFFFF",
      surface: "#F7FAFC",
    },
    spacing: {
      xs: "0.75rem",
      sm: "1.25rem",
      md: "2rem",
      lg: "2.5rem",
      xl: "3.5rem",
    },
    typography: {
      h1: { size: "2.8rem", weight: "bold", lineHeight: "1.1" },
      h2: { size: "2.2rem", weight: "bold", lineHeight: "1.2" },
      h3: { size: "1.8rem", weight: "bold", lineHeight: "1.3" },
      body: { size: "1.125rem", weight: "400", lineHeight: "1.8" },
      caption: { size: "1rem", weight: "400", lineHeight: "1.6" },
    },
    layout: {
      maxWidth: "70ch",
      margins: "3rem",
      columnGap: "2.5rem",
      rowGap: "2rem",
    },
  },
  creative: {
    id: "creative",
    name: "Creativo",
    fonts: {
      primary: "Helvetica Neue, Helvetica, Arial, sans-serif",
      secondary: "Avenir, sans-serif",
      mono: "SF Mono, Monaco, monospace",
    },
    colors: {
      primary: "#E53E3E",
      secondary: "#F56565",
      accent: "#FEB2B2",
      text: "#2D3748",
      textLight: "#718096",
      background: "#FFFFFF",
      surface: "#FFF5F5",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.75rem",
      md: "1.25rem",
      lg: "1.75rem",
      xl: "2.5rem",
    },
    typography: {
      h1: { size: "2.2rem", weight: "300", lineHeight: "1.1" },
      h2: { size: "1.8rem", weight: "400", lineHeight: "1.2" },
      h3: { size: "1.4rem", weight: "500", lineHeight: "1.3" },
      body: { size: "0.95rem", weight: "400", lineHeight: "1.5" },
      caption: { size: "0.8rem", weight: "400", lineHeight: "1.4" },
    },
    layout: {
      maxWidth: "60ch",
      margins: "1.5rem",
      columnGap: "1.5rem",
      rowGap: "1rem",
    },
  },
}

export class TemplateEngine {
  private config: TemplateConfig

  constructor(templateId: string) {
    this.config = templateConfigs[templateId] || templateConfigs.modern
  }

  generateCSS(): string {
    return `
      :root {
        --font-primary: ${this.config.fonts.primary};
        --font-secondary: ${this.config.fonts.secondary};
        --font-mono: ${this.config.fonts.mono};
        
        --color-primary: ${this.config.colors.primary};
        --color-secondary: ${this.config.colors.secondary};
        --color-accent: ${this.config.colors.accent};
        --color-text: ${this.config.colors.text};
        --color-text-light: ${this.config.colors.textLight};
        --color-background: ${this.config.colors.background};
        --color-surface: ${this.config.colors.surface};
        
        --spacing-xs: ${this.config.spacing.xs};
        --spacing-sm: ${this.config.spacing.sm};
        --spacing-md: ${this.config.spacing.md};
        --spacing-lg: ${this.config.spacing.lg};
        --spacing-xl: ${this.config.spacing.xl};
        
        --layout-max-width: ${this.config.layout.maxWidth};
        --layout-margins: ${this.config.layout.margins};
        --layout-column-gap: ${this.config.layout.columnGap};
        --layout-row-gap: ${this.config.layout.rowGap};
      }
      
      body {
        font-family: var(--font-primary);
        font-size: ${this.config.typography.body.size};
        font-weight: ${this.config.typography.body.weight};
        line-height: ${this.config.typography.body.lineHeight};
        color: var(--color-text);
        background-color: var(--color-background);
        margin: 0;
        padding: var(--layout-margins);
        max-width: var(--layout-max-width);
        margin: 0 auto;
      }
      
      h1 {
        font-size: ${this.config.typography.h1.size};
        font-weight: ${this.config.typography.h1.weight};
        line-height: ${this.config.typography.h1.lineHeight};
        color: var(--color-primary);
        margin: var(--spacing-xl) 0 var(--spacing-lg) 0;
      }
      
      h2 {
        font-size: ${this.config.typography.h2.size};
        font-weight: ${this.config.typography.h2.weight};
        line-height: ${this.config.typography.h2.lineHeight};
        color: var(--color-text);
        margin: var(--spacing-lg) 0 var(--spacing-md) 0;
      }
      
      h3 {
        font-size: ${this.config.typography.h3.size};
        font-weight: ${this.config.typography.h3.weight};
        line-height: ${this.config.typography.h3.lineHeight};
        color: var(--color-text);
        margin: var(--spacing-md) 0 var(--spacing-sm) 0;
      }
      
      p {
        margin: 0 0 var(--spacing-sm) 0;
        text-align: justify;
        hyphens: auto;
      }
      
      blockquote {
        font-style: italic;
        color: var(--color-secondary);
        border-left: 4px solid var(--color-primary);
        padding-left: var(--spacing-md);
        margin: var(--spacing-md) 0;
        background-color: var(--color-surface);
        padding: var(--spacing-md);
        border-radius: 4px;
      }
      
      code {
        font-family: var(--font-mono);
        background-color: var(--color-surface);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
      }
      
      pre {
        font-family: var(--font-mono);
        background-color: var(--color-surface);
        padding: var(--spacing-md);
        border-radius: 6px;
        overflow-x: auto;
        margin: var(--spacing-md) 0;
      }
      
      hr {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--color-primary), transparent);
        margin: var(--spacing-lg) 0;
      }
      
      .chapter-break {
        page-break-before: always;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
      
      @media print {
        body {
          font-size: 12pt;
          line-height: 1.4;
        }
        
        h1 { font-size: 18pt; }
        h2 { font-size: 16pt; }
        h3 { font-size: 14pt; }
      }
      
      @media (prefers-color-scheme: dark) {
        :root {
          --color-text: #F7FAFC;
          --color-background: #1A202C;
          --color-surface: #2D3748;
        }
      }
    `
  }

  getConfig(): TemplateConfig {
    return this.config
  }

  applyTemplate(content: string): string {
    // Apply template-specific transformations
    let processedContent = content

    // Add chapter breaks
    processedContent = processedContent.replace(/^# /gm, '<div class="chapter-break"></div>\n# ')

    // Wrap quotes in proper blockquote tags
    processedContent = processedContent.replace(/^\*(.+)\*$/gm, "<blockquote>$1</blockquote>")

    // Add no-break class to short paragraphs
    processedContent = processedContent.replace(/^(.{1,100})$/gm, '<p class="no-break">$1</p>')

    return processedContent
  }
}
