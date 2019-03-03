/*
 * Smart City Iași
 *
 * Smart City Iași presentation website developed by IAȘI AI community
 * in collaboration with Iași City Hall.
 *
 * @author Eugen <eugen@iasi.ai>
 * @copyright © All rights reserved
 */

'use strict';

if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target === null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            let to = Object(target);
            for (let index = 1; index < arguments.length; index++) {
                let nextSource = arguments[index];

                if (nextSource !== null) { // Skip over if undefined or null
                    for (let nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

/**
 * Iași Smart City App.
 */
class IasiSmartCityApp {

    // Constructor
    //
    constructor() {

        // Callable methods
        //
        this.callable = [];
    }

    /**
     * Perform HTTP request.
     *
     * @param args
     */
    static httpRequest(args) {

        // Empty callback method
        //
        let empty = () => {
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
        options = Object.assign(options, args);

        // Validate url
        //
        if (options.url === undefined) {
            throw new Error('[httpRequest] URL missing.');
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
        request.onload = () => {

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
     * Register callable method.
     *
     * @param name Callable method name
     * @param callable Callable method
     */
    registerCallable(callable, name = null) {

        // Callable must be function
        //
        if (typeof callable === 'function') {
            this.callable[name === null ? Math.random().toString(36).substr(2, 9) : name] = callable;
        }
    }

    /**
     * Run callable registered methods.
     */
    runCallable(name = null) {

        // Run all callables
        //
        if (name === null) {
            for (let index in this.callable) {
                this.callable[index]();
            }
        }

        else {
            if (this.callable.hasOwnProperty(name)) {
                this.callable[name]();
            }
            else {
                throw new Error(`[Callable] ${name} key missing.`);
            }
        }
    }
}

/**
 * Initialize app.
 */
(() => {

    /**
     * Create a new instance of IasiSmartCityApp.
     *
     * @type {IasiSmartCityApp}
     */
    const app = new IasiSmartCityApp();

    /**
     * Enable smooth scrolling for each Smart City vertical.
     */
    app.registerCallable(() => {

        let verticals = document.querySelectorAll('nav ul.smart-city-verticals li a');
        if (verticals !== null) {
            verticals.forEach(v => {
                v.addEventListener('click', e => {

                    e.preventDefault();
                    e.stopPropagation();

                    let href = v.href,
                        id = href.substr(href.indexOf('#')),
                        area = document.querySelector(id);

                    if (area !== null) {
                        let coord = area.getBoundingClientRect();
                        window.scrollTo(0, coord.y);
                    }
                });
            });
        }
    });

    /**
     * Expand Smart City vertical details on click.
     */
    app.registerCallable(() => {

        let moreButtons = document.querySelectorAll('button[data-action],div.remoteCall[data-section]');
        if (moreButtons !== null) {

            moreButtons.forEach(button => {

                let id = button.getAttribute('data-action'),
                    placeholder = (id !== null) ? document.querySelector(id) : null;

                // Expand placeholder on click
                //
                if (placeholder !== null) {
                    button.addEventListener('click', e => {

                        e.preventDefault();
                        e.stopPropagation();

                        placeholder.querySelectorAll('.markdown').forEach(m => {

                            let section = m.getAttribute('data-section'),
                                sectionStatus = m.getAttribute('data-section-status');

                            if (section !== null && sectionStatus !== null) {
                                let markdownFile = IasiSmartCityApp.httpRequest({
                                    url: `https://raw.githubusercontent.com/iasi-ai/smart-city-iasi/master/${section}/${sectionStatus}.md`,
                                    success: s => {
                                        m.innerHTML = marked(s, {headerIds: false});
                                    }
                                });
                            }
                        });

                        placeholder.classList.remove('hide');
                        button.parentNode.removeChild(button);
                    });
                }

                else {

                    let section = i.getAttribute('data-section'),
                        sectionStatus = i.getAttribute('data-section-status');

                    if (section !== null && sectionStatus !== null) {
                        let markdownFile = req({
                            url: `https://raw.githubusercontent.com/iasi-ai/smart-city-iasi/master/${section}/${sectionStatus}.md`,
                            success: s => {
                                m.innerHTML = marked(s, {headerIds: false});
                            }
                        });
                    }
                }
            });
        }
    });

    /**
     * Automatically expand smart city vertical details on scroll.
     */
    app.registerCallable(() => {

        let sections = document.querySelectorAll('section'),
            offsets = {},
            i = 0,
            header = document.querySelector('header');

        // Update offsets
        //
        let updateSectionOffsets = () => {
            if (sections !== null) {
                sections.forEach(e => {
                    offsets[e.id] = e.offsetTop - parseInt(header.offsetHeight / 1.3);
                })
            }
        };

        // Fetch initial offsets
        //
        updateSectionOffsets();

        // Scroll event
        //
        window.onscroll = () => {

            let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

            for (i in offsets) {
                if (offsets[i] <= scrollPosition) {

                    // Open secton details
                    //
                    document.getElementById(i).querySelectorAll('button[data-action],div.remoteCall[data-section]').forEach(button => {
                        button.click();
                    });

                    updateSectionOffsets();
                }
            }
        };
    });

    /**
     * Fetching events from IAȘI events.
     */
    app.registerCallable(() => {

        let eventsPage = document.querySelector('.events-page'),
            awardsContainer = (eventsPage !== null) ? eventsPage.querySelector('.events-awards') : null;

        if (eventsPage !== null && awardsContainer !== null) {

            // Fetch events
            //
            IasiSmartCityApp.httpRequest({
                url: 'https://iasievents.ro/api/events/',
                success: response => {

                    // Parse response as JSON
                    //
                    const json = JSON.parse(response),
                        compiled = [];

                    // Has events
                    //
                    if (json.events !== null && json.events.length > 0) {
                        json.events.forEach(event => {

                            compiled.push(`<article><picture><img src="${event.cover}"/></picture><h3><a href="${event.url}" rel="external noopener" target="_blank">${event.name}</a></h3><span><span class="ic-mr-4" data-icon="p"></span> ${new Date(event.dateStart).toLocaleString("ro-RO", {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',hour: '2-digit',minute: '2-digit'})}</span><span><span class="ic-mr-4" data-icon="q"></span> ${event.venueName}</span></article>`);
                        });
                    }

                    awardsContainer.innerHTML = compiled.join('');
                }
            });
        }
    });

    /**
     * Run all defined callable methods.
     */
    app.runCallable();

})();