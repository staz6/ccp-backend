const app = require("./app");
const config = require("./config/config");
console.log(config);
server = app.listen(3002, () => {
  console.info(`Listening to port 3002`);
});
