# Mintporter: Import Transactions Into Mint

## Introduction

This project aims to provide an easy to use boilerplate for chrome extensions, showcasing communication between its different scripts.

Not all extensions will need of all scripts or all types of messaging. All code snippets are optional. Text and images should be replaced with your own.

## Installation

Install dependencies:

```
yarn install # or npm install
```

## Usage

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

## Publishing

This extension is not published on the Chrome app store. 

## External resources

*   [Original Extension Template](https://github.com/edrpls/chrome-extension-template)

*   [Chrome Developer Documentation](https://developer.chrome.com/extensions/devguide)

*   [Overview slides about Chrome Extensions](https://github.com/edrpls/chrome-extensions-what-why-how)
