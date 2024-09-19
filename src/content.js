const href = document.location.href

const nativeObserver = new PerformanceObserver((list) => {
  console.log("Container timing entries from " + href)
  const entries = list.getEntries()
  chrome.runtime.sendMessage({
    name: "got-container-timing-entries",
    href: href,
    entries: entries
  })
});

nativeObserver.observe({ type: "container", buffered: true });
console.debug("Registered observer for " + href)

const html = document.querySelector('html')
html.setAttribute("containertiming", "")
console.debug("Added containertiming attribute")
