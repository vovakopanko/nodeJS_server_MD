// data transfer object
module.exports = class userDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id; // for mongo, add an bottom underscore by default
    this.isActivated = model.isActivated;
  }
};
