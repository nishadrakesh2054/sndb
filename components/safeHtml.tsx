"use client";

import DOMPurify from "dompurify";


interface SafeHtmlProps {
  htmlString: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ htmlString }) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />;
};
export default SafeHtml;

