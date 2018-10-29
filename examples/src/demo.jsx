import React from 'react';
import Messages from './messages';

const style = {
  display: 'inline-block',
  width: '100px',
  height: '250px',
  overflow: 'auto',
  border: '1px solid #000',
};

const StayScrolledDemo = () => (
  <Messages style={style} />
);

export default StayScrolledDemo;
