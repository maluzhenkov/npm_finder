module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/npm_finder/" : "/",
  transpileDependencies: ["vuetify"],
};
