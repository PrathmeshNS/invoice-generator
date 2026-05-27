# Modern LaTeX Invoice Generator Kit

A developer-friendly, desktop/web-style invoice generation kit with a premium UI and local PDF exports powered by XeLaTeX.

## Overview

This project provides a modern visual interface for generating beautifully typeset LaTeX invoices locally. It uses a React/Vite frontend for the user interface and a lightweight Node.js Express server to compile Handlebars-injected LaTeX templates into high-quality PDFs.

There are no databases, no cloud syncing, and no authentication—just a fast, minimal, and premium tool to get your invoicing done.

## Features

- **Beautiful Frontend:** Linear/Vercel-inspired UI using React, TailwindCSS, and shadcn/ui.
- **Local Generation:** No cloud dependencies for PDF generation.
- **Template System:** Choose between Minimal, Modern, and Corporate LaTeX designs.
- **Dynamic Editor:** Add/remove rows, calculate totals and taxes on the fly.
- **Live HTML Preview:** Real-time visual feedback as you type.

## Requirements

To generate PDFs, you **must** have a LaTeX engine installed locally and available in your system's PATH.

- **Windows:** [MiKTeX](https://miktex.org/download) or [TeX Live](https://tug.org/texlive/)
- **macOS:** [MacTeX](https://www.tug.org/mactex/)
- **Linux:** `texlive-full` or `texlive-xetex` via your package manager.

Ensure that the command `xelatex` works from your terminal before running this app.

## Installation

```bash
# Clone the repository and navigate to invoice-kit
cd invoice-kit

# Install root dependencies (concurrently, express, etc.)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Running the App

To run both the Vite frontend development server and the Node.js backend simultaneously:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## Building for Production

If you wish to build the frontend for production:

```bash
cd frontend
npm run build
```

## Folder Structure

- `frontend/` - React, Vite, Tailwind CSS, shadcn/ui, Zustand state management.
- `latex-engine/` - Contains the `.tex` templates and the `generated/` directory for outputs.
- `scripts/` - Node.js server (`server.js`) and generation helpers (`generateInvoice.js`).
