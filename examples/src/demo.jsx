import React from 'react';
import Messages from './messages.jsx';

const style = {
  display: 'inline-block',
  width: '150px',
  height: '250px',
  overflow: 'auto',
};

const StayScrolledDemo = ({}) => (
  <Messages style={style} />
);

export default StayScrolledDemo;
