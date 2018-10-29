import React, { PureComponent } from 'react';
import StayScrolled from 'react-stay-scrolled';
import Message from './message';
import debug from './debug';

const message = { text: 'foo' };

const initialState = {
  messages: [
    message,
    message,
    message,
    message,
    message,
    message,
    message,
  ],
};

export default class Messages extends PureComponent {
  interval = setInterval(() => {
    this.setState(({ messages }) => ({
      messages: [...messages, message],
    }));
  }, 500);

  state = initialState

  render() {
    const { messages } = this.state;

    return (
      <StayScrolled debug={debug} {...this.props}>
        {
          // eslint-disable-next-line react/no-array-index-key
          messages.map((msg, i) => <Message text={`${msg.text} ${i}`} key={i} />)
        }
      </StayScrolled>
    );
  }
}
