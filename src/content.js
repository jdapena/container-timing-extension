const html = document.querySelector('html')
const href = document.location.href
const nativeObserver = new PerformanceObserver((list) => {
  console.log("Container timing entries from " + href)
  console.log(list.getEntries());
});
nativeObserver.observe({ type: "container", buffered: true});
console.debug("Registered observer for " + href)
  
html.setAttribute("containertiming", "")
console.debug("Added containertiming attribute")
