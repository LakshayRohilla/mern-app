import { useReducer, useEffect} from 'react';
import { validate } from '../../util/validators';
import './Input.css';

// When you have multiple states and both are connected to each other, Then we should use the complex way to handle the 
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    // Bcz in the case of update we should be having the value in it.
    isTouched: false,
    isValid: props.initialValid || false
  });

  // We learned if we are having some deps on the props, then we should always destructure it in advance.
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput]);

  // This will be fired on every keystock. And we will be taking care of 2 things. We want to store the value and we would like to validate it.
  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH' // This is introduced so that at the inital component load, it wont give us the validation error. 
      // But one we touch it and touch out side the input , then it will give us error.
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler} 
        // We used onBlur so that for the first time when we are loading the page it wont show us the validation error.
        // once a user enters something and thats not the valid input then only we will be having the error.
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
