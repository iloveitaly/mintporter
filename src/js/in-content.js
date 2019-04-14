// https://stackoverflow.com/questions/34338411/how-to-import-jquery-using-es6-syntax
import $ from 'jquery';

class MintContext {
    constructor() {
        // this.token = $("#javascript-token").value
    }

    token() {
        // you can't access the page's JS objects, so Mint.getToken() is not available
        // additionally, javascript-token is not filled in till a while later
        // best option available to us is pulling the CSRF from the session, which is
        // accessible across browser windows

        return window.sessionStorage.getItem("CSRF");
    }

    accountId() {
        debugger
    }
}

class MintIntegrator {
    constructor() {
        this.context = new MintContext();
        this.addTransactionEndpoint = "https://mint.intuit.com/updateTransaction.xevent";
    }

    addTransaction(date, merchant, amount) {
        let transactionData = {
            "cashTxnType": "on",
            "mtCashSplit": "on",
            // mtCheckNo=&
            "task":"txnadd",
            "txnId":":0",
            "mtType":"cash",
            "mtAccount":"3444067",
            // symbol=&
            // note=&
            "isInvestment":"false",
            "catId":"7",
            // category=Food%20%26%20Dining&

            "merchant": merchant,
            "date": date,
            "amount": amount,

            "mtIsExpense":"true",
            "mtCashSplitPref":"1",
            "token": this.context.token()
        };

        $.ajax({
            method: "POST",
            url: this.addTransactionEndpoint,
            data: transactionData
        }).then((data, status) => console.log(data))
    }
}

$(document).ready(() => {
    // removes the annoying mint ads
    $('head').append('<style type="text/css">.offerSection { display: none !important; }</style>');

    // https://swizec.com/blog/how-to-properly-wait-for-dom-elements-to-show-up-in-modern-browsers/swizec/6663
    // https://gist.github.com/chrisjhoughton/7890303
    function waitForEl(selector, callback, maxtries = false, interval = 100) {
        const poller = setInterval(() => {
            const el = $(selector)
            const retry = maxtries === false || maxtries-- > 0
            if (retry && el.length < 1) return // will try again
            clearInterval(poller)
            callback(el || null)
        }, interval)
    }

    waitForEl('#controls-top', (el) => {
        let fileInput = $.parseHTML('<input type="file" style="display: none" />');
        let importButton = $.parseHTML('<a class="btn btn-hollow btn-sm" title="Import Transactions">Import Transactions</a>')

        $("#controls-top").append(importButton).append(fileInput)

        // you can only trigger a file load during a user-initiated click event
        // https://stackoverflow.com/questions/5872815/reading-local-files-with-input-type-file
        // https://mariusschulz.com/blog/programmatically-opening-a-file-dialog-with-javascript

        $(fileInput).on('change', (evt) => {
            var f = evt.target.files[0];

            if (f) {
                var r = new FileReader();
                r.onload = function(e){          
                    console.log(e.target.result);
                };

                r.readAsText(f);
            } else 
            {
                console.log("failed");
            }
        })

        $(importButton).on('click', () => {
            $(fileInput).trigger('click')
            // var integrator = new MintIntegrator();
            // integrator.addTransaction("04/12/2019", "ROBOT", "1")      
        })
    })
})


// $(document).ajaxStop(() => console.log("done!"))

// https://stackoverflow.com/questions/17986020/chrome-extension-javascript-to-detect-dynamically-loaded-content
// $(document).bind("DOMSubtreeModified", () => console.log("test"))