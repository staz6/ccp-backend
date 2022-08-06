const app = require("./app")

server = app.listen(3002, () => {
    console.info(`Listening to port 3002`);
  });