import { PropTypes, Component, createElement } from 'react';
import { maxScrollTop, runScroll as defaultRunScroll } from './util.js';

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
    _provideDOMNode: PropTypes.func, // for testing only, don't use findDOMNode
  }

  static defaultProps = {
    component: 'div',
    startScrolled: true,
    stayInaccuracy: 0,
    onScroll: noop,
    onScrolled: noop,
    onStayScrolled: noop,
    runScroll: defaultRunScroll,
    debug: noop,
  }

  static childContextTypes = {
    scrollBottom: PropTypes.func,
    stayScrolled: PropTypes.func,
  }

  getChildContext() {
    return {
      stayScrolled: this.stayScrolled,
      scrollBottom: this.scrollBottom,
    };
  }

  componentDidMount() {
    const { startScrolled, provideControllers } = this.props;

    this.wasScrolled = startScrolled || this.isScrolled();

    if (startScrolled) {
      this.scrollBottom(false);
    }

    if (provideControllers) {
      provideControllers({
        stayScrolled: this.stayScrolled,
        scrollBottom: this.scrollBottom,
      });
    }
  }

  onScroll = () => {
    const isScrolled = this.wasScrolled = this.isScrolled();
    const { onScroll, onScrolled } = this.props;

    onScroll();
    if (isScrolled) {
      onScrolled();
    }
  }

  storeDOM = dom => {
    const { _provideDOMNode } = this.props;

    this.dom = dom;

    if (typeof _provideDOMNode === 'function') {
      _provideDOMNode(dom);
    }
  }

  isScrolled() {
    const { stayInaccuracy } = this.props;

    // scrollTop is a floating point, the rest are integers rounded up
    // naively: actualScrollHeight = scrollHeight - (Math.ceil(scrollTop) - scrollTop)
    return Math.ceil(this.dom.scrollTop) >= maxScrollTop(this.dom) - stayInaccuracy;
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

  scrollBottom = () => {
    const offset = maxScrollTop(this.dom);
    const { runScroll, debug } = this.props;

    debug(`Scrolling bottom: scrollOffset=${offset}`);

    runScroll(this.dom, offset);
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
      _provideDOMNode, // eslint-disable-line no-unused-vars
      ...rest,
    } = this.props;
    const props = {
      ...rest,
      ref: this.storeDOM,
      onScroll: this.onScroll,
    };

    return createElement(component, props, children);
  }
}
