export default function isMobileOrTablet() {
  const userAgent = window.navigator.userAgent;
  const isiPhone = /iPhone/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isWindowsPhone = /Windows Phone/.test(userAgent);
  const isiPad = /iPad/.test(userAgent);
  const isTablet = /Tablet|Pad|Mobile|Touch/i.test(userAgent) && 'ontouchstart' in window && screen.width >= 768;

  return isiPhone || isAndroid || isWindowsPhone || isiPad || isTablet;
}
