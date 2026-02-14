# 📚 Proyecto Libros - Team Documentation

## Project Overview

**Proyecto Libros** is a modern web application built with Astro that serves as a digital catalog and showcase for books. The project uses a content-driven architecture to manage and display book information with rich metadata and descriptions.

**Technology Stack:**

- **Astro** (88.2%) - Static site generator framework
- **MDX** (7.9%) - Markdown with JSX support for interactive content
- **CSS** (3.3%) - Custom styling
- **Tailwind CSS** - Utility-first CSS framework
- **Node.js** - Runtime environment

## 📁 Estructura del Proyecto

```text
proyecto-libros/
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable Astro components
│   ├── content/         # Content collections (book data)
│   │   └── books/       # Individual book entries with metadata
│   ├── layouts/         # Layout templates
│   └── pages/           # Website pages and routes
├── public/              # Static files served directly
├── astro.config.mjs     # Astro configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

<br>

# 📖 Content Management

### Adding a New Book

Books are stored as **MDX** files inside: `src/content/books/`. Each book has its own folder containing an `index.md` file.

**Example Structure:** `src/content/books/book-01/index.md`

---

### Metadata Fields

Each book must include the following frontmatter metadata:

| Field           | Description                 |
| :-------------- | :-------------------------- |
| **title** | Book title                  |
| **author** | Author name(s)              |
| **description** | Book description or summary |
| **img** | Cover image filename        |
| **date** | Publication date            |
| **place** | Publication location        |
| **publisher** | Publisher name              |
| **pages** | Number of pages             |
| **link** | External book link          |

<br>

# 🎨 Styling

The project leverages **Tailwind CSS** as its primary styling engine, ensuring a modern and efficient development workflow.

### Core Technologies

- **Tailwind CSS 4.1.12**: Utilizing the latest utility-first CSS framework features.
- **Tailwind Typography Plugin**: Used for high-quality rich text styling (prose) in content areas.
- **Vite Integration**: Provides fast Hot Module Replacement (HMR) and optimal build performance.

---

### Customizing Styles

You can manage and extend styles through three main levels:

1.  **Global Styles**: Can be imported directly into your main layout files.
2.  **Component Styling**: Most UI elements are styled directly using **Tailwind utility classes**.
3.  **Scoped CSS**: For specific needs, custom CSS can be added inside individual `.astro` components using the `<style>` tag.

---
