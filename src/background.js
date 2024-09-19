    console.log("Starting background script")
    let href_to_container_roots = {};
    let tab_id_to_port_map = {};
    let port_id_to_port_map = {};
    let port_id_to_tab_id_map = {};
    let last_port_id = 0;
  
    function refresh(port) {
        href_to_container_roots = {};
        console.log("Refresh received in background");
        if (port) {
            port.postMessage({
                name: 'refresh'
            })
        }
    }
      
    function got_container_timing_entries(port, href, entries) {
        console.log("Background: got entries")
        if (!("href" in href_to_container_roots)) {
            href_to_container_roots[href] = entries
        } else {
            href_to_container_roots[href].push(...entries)
        }
        
        console.log("Got entries!")
        console.log(href_to_container_roots)
        if (port) {
            port.postMessage({
                name: 'got-container-timing-entries',
                href: href,
                entries: entries
            })
        }
    }
    
    function send_initial_entries(port) {
        for (const [href, entries] of Object.entries(href_to_container_roots)) {
            port.postMessage({
                name: 'got-container-timing-entries',
                href: href,
                entries: entries
            })
        }
    }
    
    chrome.runtime.onConnect.addListener((port) => {
        console.log("Background: on connect");
        let port_id;
        port.onMessage.addListener((message, sender, sendResponse) => {
            switch (message.name) {
                case 'panel-init':
                    console.log("Panel registering");
                    port_id = ++last_port_id;
                    tab_id_to_port_map[message.tab_id] = port;
                    port_id_to_tab_id_map[port_id] = message.tab_id;
                    port_id_to_port_map[port_id] = port;
                    send_initial_entries(port);
                    break;
            }
        })
        port.onDisconnect.addListener(() => {
            const tab_id = port_id_to_tab_id_map[port_id];
    
            delete port_id_to_tab_id_map[port_id];
            delete port_id_to_port_map[port_id];
            delete tab_id_to_port_map[tab_id];
        })
    })
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const port = tab_id_to_port_map[sender.tab.id]
        console.log("Background: onMessage");
        console.log(message);
        switch (message.name) {
            case 'refresh':
                refresh(port)
                break;
            case 'got-container-timing-entries':
                got_container_timing_entries(port, message.href, message.entries)
                break;
        }
    })
