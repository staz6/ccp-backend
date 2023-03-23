const express = require("express");
const authRoute = require("./auth.route");
const ec2Route = require("./ec2.routes")
const s3Route = require("./s3.routes")

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/ec2",
    route: ec2Route
  },
  {
    path: "/s3",
    route: s3Route
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
