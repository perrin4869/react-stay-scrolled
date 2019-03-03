import React, {
  useState, useRef, useEffect, useLayoutEffect,
} from 'react';
import useStayScrolled from 'react-stay-scrolled';

const message = { text: 'foo' };

const initialMessages = [
  message,
  message,
  message,
  message,
  message,
  message,
  message,
];

export default (props) => {
  const divRef = useRef(null);
  const intervalRef = useRef(null);
  const { stayScrolled } = useStayScrolled(divRef);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessages(prevMessages => prevMessages.concat([message]));
    }, 500);
  }, []);

  useLayoutEffect(() => {
    stayScrolled();
  }, [messages]);

  return (
    <div ref={divRef} {...props}>
      {/* eslint-disable-next-line react/no-array-index-key */}
      {messages.map(({ text }, i) => <div key={i}>{`${text} ${i}`}</div>)}
    </div>
  );
};
