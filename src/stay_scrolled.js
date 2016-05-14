import { PropTypes, Component, createElement } from 'react';
import ReactDOM from 'react-dom';

import { maxScrollTop } from './util.js';

const noop = () => {};

export default class StayScrolled extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    children: PropTypes.node,
    startScrolled: PropTypes.bool,
    onStayScrolled: PropTypes.func,
    onScroll: PropTypes.func,
    onScrolled: PropTypes.func,
    stayInaccuracy: PropTypes.number,
    provideControllers: PropTypes.func,
    Velocity: PropTypes.func,
    debug: PropTypes.func,
  }

  static defaultProps = {
    component: 'div',
    startScrolled: true,
    stayInaccuracy: 0,
    onScroll: noop,
    onScrolled: noop,
    onStayScrolled: noop,
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

  getDOM = () => ReactDOM.findDOMNode(this.dom)

  storeDOM = dom => { this.dom = dom; }

  isScrolled() {
    const dom = this.getDOM();
    const { stayInaccuracy } = this.props;

    // scrollTop is a floating point, the rest are integers rounded up
    // naively: actualScrollHeight = scrollHeight - (Math.ceil(scrollTop) - scrollTop)
    return Math.ceil(dom.scrollTop) >= maxScrollTop(dom) - stayInaccuracy;
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
    const { Velocity, debug } = this.props;
    const dom = this.getDOM();

    const { scrollHeight } = dom;

    debug(`Scrolling bottom: scrollHeight=${scrollHeight}`);

    if (Velocity) { // Use smooth scrolling if available
      Velocity(
        dom.firstChild,
        'scroll',
        {
          container: dom,
          offset: scrollHeight,
          duration: 300,
          easing: 'ease-out',
        }
      );
    } else {
      dom.scrollTop = scrollHeight;
    }
  }

  render() {
    const { component, children, ...rest } = this.props;
    const props = {
      ...rest,
      ref: this.storeDOM,
      onScroll: this.onScroll,
    };

    return createElement(component, props, children);
  }
}
