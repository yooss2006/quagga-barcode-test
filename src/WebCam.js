import React, { useState } from "react";
import Scanner from "./Scanner";
const WebCam = () => {
  const [camera, setCamera] = useState(false);
  const [result, setResult] = useState(null);
  const onDetected = (result) => {
    setResult(result);
  };
  return (
    <div>
      <p>{result ? result : "Scanning..."}</p>
      <button onClick={() => setCamera(!camera)}>
        {camera ? "Stop" : "Start"}
      </button>
      {camera && <Scanner onDetected={onDetected} />}
    </div>
  );
};

export default WebCam;
