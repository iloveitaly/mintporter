# Mintporter: Import Transactions in a CSV Into Mint

## Introduction

I wanted to import a CSV of transactions into Mint. To learn chrome extension development, I built this little tool.

Original template pulled from:

https://github.com/edrpls/chrome-extension-template

## Installation

Install dependencies:

```
npm install
```

## Usage

Once you load this extension into Chrome you'll see a "Import Transactions" button that allows you to import a list of transactions. Some details:

* The CSV you import has to have Date, Description, and Amount columns
* You can't post transactions to a specific account
* There's no way to differentiate between the raw credit card description and the description selection
* You'll want to tag the imported transactions with "Imported". This makes them searchable.

## Development

To run a development server that will watch for file changes and rebuild the scripts, run:

```
yarn start
```

To just build the files without the development server:

```
yarn build
```

Both commands will create a `dist/` directory, it will contain the built files that should be loaded into the browser or packed.

## Load into Chrome

To load the built files into Chrome, open [chrome://extensions/](chrome://extensions/).

Enable "Developer mode" if it's not enabled yet:

![Developer Mode Checkbox](assets/dev_mode.png)

Click on "Load unpacked":

![Load Unpacked Button](assets/load_unpacked.png)

Find the `dist/` directory on your system and open it.

The extension should be now at the top of the page:

![Extension Loaded](assets/ext_loaded.png)

Once the extension is loaded in you can just press the refresh button to load the latest version.

## Publishing

This extension is not published on the Chrome app store.

## External resources

*   [Original Extension Template](https://github.com/edrpls/chrome-extension-template)

*   [Chrome Developer Documentation](https://developer.chrome.com/extensions/devguide)

*   [Overview slides about Chrome Extensions](https://github.com/edrpls/chrome-extensions-what-why-how)
