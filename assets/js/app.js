'use strict';

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
 * Initialize app.
 */
(() => {

    /**
     * Enable smooth scrolling.
     */
    document.querySelectorAll('nav ul li a').forEach(i => {

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
     * Enable smart section expand.
     */
    document.querySelectorAll('button[data-action]').forEach(i => {

        let id = i.getAttribute('data-action'),
            co = (id !== null) ? document.querySelector(id) : null;

        if (co !== null) {

            addE(i, 'click', e => {
                co.classList.remove('hide');
                i.classList.add('hide');
            });
        }
    });

})();