import React from 'react';
import ReactDOM from 'react-dom';

import StayScrolled from '../src';

chai.should();

describe('react-focus-onkeydown', () => {
  it('should render single input', () => {
    const container = document.createElement('div');
    ReactDOM.render(<StayScrolled />, container);
    container.childNodes.length.should.equal(1);
    container.childNodes[0].tagName.should.equal('DIV');
  });
});
