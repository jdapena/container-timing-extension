const html = document.querySelector('html')
const nativeObserver = new PerformanceObserver((list) => {
  console.log(list.getEntries());
});
nativeObserver.observe({ type: "container", buffered: true});
console.debug("Registered observer")
  
html.setAttribute("containertiming", "")
console.debug("Added containertiming attribute")
