import { PropTypes, Component, createElement } from 'react';
import ReactDOM from 'react-dom';

export default class StayScrolled extends Component {

  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    children: PropTypes.node,
    startScrolled: PropTypes.bool,
    onStayScrolled: PropTypes.func,
    onScrolled: PropTypes.func,
    stayInaccuracy: PropTypes.number,
    triggerStayScrolled: PropTypes.any,
    triggerStayScrolledNotify: PropTypes.any,
    triggerScrollBottom: PropTypes.any,
    provideControllers: PropTypes.func,
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
      stayScrolled: this.stayScrolled,
      scrollBottom: this.scrollBottom,
    };
  }

  componentDidMount() {
    const { startScrolled, provideControllers } = this.props;

    if (startScrolled) {
      this.scrollBottom();
    }

    if (provideControllers) {
      provideControllers({
        stayScrolled: this.stayScrolled,
        scrollBottom: this.scrollBottom,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { triggerStayScrolled, triggerStayScrolledNotify, triggerScrollBottom } = this.props;
    if (triggerStayScrolled !== nextProps.triggerStayScrolled) {
      this.stayScrolled(false);
    } else if (triggerStayScrolledNotify !== nextProps.triggerStayScrolledNotify) {
      this.stayScrolled(true);
    } else if (triggerScrollBottom !== nextProps.triggerScrollBottom) {
      this.scrollBottom();
    }
  }

  shouldComponentUpdate(nextProps) {
    // Update component only if the changes aren't a trigger
    const { triggerStayScrolled, triggerStayScrolledNotify, triggerScrollBottom } = this.props;
    return (
      triggerStayScrolled === nextProps.triggerStayScrolled &&
      triggerStayScrolledNotify === nextProps.triggerStayScrolledNotify &&
      triggerScrollBottom === nextProps.triggerScrollBottom
    );
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

    debug(`isScrolled: scollTop=${scrollTop}, clientHeight=${clientHeight}, scrollHeight=${scrollHeight}`);

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
    const { Velocity, onScrolled, debug } = this.props;
    const dom = this.getDOM();

    if (!dom) return; // Necessary in case this method is called before the component rendered

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
          complete: onScrolled,
        }
      );
    } else {
      dom.scrollTop = scrollHeight;

      if (onScrolled) {
        onScrolled();
      }
    }
  }

  render() {
    const { component, children, ...rest } = this.props;
    const props = {
      ref: this.storeDOM,
      onScroll: this.onScroll,
      ...rest,
    };

    return createElement(component, props, children);
  }

}
