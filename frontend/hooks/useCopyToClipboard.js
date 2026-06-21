import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        setCopied(ok);
        if (ok) setTimeout(() => setCopied(false), timeout);
        return ok;
      }
    },
    [timeout]
  );

  return { copied, copy };
}
