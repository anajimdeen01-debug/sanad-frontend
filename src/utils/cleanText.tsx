import React from 'react';

/**
 * Strips raw markdown asterisks, hashes, and symbols, returning pure clean prose.
 */
export function cleanMarkdownText(raw: string): string {
  if (!raw) return '';
  return raw
    // Remove bold/italic asterisks & underscores
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove markdown headers #, ##, etc.
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bullet characters (*, -, +) at start of lines
    .replace(/^[\*\-\+]\s+/gm, '• ')
    // Remove blockquotes >
    .replace(/^>\s+/gm, '')
    // Remove backticks `code`
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

/**
 * Renders text as clean, publication-grade styled paragraphs with inline emphasis
 * without raw markdown markup artifacts (*, **, #).
 */
export function CleanFormattedText({ 
  text, 
  className = "text-xs text-slate-200 leading-relaxed font-light" 
}: { 
  text: string; 
  className?: string; 
}) {
  if (!text) return null;

  // Split into paragraphs by double newlines or single newlines with major spacing
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const renderInlineStyled = (line: string) => {
    // Matches **bold text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanBold = part.slice(2, -2);
        return (
          <strong key={i} className="font-semibold text-white">
            {cleanBold}
          </strong>
        );
      }
      // Also clean single asterisks or leading bullet symbols
      const cleanNormal = part.replace(/^#{1,6}\s+/, '').replace(/\*([^*]+)\*/g, '$1');
      return <React.Fragment key={i}>{cleanNormal}</React.Fragment>;
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, idx) => {
        // If the paragraph is a bullet list (lines starting with - or *)
        const lines = para.split('\n');
        const isBulletBlock = lines.some(l => /^\s*[\*\-\•]\s+/.test(l));

        if (isBulletBlock) {
          return (
            <ul key={idx} className="space-y-1.5 pl-1 my-2">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                const isBullet = /^[\*\-\•]\s+/.test(trimmed);
                const itemContent = isBullet ? trimmed.replace(/^[\*\-\•]\s+/, '') : trimmed;
                if (!itemContent) return null;

                return (
                  <li key={lIdx} className="flex items-start gap-2 text-slate-200 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 mt-1.5 shrink-0" />
                    <span>{renderInlineStyled(itemContent)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineStyled(para)}
          </p>
        );
      })}
    </div>
  );
}
