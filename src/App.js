import { BrowserRouter, Route, Routes } from "react-router-dom";
import WebCam from "./WebCam";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WebCam />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
