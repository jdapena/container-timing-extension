// Don't re-run operation after selector has been seen
let flag = false;
// Default selector
let selector = 'html';

// Pull the selector out of the settings
chrome.storage.sync.get(
  { selector: 'html' },
  (items) => {
    selector = items.selector || 'html';
  }
);

const observer = new MutationObserver(() => {
  if (document.querySelector(selector) && !flag) {
    const html = document.querySelector(selector);
    const href = document.location.href
    const nativeObserver = new PerformanceObserver((list) => {
      console.log("Container timing entries from " + href)
      console.log(list.getEntries());
      list.getEntries().forEach((list) => {
        clearRects();
        showRectsOnScreen(list.damagedRects);
        showBoundingRect(list.intersectionRect);
      })
    });
    nativeObserver.observe({ type: "container", buffered: true });
    console.debug("Registered observer for " + href)

    html.setAttribute("containertiming", "")
    console.debug("Added containertiming attribute")
    flag = true;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.body, { attributes: false, childList: true, characterData: false, subtree: true });
});

function showRectsOnScreen(rects) {
  rects.forEach((rect) => {
    const div = document.createElement('div');
    div.classList.add('overlay');
    div.style.left = `${rect.left}px`;
    div.style.top = `${rect.top}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    document.body.appendChild(div);
  });
}

function showBoundingRect(rect) {
  const div = document.createElement('div');
  div.classList.add('boundingRect');
  div.style.left = `${rect.left}px`;
  div.style.top = `${rect.top}px`;
  div.style.width = `${rect.width}px`;
  div.style.height = `${rect.height}px`;
  document.body.appendChild(div);
}

function clearRects() {
  document.querySelectorAll('.overlay').forEach(elm => elm.remove());
  document.querySelectorAll('.boundingRect').forEach(elm => elm.remove());
}
