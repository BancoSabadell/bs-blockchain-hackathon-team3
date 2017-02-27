import ethConnector from "ethconnector";
import path from "path";

ethConnector.compile(
    path.join(__dirname, "../contracts/MiniMeToken.sol"),
    path.join(__dirname, "../contracts/MiniMeToken.sol.js"),
    (err) => {
        if (err) {
            console.log(err);
//            process.exit(1);
        } else {
//            process.exit(0);
        }
    },
);

ethConnector.compile(
    path.join(__dirname, "../contracts/KWC.sol"),
    path.join(__dirname, "../contracts/KWC.sol.js"),
    (err) => {
        if (err) {
            console.log(err);
//            process.exit(1);
        } else {
//            process.exit(0);
        }
    },
);

ethConnector.compile(
    path.join(__dirname, "../contracts/SharesController.sol"),
    path.join(__dirname, "../contracts/SharesController.sol.js"),
    (err) => {
        if (err) {
            console.log(err);
//            process.exit(1);
        } else {
//            process.exit(0);
        }
    },
);


