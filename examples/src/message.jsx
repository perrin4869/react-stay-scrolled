import React, { Component, PropTypes } from 'react';
import { scrolled } from 'react-stay-scrolled';

class Message extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    stayScrolled: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { stayScrolled } = this.props;
    stayScrolled();
  }

  render() {
    const { text } = this.props;

    return <div>{text}</div>;
  }

}

export default scrolled(Message);
