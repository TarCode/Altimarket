var Market = artifacts.require("./Market.sol");
var Chat = artifacts.require("./Chat.sol");

module.exports = function(deployer) {
  deployer.deploy(Market);
  deployer.deploy(Chat);
};
