# react-stay-scrolled

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
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

`react-stay-scrolled` injects methods `stayScrolled` and `scrollBottom` to its children through the `context`:

```js
import React, { Component, PropTypes } from 'react';
import StayScrolled from 'react-stay-scrolled';

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
          onScrolled={this.onScrolled}>
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

class Message extends Component {

  static contextTypes = {
    stayScrolled: PropTypes.func
  }

  componentDidMount() {
    const { stayScrolled, scrollDown } = this.context;

    // Make the parent StayScrolled component scroll down if it was already scrolled
    stayScrolled();

    // Make the parent StayScrolled component scroll down, even if reading previous messages
    // scrollDown();
  }

  render() {
    return (<div>{this.props.text}</div>);
  }

}

```

The methods can also be called directly from the `StayScrolled` element instance:

```js
import React, { Component, PropTypes } from 'react';
import StayScrolled from 'react-stay-scrolled';
import Velocity from 'velocity';

class Messages extends Component {

  componentDidUpdate(prevProps) {
    if(prevProps.messages.length < this.props.messages.length)
      this.stayScrolledElem.stayScrolled(); // Or: this.stayScrolledElem.scrollDown
  }

  render() {
    const { messages } = this.props;

    return (
      <StayScrolled Velocity={Velocity} ref={c => { this.stayScrolledElem = c; }}>
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

## Props

### component

Type: a React `component`, default: `"div"`. Passed to `React.createElement`, used to wrap the children

### debug

Type: a function, used to log debug messages in StayScrolled, usually `(msg) => { console.log(msg); }`

### stayAccuracy

Type: number, default: 0, defines an error margin, in pixels, under which `stayScrolled` will still scroll to the bottom

### triggerStayScrolled

Type: any, upon modification, a stay scrolled is triggered, without triggering an event notification

### triggerStayScrolledNotify

Type: any, upon modification, a stay scrolled is triggered, triggering an event notification

### triggerScrollBottom

Type: any, upon modification, a scroll bottom is triggered

### Velocity

Type: `function` optional, default: `null`

If passed, scroll will be performed with a smooth animation powered by the Velocity instance passed

### onStayScrolled(scrolled)

Type: function, fires after executing `stayScrolled`, notifies back whether or not the component is scrolled down. Useful to know if you need to notify the user about new messages

### onScrolled()

Type: function, fires when the element scrolls down, useful to remove the new message notification

## Methods

### stayScrolled(notify = true)

Scrolls down the element if it was already scrolled down - useful for when a user is reading previous messages, and you don't want to interrupt

Can be accessed directly or via context

#### notify

Type: `boolean` optional, default `true`. If `true`, it fires an `onStayScrolled` event after execution, notifying whether or not the component stayed scrolled

### scrollDown()

Scrolls down the wrapper element, regardless of current position

Can be accessed directly or via context

## TODO

* Try to automate scrolling on some of the use-cases
* Support jQuery for animation
* Improve examples
* Improve documentation with tables, etc
* Test

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/travis/perrin4869/react-stay-scrolled/master.svg?style=flat-square
[build]: https://travis-ci.org/perrin4869/react-stay-scrolled

[npm-badge]: https://img.shields.io/npm/v/react-stay-scrolled.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-stay-scrolled

[dependency-status-badge]: https://david-dm.org/perrin4869/react-stay-scrolled.svg?style=flat
[dependency-status]: https://david-dm.org/perrin4869/react-stay-scrolled

[dev-dependency-status-badge]: https://david-dm.org/perrin4869/react-stay-scrolled/dev-status.svg?style=flat
[dev-dependency-status]: https://david-dm.org/perrin4869/react-stay-scrolled#info=devDependencies
