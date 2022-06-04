import logo from "./logo.svg";
import "./App.css";

import { css } from "linaria";

const title = css`
  color: orange;
`;

function App() {
  return (
    <div>
      <h1 className={title}>Hello Title</h1>
    </div>
  );
}

export default App;
