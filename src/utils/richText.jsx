const ALLOWED_TAGS = new Set(["A", "STRONG", "B", "EM", "I", "BR"]);
const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

export function sanitizeRichText(html) {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(html, "text/html");

  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!ALLOWED_TAGS.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent));
          return;
        }
        [...child.attributes].forEach((attr) => {
          if (child.tagName === "A" && attr.name === "href" && SAFE_HREF.test(attr.value)) {
            return;
          }
          child.removeAttribute(attr.name);
        });
        if (child.tagName === "A" && /^https?:/i.test(child.getAttribute("href") || "")) {
          child.setAttribute("target", "_blank");
          child.setAttribute("rel", "noreferrer");
        }
        clean(child);
      } else if (child.nodeType !== Node.TEXT_NODE) {
        child.remove();
      }
    });
  };

  clean(doc.body);
  return doc.body.innerHTML;
}

export function RichText({ as: Tag = "span", text, className }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichText(text) }} />;
}
