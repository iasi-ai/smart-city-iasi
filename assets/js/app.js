'use strict';

/**
 * Object extend functionality.
 */
Object.prototype.extend = function () {
    for (let i = 0; i < arguments.length; i++) {
        let source = arguments[i];
        if (source !== undefined && source !== null) {
            for (let nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    if (typeof source[nextKey] !== 'object') {
                        this[nextKey] = source[nextKey];
                    }
                    else {
                        if (source[nextKey] !== null)
                            this[nextKey].extend(source[nextKey]);
                    }
                }
            }
        }
    }
};

/**
 * Event handling.
 *
 * @param el
 * @param ev
 * @param cb
 */
function addE(el, ev, cb) {

    if (undefined !== el && null !== el) {

        // Callback
        //
        let callback = (e) => {
            cb(e || window.event);
        };

        if (el.addEventListener) {
            el.addEventListener(ev, callback, false);
        }
        else if (el.attachEvent) {
            el.attachEvent(`on${ev}`, callback);
        }
    }
}

/**
 * XHR request.
 * @param args
 */
function req(args) {

    // Empty callback method
    //
    let empty = function () {
    };

    // Default options
    //
    let options = {
        method: 'GET',
        success: empty,
        warning: empty,
        error: empty,
        data: null
    };

    // Extend default options
    //
    options.extend(args);

    // Validate url
    //
    if (options.url === undefined) {
        throw new Error('Request url missing.');
    }

    // Create XHR request
    //
    let request = (window.ActiveXObject) ?
        new ActiveXObject('Microsoft.XMLHTTP') : (window.XMLHttpRequest) ? new XMLHttpRequest() : false;

    request.open(options.method, options.url, true);

    // POST or PUT request
    //
    if (options.method === 'POST' || options.method === 'PUT') {
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    // Set callbacks
    //
    request.onload = function () {

        // Success!
        //
        if (request.readyState === 4 && request.status === 200) {
            options.success(request.responseText);
        }

        // Reached destination, but error has been returned
        //
        else {
            options.warning();
        }
    };

    request.onerror = options.error();

    // Send payload
    //
    request.send(options.data);
}

/**
 * Initialize app.
 */
(() => {

    /**
     * Enable smooth scrolling.
     */
    document.querySelectorAll('nav ul.smart-city-verticals li a').forEach(i => {

        addE(i, 'click', e => {

            e.preventDefault();
            e.stopPropagation();

            let href = i.href,
                id = href.substr(href.indexOf('#')),
                area = document.querySelector(id);

            if (area !== null) {
                let coord = area.getBoundingClientRect();
                window.scrollTo(0, coord.y);
            }
        });
    });

    /**
     * Enable smart section expand/populating.
     */
    document.querySelectorAll('button[data-action],div.remoteCall[data-section]').forEach(i => {

        let id = i.getAttribute('data-action'),
            co = (id !== null) ? document.querySelector(id) : null;

        // Section expanding onClick
        //
        if (co !== null) {

            addE(i, 'click', e => {

                co.querySelectorAll('.markdown').forEach(i => {

                    let section = i.getAttribute('data-section'),
                        sectionStatus = i.getAttribute('data-section-status');

                    if (section !== null && sectionStatus !== null) {

                        let markdownFile = req({
                            url: `https://raw.githubusercontent.com/iasi-ai/smart-city-iasi/master/${section}/${sectionStatus}.md`,
                            success: s => {
                                i.innerHTML = marked(s, {headerIds: false});
                            }
                        });
                    }
                });

                co.classList.remove('hide');
                i.classList.add('hide');
            });
        }

        // Section dynamic loading from external Url
        //
        else {

            let section = i.getAttribute('data-section'),
                sectionStatus = i.getAttribute('data-section-status');

            if (section !== null && sectionStatus !== null) {

                let markdownFile = req({
                    url: `https://raw.githubusercontent.com/iasi-ai/smart-city-iasi/master/${section}/${sectionStatus}.md`,
                    success: s => {
                        i.innerHTML = marked(s, {headerIds: false});
                    },
                    error: e => {

                    }
                });
            }
        }
    });

})();