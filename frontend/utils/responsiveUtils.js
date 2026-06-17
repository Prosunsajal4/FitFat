export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function isMobile(width) {
  return width < breakpoints.md;
}

export function isTablet(width) {
  return width >= breakpoints.md && width < breakpoints.lg;
}

export function isDesktop(width) {
  return width >= breakpoints.lg;
}

export function responsiveClass(width, mobile, tablet, desktop) {
  if (width < breakpoints.md) return mobile;
  if (width < breakpoints.lg) return tablet;
  return desktop;
}

export function getGridColumns(width) {
  if (width < breakpoints.sm) return 1;
  if (width < breakpoints.md) return 2;
  if (width < breakpoints.lg) return 3;
  return 4;
}

export function touchFriendly() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
