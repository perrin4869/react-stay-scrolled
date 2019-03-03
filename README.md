# react-stay-scrolled

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][dependency-status-badge]][dependency-status]
[![devDependency Status][dev-dependency-status-badge]][dev-dependency-status]

> Keep your component, such as message boxes, scrolled down

## Live demo

You can see the simplest demo here: [Live demo](https://codesandbox.io/s/6w5vx7yvwk)

## Install

```
$ npm install --save react-stay-scrolled
```

## Examples

Run examples:

```javascript
cd examples
npm install
npm start
```

## Usage

```javascript
import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import useStayScrolled from 'react-stay-scrolled';

const Messages = ({ messages }) => {
  const listRef = useRef();
  const { stayScrolled/*, scrollBottom*/ } = useStayScrolled(listRef);

  // Typically you will want to use stayScrolled or scrollBottom inside
  // useLayoutEffect, because it measures and changes DOM attributes (scrollTop) directly
  useLayoutEffect(() => {
    stayScrolled();
  }, [messages.length])

  return (
    <ul ref={listRef}>
      {messages.map((message, i) => <Message key={i} text={message} />)}
    </ul>
  );
};

Messages.propTypes = {
  messages = PropTypes.array,
}
```

Another use case is notifying users when there is a new message down the window that they haven't read:

```javascript
// messages.jsx
import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import useStayScrolled from 'react-stay-scrolled';
import Message from './message.jsx';

const Messages = ({ messages }) => {
  const [notifyNewMessage, setNotifyNewMessage] = useState(false);
  const ref = useRef();

  // Tell the user to scroll down to see the newest messages if the element wasn't scrolled down
  const onStayScrolled = useCallback(isScrolled => setNotifyNewMessage(!isScrolled), []);

    // The element just scrolled down - remove new messages notification, if any
  const onScrolled = useCallback(() => setNotifyNewMessage(false), []);

  const { stayScrolled } = useStayScrolled(ref, {
    onScrolled,
    onStayScrolled,
  });

  useLayoutEffect(() => {
    stayScrolled();
  }, [messages.length])

  return (
    <div ref={ref}>
      {messages.map((message, i) => <Message key={i} text={message} />)}
      {notifyNewMessage && <div>Scroll down to new message</div>}
    </div>
  );
};
```

## Arguments

### ref

Type: a React `ref`, required

A `ref` to the DOM element whose scroll position you want to control

### options

Type: `object`, default: ```javascript
{
  initialScroll: null,
  inaccuracy: 0,
  onStayScrolled: noop,
  onScrolled: noop,
  runScroll: defaultRunScroll,
}
```

### options.initialScroll

Type: `number`, default: `null`

If provided, the scrolling element will mount scrolled with the provided value. If `Infinity` is provided, it will mount scrolled to the bottom.

### options.innacuracy

Type: `number`, default: `0`

Defines an error margin, in pixels, under which `stayScrolled` will still scroll to the bottom

### options.onStayScrolled

Type: `function(scrolled)`

Fires after executing `stayScrolled`, notifies back whether or not the component is scrolled down. Useful to know if you need to notify the user about new messages

#### scrolled

Type: `boolean`

True if the call to `stayScrolled` performed a scroll to bottom, false otherwise

### onScrolled

Type: `function()`

Fires when the element scrolls down, useful to remove the new message notification

### runScroll

Type: `function(dom, offset)`, default: `(dom, offset) => { dom.scrollTop = offset; }`

Used for animating dom scrolling. You can use [dynamic.js](http://dynamicsjs.com/), [Velocity](https://github.com/julianshapiro/velocity), [jQuery](https://jquery.com/), or your favorite animation library. Here are examples of possible, tested `runScroll` values:

```js
const easing = 'linear';
const duration = 100;

const dynamicsRunScroll = (dom, offset) => {
  dynamics.animate(dom, {
    scrollTop: offset,
  }, {
    type: dynamics[easing],
    duration,
  });
};

const jqueryRunScroll = (dom, offset) => {
  jQuery(dom).animate({ scrollTop: offset }, duration, easing);
};

const velocityRunScroll = (dom, offset) => {
  Velocity(
    dom.firstChild,
    'scroll',
    {
      container: dom,
      easing,
      duration,
      offset,
    }
  );
};
```

## Return value

Type: `object`, shape: `{ stayScrolled, scrollBottom }`

Two functions used for controlling scroll behavior.

### stayScrolled

Type: `function(notify = true)`

Scrolls down the element if it was already scrolled down - useful for when a user is reading previous messages, and you don't want to interrupt

#### notify

Type: `boolean` optional, default `true`.

If `true`, it fires an `onStayScrolled` event after execution, notifying whether or not the component stayed scrolled

### scrollDown

Type: `function()`

Scrolls down the wrapper element, regardless of current position

## TODO

* Try to automate scrolling on some of the use-cases
* Improve examples

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/travis/perrin4869/react-stay-scrolled/master.svg?style=flat-square
[build]: https://travis-ci.org/perrin4869/react-stay-scrolled

[npm-badge]: https://img.shields.io/npm/v/react-stay-scrolled.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-stay-scrolled

[coveralls-badge]: https://img.shields.io/coveralls/perrin4869/react-stay-scrolled/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/perrin4869/react-stay-scrolled

[dependency-status-badge]: https://david-dm.org/perrin4869/react-stay-scrolled.svg?style=flat-square
[dependency-status]: https://david-dm.org/perrin4869/react-stay-scrolled

[dev-dependency-status-badge]: https://david-dm.org/perrin4869/react-stay-scrolled/dev-status.svg?style=flat-square
[dev-dependency-status]: https://david-dm.org/perrin4869/react-stay-scrolled#info=devDependencies
