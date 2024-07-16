import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
// import { useCallback, useReducer } from 'react'; // moved to form-hook
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useNavigate } from 'react-router-dom';

// const formReducer = (state, action) => {
//   switch (action.type) {
//     case 'INPUT_CHANGE':
//       let formIsValid = true;
//       for (const inputId in state.inputs) {
//         if (inputId === action.inputId) {
//           formIsValid = formIsValid && action.isValid;
//         } else {
//           formIsValid = formIsValid && state.inputs[inputId].isValid;
//         }
//       }
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           [action.inputId]: { value: action.value, isValid: action.isValid }
//         },
//         isValid: formIsValid
//       };
//     default:
//       return state;
//   }
// };

// Moved the above commented code to the form hook.

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // Moved to the form-hook

  // const [formState, dispatch] = useReducer(formReducer, {
  //   inputs: {
  //     title: {
  //       value: '',
  //       isValid: false
  //     },
  //     description: {
  //       value: '',
  //       isValid: false
  //     },
  //     address: {
  //       value: '',
  //       isValid: false
  //     }
  //   },
  //   isValid: false
  // });

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const inputHandler = useCallback((id, value, isValid) => {
  //   dispatch({
  //     type: 'INPUT_CHANGE',
  //     value: value,
  //     isValid: isValid,
  //     inputId: id
  //   });
  // }, []);
  // Moved to the form - hook

  const navigate = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
    try {
      await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        }),
        { "Content-Type": "application/json" }
      );
      navigate.push("/"); // once the place will be added it will be redirected to this route
    } catch (err) {}
  };

  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};
export default NewPlace;
