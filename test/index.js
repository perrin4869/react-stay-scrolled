import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import StayScrolled, { scrolled } from '../src';

chai.should();
const { expect } = chai;

function isScrolled(node) {
  return node.scrollHeight === node.clientHeight + node.scrollTop;
}

describe('react-stay-scrolled', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('StayScrolled', () => {
    it('should render single div', () => {
      ReactDOM.render(<StayScrolled />, container);
      container.childNodes.length.should.equal(1);
      container.firstChild.tagName.should.equal('DIV');
    });

    it('should start with scrolled element', () => {
      ReactDOM.render(
        <StayScrolled style={{ height: 100, width: 100, overflow: 'auto' }}>
          <div style={{ height: 300, width: 100 }} />
        </StayScrolled>,
        container);
      container.firstChild.scrollHeight.should.equal(300);
      isScrolled(container.firstChild).should.equal(true);
    });

    it('should not start with scrolled element', () => {
      ReactDOM.render(
        <StayScrolled startScrolled={false} style={{ height: 100, width: 100, overflow: 'auto' }}>
          <div style={{ height: 300, width: 100 }} />
        </StayScrolled>,
        container);
      container.firstChild.scrollHeight.should.equal(300);
      container.firstChild.scrollTop.should.equal(0);
      isScrolled(container.firstChild).should.equal(false);
    });

    it('should fire onScrolled when calling scrollBottom control', () => {
      let scrollBottom;
      const spy = sinon.spy();
      ReactDOM.render(
        <StayScrolled provideControllers={controllers => { scrollBottom = controllers.scrollBottom; }} onScrolled={spy} />,
          container);
      scrollBottom();
      spy.calledTwice.should.equal(true); // Once because of startScrolled, twice because scrollBottom
    });
  });

  describe('HOC', () => {
    it('should use correct displayName', () => {
      const ScrolledDiv = scrolled('div');
      ScrolledDiv.displayName.should.equal('scrolled(div)');
    });

    it('should provide controls to children', () => {
      const ChildComponent = ({ scrollBottom, stayScrolled }) => {
        expect(typeof scrollBottom === 'function').to.equal(true);
        expect(typeof stayScrolled === 'function').to.equal(true);
        return <div></div>;
      };
      ChildComponent.propTypes = {
        scrollBottom: PropTypes.func,
        stayScrolled: PropTypes.func,
      };

      const ScrolledChildComponent = scrolled(ChildComponent);

      ReactDOM.render(
        <StayScrolled>
          <ScrolledChildComponent />
        </StayScrolled>,
        container);
    });
  });
});
