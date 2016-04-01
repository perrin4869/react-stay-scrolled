import React, { Component } from 'react';
import StayScrolled from 'react-stay-scrolled';
import Message from './message.jsx';
import debug from './debug.js';

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

export default class Messages extends Component {

  constructor(props) {
    super(props);

    this.interval = setInterval(() => {
      this.setState({
        messages: [
          ...this.state.messages,
          message,
        ],
      });
    }, 500);
  }

  state = initialState

  render() {
    const { messages } = this.state;

    return (
      <StayScrolled debug={debug} {...this.props}>
      {
        messages.map((msg, i) => <Message text={`${msg.text} ${i}`} key={i} />)
      }
      </StayScrolled>
    );
  }

}
