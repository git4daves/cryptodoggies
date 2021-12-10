const CryptoDoggies = artifacts.require("CryptoDoggies");

contract("CryptoDoggies", function (accounts) {
  const helpfulFunctions = require("./utils/CryptoDoggiesUtils")(
    CryptoDoggies,
    accounts
  );
  const hfn = Object.keys(helpfulFunctions);
  for (let i = 0; i < hfn.length; i++) {
    global[hfn[i]] = helpfulFunctions[hfn[i]];
  }

  console.log(accounts);

  checkTotalSupply(0);

  for (let x = 0; x < 10; x++) {
    checkDoggyCreation(`Doggy-${x}`);
  }

  checkTotalSupply(10);
});
