let pdfjsLibPromise = null;
let renderGeneration = 0;

export function cancelCvPdfRender() {
  renderGeneration += 1;
}

const documentCache = new Map();

/** Loads a PDF once per page load; later calls reuse the same download/parse. */
function getPdfDocument(pdfUrl) {
  if (!documentCache.has(pdfUrl)) {
    const promise = loadPdfJs()
      .then((lib) => lib.getDocument(pdfUrl).promise)
      .catch((error) => {
        documentCache.delete(pdfUrl);
        throw error;
      });
    documentCache.set(pdfUrl, promise);
  }
  return documentCache.get(pdfUrl);
}

/** Warm up pdf.js and the PDF so the preview opens fast (call on hover/focus). */
export function prefetchCvPdf(pdfUrl) {
  getPdfDocument(pdfUrl).catch(() => {});
}

function loadPdfJs() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import(
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs"
    ).then((lib) => {
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";
      return lib;
    });
  }
  return pdfjsLibPromise;
}

/**
 * Renders a PDF as stacked page canvases inside the container (single page scroll).
 */
export async function renderCvPdfInline(
  container,
  pdfUrl,
  { loadingText, errorText, errorOpenLabel, errorOpenHref } = {},
) {
  if (!container) return;

  const generation = ++renderGeneration;
  const status = document.createElement("p");
  status.className = "cv-preview__status";
  status.setAttribute("aria-live", "polite");
  status.textContent = loadingText ?? "Loading…";
  container.replaceChildren(status);

  try {
    const pdf = await getPdfDocument(pdfUrl);
    if (generation !== renderGeneration) return;

    const pagesWrap = document.createElement("div");
    pagesWrap.className = "cv-preview__pages";

    const width =
      container.clientWidth ||
      container.getBoundingClientRect().width ||
      window.innerWidth;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      if (generation !== renderGeneration) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.max(width / baseViewport.width, 0.1);
      const viewport = page.getViewport({ scale });
      const outputScale = window.devicePixelRatio || 1;

      const canvas = document.createElement("canvas");
      canvas.className = "cv-preview__page";
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `CV ${pageNum}`);

      const ctx = canvas.getContext("2d");
      ctx.scale(outputScale, outputScale);

      await page.render({ canvasContext: ctx, viewport }).promise;
      if (generation !== renderGeneration) return;

      pagesWrap.appendChild(canvas);
    }

    container.replaceChildren(pagesWrap);
  } catch {
    if (generation !== renderGeneration) return;
    const wrap = document.createElement("div");
    wrap.className = "cv-preview__error-wrap";
    const err = document.createElement("p");
    err.className = "cv-preview__error";
    err.textContent = errorText ?? "Could not load CV.";
    wrap.appendChild(err);
    if (errorOpenHref && errorOpenLabel) {
      const link = document.createElement("a");
      link.className = "cv-preview__error-link";
      link.href = errorOpenHref;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = errorOpenLabel;
      wrap.appendChild(link);
    }
    container.replaceChildren(wrap);
  }
}
