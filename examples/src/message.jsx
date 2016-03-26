import React, { Component, PropTypes } from 'react';

export default class Message extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
  }

  static contextTypes = {
    stayScrolled: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { stayScrolled } = this.context;
    stayScrolled();
  }

  render() {
    const { text } = this.props;

    return <div>{text}</div>;
  }

}
