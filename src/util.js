export const maxScrollTop = dom => dom.scrollHeight - dom.clientHeight;
export const runScroll = (dom, offset) => {
  dom.scrollTop = offset; // eslint-disable-line no-param-reassign
};
