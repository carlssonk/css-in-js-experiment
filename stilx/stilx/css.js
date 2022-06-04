// import fs from "fs";
// import * as fs from "fs";

const seen = {};
let stylesheet = "";

const initClassHandler = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const charLength = chars.length;

  function generateUniqueClassName(count, className = "") {
    if (count <= charLength) {
      return chars[count - 1] + className;
    }

    return generateUniqueClassName((count / charLength) | 0, chars[count % charLength] + className);
  }
  let count = 1;
  return {
    createClass() {
      const generatedClassName = generateUniqueClassName(count);
      count++;
      return generatedClassName;
    },
  };
};

const classHandler = initClassHandler();

const styleTag = document.createElement("style");
document.head.appendChild(styleTag);

export const JSToCSS = (JS) => {
  let array = [];
  for (let objectKey in JS) {
    array.push(objectKey.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) + ":" + JS[objectKey]);
  }
  return array;
};

export const css = (style) => {
  return;
  const declarations = JSToCSS(style);

  console.log(style);

  let classNames = "";

  for (let i = 0; i < declarations.length; i++) {
    if (declarations[i] in seen) {
      classNames += seen[declarations[i]];
      continue;
    }

    const selector = classHandler.createClass();
    seen[declarations[i]] = selector;
    classNames += selector;
    styleTag.sheet.insertRule(`.${selector}{${declarations[i]}}`, styleTag.sheet.cssRules.length);
    stylesheet += `.${selector}{${declarations[i]}}`;
  }

  // console.log(JSON.stringify({ stylesheet }));
  fetch("http://localhost:1337/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sheet: stylesheet }),
  });

  classNames = classNames.split("").join(" ");

  return classNames;
};

// const insertStylesToHTML = () => {
//   const html = fs.readFileSync("terms.txt", "utf8");
//   console.log(html);
// };

// insertStylesToHTML();
