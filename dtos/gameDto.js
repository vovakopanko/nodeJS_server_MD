module.exports = class gameDto {
  title;
  price;
  url;
  alt;
  amountStars;
  age;
  description;
  genres;
  imagePlatforms;
  uniqueId;

  constructor(model) {
    this.title = model.title;
    this.price = model.price;
    this.url = model.url;
    this.alt = model.alt;
    this.amountStars = model.amountStars;
    this.age = model.age;
    this.description = model.description;
    this.genres = model.genres;
    this.imagePlatforms = model.imagePlatforms;
    this.uniqueId = model.uniqueId;
  }
};
