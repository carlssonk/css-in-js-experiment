import { css } from "../stilx/css.js";
import Button from "./Button.jsx";

const red = {
  color: "red",
  fontSize: "50px",
  backgroundColor: "red",
  display: "flex",
};

const blue = {
  backgroundColor: "blue",
  padding: "12px",
};

function App() {
  return (
    <div>
      <p className={css(blue)}>Lorem ipsum</p>
      <h1 className={css(red)}>Hello World</h1>
      <Button />
    </div>
  );
}

export default App;
