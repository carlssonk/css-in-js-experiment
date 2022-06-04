import React from "react";
import { css } from "../stilx/css.js";

const btn = {
  margin: "12px",
  paddingTop: "12px",
  background: "orange",
};

function Button() {
  return <button className={css(btn)}>Button</button>;
}

export default Button;
