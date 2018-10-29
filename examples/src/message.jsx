import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { scrolled } from 'react-stay-scrolled';

class Message extends PureComponent {
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
