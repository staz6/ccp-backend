const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');


const deploy = catchAsync(async (req, res) => {
    console.log(req.user);
    res.status(httpStatus.CREATED).send( req.user );
});



module.exports = {
    deploy
}