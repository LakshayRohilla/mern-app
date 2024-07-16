import React, { useRef } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const filePickerRef = useRef();
  //  store a value which well which actually
 // does survive re render cycles, but which most importantly establishes a connection to a DOM element.

  const pickedHandler = event => {
    console.log(event.target); // This will gives out element itself. Here, it will be input tag.
  };

  const pickImageHandler = () => {
    filePickerRef.current.click(); // This method exists on this DOM node and it will open up that file picker.
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          <img src="" alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button> 
         {/*this will open the img picker  */}
      </div>
    </div>
  );
};

export default ImageUpload;
