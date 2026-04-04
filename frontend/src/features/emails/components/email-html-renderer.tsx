'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

type EmailHtmlRendererProps = {
  html: string;
};

export function EmailHtmlRenderer({ html }: EmailHtmlRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(300);
  const [scale, setScale] = useState(1);

  // No CSS overrides - render email HTML as-is, then scale to fit
  const srcdoc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body {
    margin: 0;
    padding: 0;
  }
</style>
</head>
<body>${html}</body>
</html>`;

  const adjustSize = useCallback(() => {
    const iframe = iframeRef.current;
    const container = containerRef.current;
    if (!iframe || !container) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;

      // Get the natural content width (scrollWidth captures overflow)
      const contentWidth = Math.max(
        doc.body.scrollWidth,
        doc.documentElement.scrollWidth,
      );
      const containerWidth = container.clientWidth;

      // Calculate scale factor if content overflows
      const newScale =
        contentWidth > containerWidth ? containerWidth / contentWidth : 1;
      setScale(newScale);

      // Get content height and adjust for scale
      const contentHeight = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight,
      );
      setHeight(contentHeight * newScale);
    } catch {
      // cross-origin restriction — ignore
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.addEventListener('load', adjustSize);
    return () => iframe.removeEventListener('load', adjustSize);
  }, [html, adjustSize]);

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        sandbox="allow-same-origin"
        style={{
          width: scale < 1 ? `${100 / scale}%` : '100%',
          height: scale < 1 ? `${height / scale}px` : `${height}px`,
          border: 'none',
          display: 'block',
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
        title="メール本文"
      />
    </div>
  );
}
