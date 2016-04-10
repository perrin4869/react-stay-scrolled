import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class StayScrolled extends Component {

  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    children: React.PropTypes.node,
    startScrolled: PropTypes.bool,
    onStayScrolled: PropTypes.func,
    onScrolled: PropTypes.func,
    stayInaccuracy: PropTypes.number,
    Velocity: PropTypes.func,
    debug: PropTypes.func,
  };

  static defaultProps = {
    component: 'div',
    startScrolled: true,
    stayInaccuracy: 0,
    debug: () => {},
  }

  static childContextTypes = {
    scrollBottom: PropTypes.func,
    stayScrolled: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.wasScrolled = props.startScrolled;
  }

  getChildContext() {
    return {
      scrollBottom: this.scrollBottom,
      stayScrolled: this.stayScrolled,
    };
  }

  componentDidMount() {
    const { startScrolled } = this.props;

    if (startScrolled) {
      this.scrollBottom();
    }
  }

  onScroll = () => {
    this.wasScrolled = this.isScrolled();

    if (this.wasScrolled && this.props.onScrolled) {
      this.props.onScrolled();
    }
  }

  getDOM = () => ReactDOM.findDOMNode(this.dom)

  storeDOM = (dom) => { this.dom = dom; }

  isScrolled() {
    const { stayInaccuracy, debug } = this.props;
    const dom = this.getDOM();
    const { scrollTop, clientHeight, scrollHeight } = dom;

    debug(`scollTop=${scrollTop}, clientHeight=${clientHeight}, scrollHeight=${scrollHeight}`);

    // scrollTop is a floating point, the rest are integers rounded up
    // naively: actualScrollHeight = scrollHeight - (Math.ceil(scrollTop) - scrollTop)
    return Math.ceil(scrollTop) + clientHeight >= (scrollHeight) - stayInaccuracy;
  }

  stayScrolled = (notify = true) => {
    const { onStayScrolled } = this.props;

    if (this.wasScrolled) {
      this.scrollBottom();
    }

    if (notify && onStayScrolled) {
      onStayScrolled(this.wasScrolled);
    }
  }

  scrollBottom = () => {
    const { Velocity, onScrolled } = this.props;
    const dom = this.getDOM();

    if (!dom) return; // Necessary in case this method is called before the component rendered

    if (Velocity) { // Use smooth scrolling if available
      Velocity(
        dom.firstChild,
        'scroll',
        {
          container: dom,
          offset: dom.scrollHeight,
          duration: 300,
          easing: 'ease-out',
          complete: onScrolled,
        }
      );
    } else {
      dom.scrollTop = dom.scrollHeight;

      if (onScrolled) {
        onScrolled();
      }
    }
  }

  render() {
    const { component, children, ...rest } = this.props;

    return (
      <component
        ref={this.storeDOM}
        onScroll={this.onScroll}
        {...rest}
      >
        {children}
      </component>
    );
  }

}
