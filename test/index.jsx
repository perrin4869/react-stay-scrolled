import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Velocity from 'velocity-animate';
import jQuery from 'jquery';
import dynamics from 'dynamics.js';
import sinon from 'sinon';
import { expect } from 'chai';

import StayScrolled, { scrolled } from '../src';
import { maxScrollTop } from '../src/util';

describe('react-stay-scrolled', () => {
  const testHeight = 30;
  const testScrollHeight = 100;
  const TestComponent = props => (
    <StayScrolled {...props} style={{ height: testHeight, width: 100, overflow: 'auto' }}>
      <div style={{ height: testScrollHeight, width: 100 }} />
    </StayScrolled>
  );

  function isScrolled(node) {
    return node.scrollTop === maxScrollTop(node);
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
      ReactDOM.render(<StayScrolled />, container);
      expect(container.childNodes.length).to.equal(1);
      expect(container.firstChild.tagName).to.equal('DIV');
    });

    it('should start with scrolled element', () => {
      ReactDOM.render(<TestComponent />, container);

      expect(container.firstChild.scrollHeight).to.equal(testScrollHeight);
      expect(isScrolled(container.firstChild)).to.equal(true);
    });

    it('should not call onScrolled when using startScrolled', () => {
      const spy = sinon.spy();

      ReactDOM.render(<TestComponent startScrolled onScrolled={spy} />, container);

      expect(spy.called).to.equal(false);
    });

    it('should not start with scrolled element', () => {
      ReactDOM.render(<TestComponent startScrolled={false} />, container);

      expect(container.firstChild.scrollTop).to.equal(0);
      expect(isScrolled(container.firstChild)).to.equal(false);
    });

    it('should fire onScrolled when calling scrollBottom control', () => {
      let scrollBottom;
      const storeController = (controllers) => { ({ scrollBottom } = controllers); };

      return new Promise((resolve) => {
        ReactDOM.render(<TestComponent provideControllers={storeController} onScrolled={() => resolve()} />, container);
        scrollBottom();
      });
    });

    it('should scroll to bottom when calling scrollBottom', () => {
      let scrollBottom;
      const storeController = (controllers) => { ({ scrollBottom } = controllers); };

      ReactDOM.render(<TestComponent startScrolled={false} provideControllers={storeController} />, container);

      expect(isScrolled(container.firstChild)).to.equal(false);
      scrollBottom();
      expect(isScrolled(container.firstChild)).to.equal(true);
    });

    it('should stay scrolled when calling stayScrolled with startScrolled', async () => {
      let stayScrolled;
      const onStayScrolled = sinon.spy();
      const storeController = (controllers) => { ({ stayScrolled } = controllers); };

      await new Promise((resolve) => {
        ReactDOM.render(
          <TestComponent
            onScrolled={() => resolve()}
            onStayScrolled={onStayScrolled}
            provideControllers={storeController}
          />,
          container,
        );

        stayScrolled();
      });

      expect(onStayScrolled.calledOnce).to.equal(true);
      expect(onStayScrolled.firstCall.args).to.deep.equal([true]);
      expect(isScrolled(container.firstChild)).to.equal(true);
    });

    it('should not stay scrolled when calling stayScrolled with startScrolled = false', () => {
      let stayScrolled;
      const onScrolled = sinon.spy();
      const onStayScrolled = sinon.spy();
      const storeController = (controllers) => { ({ stayScrolled } = controllers); };

      ReactDOM.render(
        <TestComponent
          startScrolled={false}
          onScrolled={onScrolled}
          onStayScrolled={onStayScrolled}
          provideControllers={storeController}
        />,
        container,
      );

      stayScrolled();
      expect(onScrolled.called).to.equal(false);
      expect(onStayScrolled.calledOnce).to.equal(true);
      expect(onStayScrolled.firstCall.args).to.deep.equal([false]);
      expect(isScrolled(container.firstChild)).to.equal(false);
    });

    it('should not notify stay scrolled when calling with notify = false', () => {
      let stayScrolled;
      const onStayScrolled = sinon.spy();
      const storeController = (controllers) => { ({ stayScrolled } = controllers); };

      ReactDOM.render(
        <TestComponent
          onStayScrolled={onStayScrolled}
          provideControllers={storeController}
        />,
        container,
      );

      stayScrolled(false);
      expect(onStayScrolled.called).to.equal(false);
    });

    it('should stay scrolled when adding new elements', (done) => {
      class Messages extends Component {
        state = { messages: [] }

        componentDidMount() {
          this.addMessage();
        }

        onStayScrolled = (...args) => {
          expect(args).to.deep.equal([true]);
          expect(isScrolled(this.dom)).to.equal(true);

          const { messages } = this.state;

          if (messages.length > 4) {
            done(); // After 5 messages stop
          } else {
            this.addMessage();
          }
        }

        storeControls = ({ stayScrolled }) => {
          this.stayScrolled = stayScrolled;
        }

        storeDOM = (dom) => {
          this.dom = dom;
        }

        addMessage = () => {
          this.setState(({ messages }) => ({
            messages: [
              ...messages,
              'foo',
            ],
          }), () => {
            this.stayScrolled();
          });
        }

        render() {
          const { messages } = this.state;

          return (
            <StayScrolled
              style={{ height: testHeight, width: 100, overflow: 'auto' }}
              onStayScrolled={this.onStayScrolled}
              provideControllers={this.storeControls}
              _provideDOMNode={this.storeDOM}
            >
              {
                messages.map((message, i) => (
                  <div key={i} style={{ height: testScrollHeight, width: 100 }}>{message}</div> // eslint-disable-line react/no-array-index-key
                ))
              }
            </StayScrolled>
          );
        }
      }

      ReactDOM.render(<Messages />, container);
    });
  });

  describe('accuracy', () => {
    it('should stay scrolled only when below inaccuracy', (done) => {
      const inaccuracy = 5;

      const recursion = (i) => {
        let stayScrolled;
        const onStayScrolled = sinon.spy();
        const storeController = (controllers) => { ({ stayScrolled } = controllers); };
        const onScroll = () => {
          const dom = container.firstChild;
          const domMaxScrollTop = maxScrollTop(dom);
          const expectedResult = i >= domMaxScrollTop - inaccuracy;

          stayScrolled();

          expect(onStayScrolled.calledOnce).to.equal(true);
          expect(onStayScrolled.firstCall.args).to.deep.equal([expectedResult]);
          expect(isScrolled(dom)).to.equal(expectedResult);

          ReactDOM.unmountComponentAtNode(container);
          if (i < domMaxScrollTop) {
            recursion(i + 1);
          } else {
            done();
          }
        };

        ReactDOM.render(
          <TestComponent
            startScrolled={false}
            stayInaccuracy={inaccuracy}
            onScroll={onScroll}
            onStayScrolled={onStayScrolled}
            provideControllers={storeController}
          />,
          container,
        );

        const dom = container.firstChild;
        dom.scrollTop = i;
      };

      recursion(1);
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

      ReactDOM.render(
        <TestComponent
          startScrolled={false}
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

      ReactDOM.render(
        <TestComponent
          onScroll={onScroll}
          startScrolled={false}
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

  describe('hoc', () => {
    it('should provide controls to children', () => {
      const ChildComponent = ({ scrollBottom, stayScrolled }) => {
        expect(typeof scrollBottom === 'function').to.equal(true);
        expect(typeof stayScrolled === 'function').to.equal(true);
        return <div />;
      };
      ChildComponent.propTypes = {
        scrollBottom: PropTypes.func.isRequired,
        stayScrolled: PropTypes.func.isRequired,
      };

      const ScrolledChildComponent = scrolled(ChildComponent);

      ReactDOM.render(
        <StayScrolled>
          <ScrolledChildComponent />
        </StayScrolled>,
        container,
      );
    });
  });
});
