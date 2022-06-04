import logo from "./logo.svg";
import "./App.css";

import { css } from "@linaria/core";

// const css = () => "";
// import { css } from "linaria";

// console.log(object);

const title = css`
  color: blue;
  width: 100px;
  box-shadow: 0 0 10px black;
`;

function App() {
  return (
    <div>
      <h1 className={title}>Hello Title</h1>
    </div>
  );
}

export default App;
