console.log("Panel: loading JS");

let href_to_container_roots = {}

function refresh() {
    href_to_container_roots = {}
    console.log(href_to_container_roots)
    const entries_element = document.querySelector("#entries");
    entries_element.innerHTML = "";
}

function print_href(href) {
    return `<h1>${href}</h1>`;
}

function print_entry(entry) {
    return `<p>${JSON.stringify(entry)}</p>`
}

function print_entries(entries) {
    return entries.map((entry) => print_entry(entry)).join();
}

function print_href_and_entries(href, entries) {
    return [print_href(href), print_entries(entries)].join()
}
  
function got_container_timing_entries(href, entries) {
    href_to_container_roots[href] = entries
    console.log(href_to_container_roots)
    const entries_element = document.querySelector("#entries");
    entries_element.innerHTML = print_href_and_entries(href, entries);
}

const background_page_connection = chrome.runtime.connect({
    name: 'panel'
});

background_page_connection.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Panel: onMessage");
    switch(message.name) {
        case 'refresh':
            refresh();
            break;
        case 'got-container-timing-entries':
            got_container_timing_entries(message.href, message.entries);
            break;

    }
})

background_page_connection.postMessage({
    name: 'panel-init',
    tab_id: chrome.devtools.inspectedWindow.tabId
})


