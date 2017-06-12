# react-stay-scrolled

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][dependency-status-badge]][dependency-status]
[![devDependency Status][dev-dependency-status-badge]][dev-dependency-status]

> Keep your component, such as message boxes, scrolled down

## Live demo

You can see the simplest demo here: [Live demo](https://perrin4869.github.io/react-stay-scrolled)

## Install

```
$ npm install --save react-stay-scrolled
```

## Usage

`react-stay-scrolled` injects methods `stayScrolled` and `scrollBottom` to its children through the `scrolled` higher order component:

```javascript
// messages.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StayScrolled from 'react-stay-scrolled';
import Message from './message.jsx';

const Messages = ({ messages }) => (
  <StayScrolled component="div">
  {
    messages.map(
      (message, i) => <Message key={i} text={message} />
    )
  }
  </StayScrolled>
);

Messages.propTypes = {
  messages = PropTypes.array
}
```

```javascript
// message.jsx
import React, { Component, propTypes } from 'react';
import { scrolled } from 'react-stay-scrolled';

class Message extends Component {
  static propTypes = {
    stayScrolled: PropTypes.func,
    scrollBottom: PropTypes.func,
  }

  componentDidMount() {
    const { stayScrolled, scrollBottom } = this.props;

    // Make the parent StayScrolled component scroll down if it was already scrolled
    stayScrolled();

    // Make the parent StayScrolled component scroll down, even if not completely scrolled down
    // scrollBottom();
  }

  render() {
    return (<div>{this.props.text}</div>);
  }
}

export default scrolled(Message);
```

The methods can also be called from the parent element:

```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StayScrolled from 'react-stay-scrolled';

class Messages extends Component {
  componentDidUpdate(prevProps) {
    if(prevProps.messages.length < this.props.messages.length)
      this.stayScrolled(); // Or: this.scrollBottom
  }

  storeScrolledControllers = ({ stayScrolled, scrollBottom }) => {
    this.stayScrolled = stayScrolled;
    this.scrollBottom = scrollBottom;
  }

  render() {
    const { messages } = this.props;

    return (
      <StayScrolled provideControllers={this.storeScrolledControllers}>
      {
        messages.map(
          (message, i) => <Message key={i} text={message} />
        )
      }
      </StayScrolled>
    );
  }
}
```

Another use case is notifying users when there is a new message down the window that they haven't read:

```javascript
// messages.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StayScrolled from 'react-stay-scrolled';
import Message from './message.jsx';

class Messages extends Component {
  state = {
    notifyNewMessage: false
  }

  onStayScrolled = (isScrolled) => {
    // Tell the user to scroll down to see the newest messages if the element wasn't scrolled down
    this.setState({ notifyNewMessage: !isScrolled });
  }

  onScrolled = () => {
    // The element just scrolled down - remove new messages notification, if any
    this.setState({ notifyNewMessage: false });
  }

  render() {
    const { messages } = this.props;
    const { notifyNewMessage } = this.state;

    return (
      <div>
        <StayScrolled
          component="div"
          onStayScrolled={this.onStayScrolled}
          onScrolled={this.onScrolled}
        >
        {
          messages.map(
            (message, i) => <Message key={i} text={message} />
          )
        }
        </StayScrolled>
        { notifyNewMessage && <div>Scroll down to new message</div> }
      </div>
    );
  }
}
```

## Props

### component

Type: a React `component`, default: `"div"`

Passed to `React.createElement`, used to wrap the children

### debug

Type: `function(msg)`, default `() => {}`

Used to log debug messages in StayScrolled, usually `(msg) => { console.log(msg); }`

### stayInaccuracy

Type: `number`, default: `0`

Defines an error margin, in pixels, under which `stayScrolled` will still scroll to the bottom

### provideControllers

Type: `function({ stayScrolled, scrollBottom })`, default: `null`

Used for getting scroll controllers to the parent elements, see the controller API below

### onStayScrolled

Type: `function(scrolled)`

Fires after executing `stayScrolled`, notifies back whether or not the component is scrolled down. Useful to know if you need to notify the user about new messages

### scrolled

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

## Controllers

Two methods used for controlling scroll behavior.
Can be accessed by children by injecting into props with `scrolled` higher order component, or via context.
Can be accessed by parents by passing `provideControllers` prop to `StayScrolled`.

### stayScrolled

Type: `function(notify = true)`

Scrolls down the element if it was already scrolled down - useful for when a user is reading previous messages, and you don't want to interrupt

#### notify

Type: `boolean` optional, default `true`.

If `true`, it fires an `onStayScrolled` event after execution, notifying whether or not the component stayed scrolled

### scrollDown

Type: `function()`

Scrolls down the wrapper element, regardless of current position

## Higher order component

### scrolled

Injects the above controllers, `stayScrolled` and `scrollBottom` to the props of a child element of `StayScrolled`

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
