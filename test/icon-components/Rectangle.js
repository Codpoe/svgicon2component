import React from 'react';
import PropTypes from 'prop-types';
const Rectangle = props => {
  const { color, size, ...otherProps } = props;
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 20 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      {...otherProps}
    >
      <title>Rectangle</title>
      <desc>Created with Sketch.</desc>
      <g
        id="Rectangle"
        stroke={color}
        fill="none"
        strokeWidth="1"
        fillRule="evenodd"
      >
        <path
          d="M16.4287109,16 L13.5986328,16 L12.4736328,13.0732422 L7.32324219,13.0732422 L6.25976562,16 L3.5,16 L8.51855469,3.11523438 L11.2695312,3.11523438 L16.4287109,16 Z M11.6386719,10.9023438 L9.86328125,6.12109375 L8.12304688,10.9023438 L11.6386719,10.9023438 Z"
          id="A"
          fill="#3388FF"
        />
      </g>
    </svg>
  );
};
Rectangle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
Rectangle.defaultProps = {
  color: 'currentColor',
  size: '24',
};
export default Rectangle;
