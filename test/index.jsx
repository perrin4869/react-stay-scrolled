import React, {
  StrictMode, useState, useRef, useEffect, useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import PropTypes from 'prop-types';
import Velocity from 'velocity-animate';
import jQuery from 'jquery';
import dynamics from 'dynamics.js';
import sinon from 'sinon';
import { expect } from 'chai';

import useStayScrolled from '../src';
import { maxScrollTop } from '../src/util';

const noop = () => {};

describe('react-stay-scrolled', () => {
  const testHeight = 30;
  const testScrollHeight = 100;

  const TestComponent = ({
    provideControllers = () => {},
    onScroll = () => {},
    ...props
  }) => {
    const ref = useRef(null);
    provideControllers(useStayScrolled(ref, props));

    const style = {
      height: testHeight,
      width: 100,
      overflow: 'auto',
    };

    return (
      <div ref={ref} style={style} onScroll={onScroll}>
        <div style={{ height: testScrollHeight, width: 100 }} />
      </div>
    );
  };

  TestComponent.propTypes = {
    onScroll: PropTypes.func,
    provideControllers: PropTypes.func,
  };

  TestComponent.defaultProps = {
    onScroll: () => {},
    provideControllers: () => {},
  };

  function isScrolled(node) {
    return node.scrollTop === maxScrollTop(node);
  }

  function render(element, container, cb = noop) {
    act(() => {
      ReactDOM.render((
        <StrictMode>
          {element}
        </StrictMode>
      ), container, cb);
    });
  }

  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('general', () => {
    it('should render single div', () => {
      render(<TestComponent />, container);
      expect(container.childNodes.length).to.equal(1);
      expect(container.firstChild.tagName).to.equal('DIV');
    });

    it('should start with scrolled element', () => {
      render(<TestComponent initialScroll={Infinity} />, container);

      expect(container.firstChild.scrollHeight).to.equal(testScrollHeight);
      expect(isScrolled(container.firstChild)).to.equal(true);
    });

    it('should not call onScrolled when starting scrolled', () => {
      const spy = sinon.spy();

      render(<TestComponent initialScroll={Infinity} onScrolled={spy} />, container);

      expect(spy.called).to.equal(false);
    });

    it('should not start with scrolled element', () => {
      render(<TestComponent />, container);

      expect(container.firstChild.scrollTop).to.equal(0);
      expect(isScrolled(container.firstChild)).to.equal(false);
    });

    it('should fire onScrolled when calling scrollBottom control', () => {
      let scrollBottom;
      const storeController = (controllers) => { ({ scrollBottom } = controllers); };

      return new Promise((resolve) => {
        render(<TestComponent provideControllers={storeController} onScrolled={() => resolve()} />, container);
        scrollBottom();
      });
    });

    it('should scroll to bottom when calling scrollBottom', () => {
      let scrollBottom;
      const storeController = (controllers) => { ({ scrollBottom } = controllers); };

      render(<TestComponent provideControllers={storeController} />, container);

      expect(isScrolled(container.firstChild)).to.equal(false);
      scrollBottom();
      expect(isScrolled(container.firstChild)).to.equal(true);
    });

    it('should stay scrolled when calling stayScrolled and starting scrolled', async () => {
      let stayScrolled;
      const storeController = (controllers) => { ({ stayScrolled } = controllers); };

      await new Promise((resolve) => {
        render(
          <TestComponent
            initialScroll={Infinity}
            onScrolled={() => resolve()}
            provideControllers={storeController}
          />,
          container,
        );

        expect(stayScrolled()).to.equal(true);
      });

      expect(isScrolled(container.firstChild)).to.equal(true);
    });

    it('should not stay scrolled when calling stayScrolled and not starting scrolled', () => {
      let stayScrolled;
      const onScrolled = sinon.spy();
      const storeController = (controllers) => { ({ stayScrolled } = controllers); };

      render(
        <TestComponent
          onScrolled={onScrolled}
          provideControllers={storeController}
        />,
        container,
      );

      expect(stayScrolled()).to.equal(false);
      expect(onScrolled.called).to.equal(false);
      expect(isScrolled(container.firstChild)).to.equal(false);
    });

    it('should stay scrolled when adding new elements', (done) => {
      const Messages = () => {
        const [messages, setMessages] = useState([]);
        const ref = useRef(null);

        const addMessage = () => {
          setMessages(prevMessages => prevMessages.concat(['foo']));
        };

        const { stayScrolled } = useStayScrolled(ref);

        useEffect(() => { addMessage(); }, []);
        useLayoutEffect(() => {
          expect(stayScrolled()).to.equal(true);
          expect(isScrolled(ref.current)).to.equal(true);

          if (messages.length > 4) {
            done(); // After 5 messages stop
          } else {
            addMessage();
          }
        }, [messages]);

        const style = {
          height: testHeight,
          width: 100,
          overflow: 'auto',
        };

        return (
          <div ref={ref} style={style}>
            {messages.map((message, i) => (
              <div key={i} style={{ height: testScrollHeight, width: 100 }}>{message}</div> // eslint-disable-line react/no-array-index-key
            ))}
          </div>
        );
      };

      render(<Messages />, container);
    });
  });

  describe('accuracy', () => {
    it('should stay scrolled only when below inaccuracy', function (done) {
      this.timeout(5000);
      const inaccuracy = 5;

      const recursion = (i) => {
        let stayScrolled;
        const storeController = (controllers) => { ({ stayScrolled } = controllers); };

        const onScroll = () => {
          const dom = container.firstChild;
          const domMaxScrollTop = maxScrollTop(dom);
          const expectedResult = i >= domMaxScrollTop - inaccuracy;

          expect(stayScrolled()).to.equal(expectedResult);
          expect(isScrolled(dom)).to.equal(expectedResult);

          act(() => {
            ReactDOM.unmountComponentAtNode(container);
          });

          if (i < domMaxScrollTop) {
            recursion(i + 1);
          } else {
            done();
          }
        };

        render(<TestComponent
          initialScroll={i}
          inaccuracy={inaccuracy}
          onScroll={onScroll}
          provideControllers={storeController}
        />, container);
      };

      recursion(1);
    });
  });

  describe('invariant', () => {
    it('should throw when calling scrollBottom from mounted child', (done) => {
      const Child = ({ scrollBottom }) => {
        useLayoutEffect(() => {
          expect(scrollBottom).to.throw(Error, /hook finished mounting/);
          done();
        }, []);

        return null;
      };

      const Parent = () => {
        const ref = useRef(null);
        const { scrollBottom } = useStayScrolled(ref);

        return (
          <div ref={ref}>
            <Child scrollBottom={scrollBottom} />
          </div>
        );
      };


      render(<Parent />, container);
    });
  });

  describe('animation', () => {
    const duration = 100;
    const easing = 'linear';

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
        },
      );
    };

    const testAnimation = (runScroll) => {
      let scrollBottom;
      const storeController = (controllers) => { ({ scrollBottom } = controllers); };
      const onScroll = sinon.spy(() => {
        expect(container.firstChild.scrollTop).to.be.above(0);
        expect(container.firstChild.scrollTop).to.be.most(maxScrollTop(container.firstChild));
      });

      render(
        <TestComponent
          onScroll={onScroll}
          provideControllers={storeController}
          runScroll={runScroll}
        />,
        container,
      );

      expect(isScrolled(container.firstChild)).to.equal(false);
      scrollBottom();

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(onScroll.callCount).to.be.above(4);
          expect(isScrolled(container.firstChild)).to.equal(true);
          resolve();
        }, duration * 1.5);
      });
    };

    const testAnimationOnScrolled = (runScroll) => {
      let scrollBottom;
      const spy = sinon.spy();
      const storeController = (controllers) => { ({ scrollBottom } = controllers); };
      const onScroll = sinon.spy(() => {
        expect(spy.called).to.equal(false);
      });

      render(
        <TestComponent
          onScroll={onScroll}
          onScrolled={spy}
          provideControllers={storeController}
          runScroll={runScroll}
        />,
        container,
      );

      expect(spy.called).to.equal(false);
      scrollBottom();

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(onScroll.callCount).to.be.above(4);
          expect(spy.called).to.equal(true);
          resolve();
        }, duration * 1.5); // jQuery needs extra time, guarantee completion with 1.5 times the duration
      });
    };

    it('should animate scrolling with dynamics.js', () => testAnimation(dynamicsRunScroll));
    it('should call onScrolled when using dynamics.js', () => testAnimationOnScrolled(dynamicsRunScroll));
    it('should animate scrolling with velocity', () => testAnimation(velocityRunScroll));
    it('should call onScrolled when using velocity', () => testAnimationOnScrolled(velocityRunScroll));
    it('should animate scrolling with jquery', () => testAnimation(jqueryRunScroll));
    it('should call onScrolled when using jquery', () => testAnimationOnScrolled(jqueryRunScroll));
  });
});
