import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  
  const { center, zoom } = props;
  // We are doing this so that we could provide these as a dependency in useEffect.
  // As its not recommened to provide props in the dep on the useEffect.

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      // you can check all these options from the offical docs.
      // Refer the docs : https://developers.google.com/maps/documentation/javascript/adding-a-google-map
      center: center, // so that both can be set from outside.
      zoom: zoom
    });
    // This is a constuctor function that would be available on the windows object.
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div> 
  );
};

export default Map;
