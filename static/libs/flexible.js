! function(window) {
  var docWidth = 750;
  var doc = window.document,
    docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var recalc = (function refreshRem() {
    var clientWidth = docEl.getBoundingClientRect().width;
    docEl.style.fontSize = Math.max(Math.min(20 * (clientWidth / docWidth), 10), 8.55) * 5 + 'px';
    return refreshRem;
  })();
  if (!doc.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
}(window);
