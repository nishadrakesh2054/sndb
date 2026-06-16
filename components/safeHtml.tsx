"use client";

import { useEffect, useState } from "react";

interface SafeHtmlProps {
  htmlString: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ htmlString }) => {
  const [cleanHtmlString, setCleanHtmlString] = useState("");

  useEffect(() => {
    let cancelled = false;

    import("dompurify").then(({ default: DOMPurify }) => {
      if (!cancelled) {
        setCleanHtmlString(DOMPurify.sanitize(htmlString));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [htmlString]);

  if (!cleanHtmlString) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />;
};

export default SafeHtml;
