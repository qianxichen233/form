import React, { useState, useRef, useEffect } from 'react';

import classes from './DynamicInput.module.css';

export default (props) => {
  const [width, setWidth] = useState(0);
  const span = useRef();

  const fontSize = props.fontSize || '1em';

  useEffect(() => {
    setWidth(span.current.offsetWidth + 10);
  }, [props.value]);

  const changeHandler = e => {
    props.onChange(e.target.value);
  };

  return (
    <div className={classes.wrapper}>
      <span
        ref={span}
        className={classes.hide}
        style={{fontWeight: props.bold ? 'bold' : '',
                fontSize}}
    >{props.value}</span>
      <input
        className={props.className}
        type="text"
        style={{ width,
                 fontWeight: props.bold ? 'bold' : '',
                 fontSize}}
        value={props.value}
        onChange={changeHandler}
        onBlur={() => {
            if(props.value === '' && props.default)
                props.onChange(props.default);
        }}
    />
    </div>
  );
};
