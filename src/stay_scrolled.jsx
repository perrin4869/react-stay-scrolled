import React, { Component, createElement, createRef } from 'react';
import PropTypes from 'prop-types';
import ScrolledContext from './context';
import { maxScrollTop, runScroll as defaultRunScroll } from './util';

const noop = () => {};

export default class StayScrolled extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    children: PropTypes.node,
    startScrolled: PropTypes.bool,
    onStayScrolled: PropTypes.func,
    onScroll: PropTypes.func,
    onScrolled: PropTypes.func,
    runScroll: PropTypes.func,
    stayInaccuracy: PropTypes.number,
    provideControllers: PropTypes.func,
    debug: PropTypes.func,
  }

  static defaultProps = {
    children: null, // TODO
    component: 'div',
    startScrolled: true,
    stayInaccuracy: 0,
    onScroll: noop,
    onScrolled: noop,
    onStayScrolled: noop,
    runScroll: defaultRunScroll,
    provideControllers: noop, // TODO
    debug: noop,
  }

  dom = createRef()

  componentDidMount() {
    const { startScrolled, provideControllers } = this.props;

    this.wasScrolled = startScrolled || this.isScrolled();

    if (startScrolled) {
      this.scrollBottom(false);
    }

    provideControllers({
      stayScrolled: this.stayScrolled,
      scrollBottom: this.scrollBottom,
    });
  }

  onScroll = () => {
    const isScrolled = this.wasScrolled = this.isScrolled();
    const { onScroll, onScrolled } = this.props;

    onScroll();
    if (isScrolled) {
      onScrolled();
    }
  }

  getDOM() {
    return this.dom.current;
  }

  scrollBottom = () => {
    const dom = this.getDOM();
    const offset = maxScrollTop(dom);
    const { runScroll, debug } = this.props;

    debug(`Scrolling bottom: scrollOffset=${offset}`);

    runScroll(dom, offset);
  }

  stayScrolled = (notify = true) => {
    const { onStayScrolled } = this.props;

    if (this.wasScrolled) {
      this.scrollBottom();
    }

    if (notify) {
      onStayScrolled(this.wasScrolled);
    }
  }

  isScrolled() {
    const { stayInaccuracy } = this.props;
    const dom = this.getDOM();

    // scrollTop is a floating point, the rest are integers rounded up
    // naively: actualScrollHeight = scrollHeight - (Math.ceil(scrollTop) - scrollTop)
    return Math.ceil(dom.scrollTop) >= maxScrollTop(dom) - stayInaccuracy;
  }

  render() {
    const {
      component,
      children,
      startScrolled, // eslint-disable-line no-unused-vars
      onStayScrolled, // eslint-disable-line no-unused-vars
      onScroll, // eslint-disable-line no-unused-vars
      onScrolled, // eslint-disable-line no-unused-vars
      runScroll, // eslint-disable-line no-unused-vars
      stayInaccuracy, // eslint-disable-line no-unused-vars
      provideControllers, // eslint-disable-line no-unused-vars
      debug, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;

    const props = {
      ...rest,
      ref: this.dom,
      onScroll: this.onScroll,
    };

    const context = {
      stayScrolled: this.stayScrolled,
      scrollBottom: this.scrollBottom,
    };

    return (
      <ScrolledContext.Provider value={context}>
        {createElement(component, props, children)}
      </ScrolledContext.Provider>
    );
  }
}
