import "./App.css";

import { css } from "linaria";

const title = css`
  color: blue;
`;

function App() {
  return (
    <div className="App">
      <div className={title}>Hello Title ?? </div>
    </div>
  );
}

export default App;
