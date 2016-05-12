import React from 'react';
import ReactDOM from 'react-dom';

import StayScrolled from '../src';

chai.should();

function isScrolled(node) {
  return node.scrollHeight === node.clientHeight + node.scrollTop;
}

describe('react-focus-onkeydown', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render single input', () => {
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
    spy.calledTwice.should.equal(true);
  });
});
