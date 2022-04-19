// data transfer object
module.exports = class userDto {
  email;
  id;
  profileDescription;
  address;
  userName;
  phoneNumber;
  isActivated;
  photoUser;

  constructor(model) {
    this.email = model.email;
    this.id = model._id; // for mongo, add an bottom underscore by default
    this.isActivated = model.isActivated;
    this.profileDescription = model.profileDescription;
    this.address = model.address;
    this.userName = model.userName;
    this.phoneNumber = model.phoneNumber;
    this.photoUser = model.photoUser;
  }
};
