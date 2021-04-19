// https://stackoverflow.com/questions/34338411/how-to-import-jquery-using-es6-syntax
import $ from 'jquery';
import Papa from 'papaparse';

class MintContext {
    token() {
        // you can't access the page's JS objects, so Mint.getToken() is not available
        // additionally, javascript-token is not filled in till a while later
        // best option available to us is pulling the CSRF from the session, which is
        // accessible across browser windows

        return window.sessionStorage.getItem("CSRF");
    }

    accountId() {
        let params = new URLSearchParams($('#transactionExport').search)
        params.get("accountId")
    }
}

class MintIntegrator {
    constructor() {
        this.context = new MintContext();
        this.addTransactionEndpoint = "https://mint.intuit.com/updateTransaction.xevent";
    }

   importFile(csvData) {
       let parsedCsv = Papa.parse(csvData, { header: true, skipEmptyLines: true })

        // make sure there are date, description, amount, and category headers
        const requiredFields = ["Date", "Description", "Amount"];
        if(!requiredFields.every(val => parsedCsv.meta.fields.includes(val))) {
            alert(`required fields do not exist: ${requiredFields}`)
            return
        }

        console.log("starting import")

        parsedCsv.data.forEach(row => {
            this.addTransaction(
                row["Date"],
                // TODO I wonder if Mint has a separate field for merchant vs description
                row["Description"],
                row["Amount"],
                row["Category"]
            )
        })

        console.log("import finished, refresh page")
    }

    addTransaction(date, merchant, amount, categoryDescription = null) {
        let isExpense = true;

        if(amount.includes('-')) {
            isExpense = false;
        }

        // https://stackoverflow.com/questions/559112/how-to-convert-a-currency-string-to-a-double-with-jquery-or-javascript
        amount = amount.replace(/[^0-9.-]+/g, "")

        let transactionData = {
            "cashTxnType": "on",
            "mtCashSplit": "on",
            // mtCheckNo=&
            "task":"txnadd",
            "txnId":":0",
            "mtType": "cash",
            // symbol=&
            "isInvestment":"false",

            // if catId is not specified, defaults to "UNCATEGORIZED"
            // "catId":"7",
            // category=Food%20%26%20Dining&
            // "category": categoryDescription,

            "merchant": merchant,

            "date": date,
            "amount": amount,
            "note": "Mintporter Transaction\n\n" + merchant,

            "mtIsExpense": isExpense,

            // flips the ATM option thing that mint has in the UI
            "mtCashSplitPref":"2",

            "tag1117357": "2",

            "token": this.context.token(),

            // the mtAccount doesn't have any effect on the API call
            // "mtAccount": this.context.accountId(),
        };

        const result = $.ajax({
            method: "POST",
            url: this.addTransactionEndpoint,
            data: transactionData,
            async: false
        })
    }
}

$(document).ready(() => {
    // removes the annoying mint ads
    $('head').append('<style type="text/css">.offerSection, .accounts-adv, .adviceWidget, .w2sWidget { display: none !important; }</style>');

    // mint loads sections of the page sequentially, we need to wait until the transaction list renders
    // to insert our "Import Transactions" button
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

    function chooseAndReadFile(callback) {
        let fileInput = $("#read-file-inline")

        if(fileInput.length > 0) {
            fileInput = fileInput
        } else {
            fileInput = $($.parseHTML('<input id="read-file-inline" type="file" style="display: none" />'));
            $('body').append(fileInput)
        }

        fileInput.off('change')

        // surprisingly, the only way to read a local file is watch for changes
        // in the file input area and use the FileReader class with a callback
        fileInput.on('change', (evt) => {
            const f = evt.target.files[0];

            if (f) {
                let r = new FileReader();

                r.onerror = e => callback(false, e)
                r.onload = e => callback(true, e.target.result)

                r.readAsText(f);
            } else {
                callback(false)
            }
        })

        // you can only trigger a file load during a user-initiated click event
        // https://stackoverflow.com/questions/5872815/reading-local-files-with-input-type-file
        // https://mariusschulz.com/blog/programmatically-opening-a-file-dialog-with-javascript
        $(fileInput).trigger('click')

        return fileInput;
    }

    const integrator = new MintIntegrator();
    // integrator.addTransaction("04/12/2019", "ROBOT", "1")

    // it takes a bit for mint to complete async calls and build the page content
    // wait until the "Add Transaction" button appears to setup the import button
    waitForEl('#controls-top', (el) => {
        let importButton = $.parseHTML('<a class="btn btn-hollow btn-sm" title="Import Transactions">Import Transactions</a>')

        $("#controls-top").append(importButton)

        $(importButton).on('click', () => {
            chooseAndReadFile((success, result) => {
                if(success) {
                    integrator.importFile(result)
                }
            })
        })
    })
})