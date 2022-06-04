// import { css } from "../stilx/css.js";
// import Button from "./Button.jsx";
import { css, styles } from "../css-zero/macro";

const title = css`
  color: red;
`;

function App() {
  return (
    <div>
      <h1 className={styles(title)}>Hello World</h1>
      {/* <Button /> */}
    </div>
  );
}

export default App;
