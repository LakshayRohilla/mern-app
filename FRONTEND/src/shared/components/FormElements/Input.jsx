import { useReducer } from 'react';

import './Input.css';

// When you have multiple states and both are connected to each other, Then we should use the complex way to handle the 
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: true
      };
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: '',
    isValid: false
  });

  // This will be fired on every keystock. And we will be taking care of 2 things. We want to store the value and we would like to validate it.
  const changeHandler = event => {
    dispatch({ type: 'CHANGE', val: event.target.value });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
