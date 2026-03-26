function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Lightweight markdown → HTML for AI responses (bold, italic, code, headers, lists, paragraphs).
 */
export function renderMarkdown(text: string): string {
  if (!text) return "";

  let html = escapeHtml(text);

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>',
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-base font-bold mt-3 mb-1">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-lg font-bold mt-4 mb-2">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>',
  );

  const lines = html.split("\n");
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (const line of lines) {
    const ul = /^- (.+)$/.exec(line);
    const ol = /^(\d+)\. (.+)$/.exec(line);

    if (ul) {
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        out.push('<ul class="list-disc space-y-1 my-2 ml-4">');
        inUl = true;
      }
      out.push(`<li>${ul[1]}</li>`);
      continue;
    }

    if (ol) {
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        out.push('<ol class="list-decimal space-y-1 my-2 ml-4">');
        inOl = true;
      }
      out.push(`<li>${ol[2]}</li>`);
      continue;
    }

    closeLists();

    if (line.trim() === "") {
      out.push("<br/>");
    } else if (/^<h[123]/.test(line.trim())) {
      out.push(line);
    } else {
      out.push(`<p class="my-2">${line}</p>`);
    }
  }

  closeLists();

  return out.join("");
}
