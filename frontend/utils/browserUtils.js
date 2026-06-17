export function isInternetExplorer() {
  if (typeof window === 'undefined') return false;
  return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1;
}

export function isSafari() {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isIOS() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return isIOS() || isAndroid() || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function getBrowserInfo() {
  if (typeof window === 'undefined') return { name: 'unknown', version: '' };
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return { name: 'Firefox', version: ua.match(/Firefox\/(\d+)/)?.[1] || '' };
  if (ua.includes('Chrome') && !ua.includes('Edg')) return { name: 'Chrome', version: ua.match(/Chrome\/(\d+)/)?.[1] || '' };
  if (ua.includes('Safari') && !ua.includes('Chrome')) return { name: 'Safari', version: ua.match(/Version\/(\d+)/)?.[1] || '' };
  if (ua.includes('Edg')) return { name: 'Edge', version: ua.match(/Edg\/(\d+)/)?.[1] || '' };
  return { name: 'other', version: '' };
}
