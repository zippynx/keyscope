# KeyScope

A modern keyboard event inspector built with pure HTML, CSS, and JavaScript.

KeyScope helps developers inspect and understand browser keyboard events in real time through a clean interface inspired by modern developer tools.

## Overview

KeyScope visualizes JavaScript `KeyboardEvent` properties as keys are pressed, making it useful for debugging shortcuts, testing keyboard interactions, and learning how keyboard events behave across browsers.

Built with zero dependencies and designed with a modern developer-focused UI.

## Features

* Real-time keyboard event inspection
* Live display of:

  * `event.key`
  * `event.code`
  * `event.which`
  * `event.keyCode`
* Smart key formatting for:

  * Space
  * Enter
  * Arrow keys
  * Special keys
* Automatic key classification

  * Printable
  * Modifier
  * Navigation
  * Function
  * Special
* Live modifier state tracking

  * Ctrl
  * Shift
  * Alt
  * Meta
  * Caps Lock
* Keyboard history panel
* Copy-to-clipboard support
* Deprecated event indicators
* Dark mode and light mode
* Responsive layout for desktop and mobile devices
* Accessibility-focused interactions
* No frameworks or external libraries

## Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript

## Project Structure

```text
keyscope/
├── index.html
├── style.css
├── keycodes.js
└── README.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/zippynx/keyscope.git
```

Open the project directory:

```bash
cd keyscope
```

Run the project using a local development server.

Example with VS Code Live Server:

```bash
Right Click → Open with Live Server
```

Or simply open `index.html` in your browser.