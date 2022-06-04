import { css, styles } from "css-zero/macro";

const title = css`
  color: blue;
`;

function App() {
  return (
    <div>
      <h1 className={styles(title)}>Hello World!</h1>
    </div>
  );
}

export default App;
