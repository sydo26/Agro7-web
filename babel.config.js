module.exports = {
  presets: ["next/babel"],
  plugins: [
    ["styled-components", { "ssr": true }],
    "inline-react-svg",
    ["module-resolver", {
        root: [ "./" ],
        alias: {
           "@": "./src",
        }
    }]
  ]
};
