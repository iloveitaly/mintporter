// https://stackoverflow.com/questions/34338411/how-to-import-jquery-using-es6-syntax
import $ from 'jquery';

class MintContext {
    constructor() {
        // this.token = $("#javascript-token").value
    }
}

class MintIntegrator {
    constructor() {
        this.context = new MintContext();
    }

    addTransaction() {

    }
}

$(document).ready(() => {
    // var integrator = new MintIntegrator();
    // integrator.addTransaction()

    // $("#controls-top").append('<a class="btn btn-hollow btn-sm" href="javascript://" id="controls-import" title="Import Transactions">Import Transactions</a>')
    // debugger
    // let target = $("#body-mint").get();
    
    // let observer = new MutationObserver((mutationsList, observer) => console.log(mutationsList));
    // let config = { attributes: false, childList: false, subtree: true };

    // observer.observe(target, config);

    // Later, you can stop observing
    // observer.disconnect();

    // function boom() {

    //     if ($("#product-view-root").size() > 0) {
    //         console.log("retry!")
    //       window.requestAnimationFrame(boom);
    //     } else {
    //         console.log("got it!")
    //     //    $("#product-view-root").do_some_stuff();
    //      }
    //   }

    //   boom()
    // https://swizec.com/blog/how-to-properly-wait-for-dom-elements-to-show-up-in-modern-browsers/swizec/6663
    // https://gist.github.com/chrisjhoughton/7890303
    /**
 * Wait for the specified element to appear in the DOM. When the element appears,
 * provide it to the callback.
 *
 * @param selector a jQuery selector (eg, 'div.container img')
 * @param callback function that takes selected element (null if timeout)
 * @param maxtries number of times to try (return null after maxtries, false to disable, if 0 will still try once)
 * @param interval ms wait between each try
 */
function waitForEl(selector, callback, maxtries = false, interval = 100) {
    const poller = setInterval(() => {
      const el = $(selector)
      const retry = maxtries === false || maxtries-- > 0
      if (retry && el.length < 1) return // will try again
      clearInterval(poller)
      callback(el || null)
    }, interval)
  }

    // $.when($('#controls-top')).then((self) => {
    //     debugger
        // $("#controls-top").append('<a class="btn btn-hollow btn-sm" href="javascript://" id="controls-import" title="Import Transactions">Import Transactions</a>')
    // });

    waitForEl('#controls-top', (el) => {
        let importButton = $.parseHTML('<a class="btn btn-hollow btn-sm" href="javascript://" id="controls-import" title="Import Transactions">Import Transactions</a>')
        $("#controls-top").append(importButton)
    })
})


// $(document).ajaxStop(() => console.log("done!"))

// https://stackoverflow.com/questions/17986020/chrome-extension-javascript-to-detect-dynamically-loaded-content
// $(document).bind("DOMSubtreeModified", () => console.log("test"))