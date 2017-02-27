"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _runethtx = require("runethtx");

var _SharesControllerSol = require("../contracts/SharesController.sol.js");

var _KWCSol = require("../contracts/KWC.sol.js");

var _MiniMeTokenSol = require("../contracts/MiniMeToken.sol.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SharesController = function () {
    function SharesController(web3, address) {
        _classCallCheck(this, SharesController);

        this.web3 = web3;
        this.contract = this.web3.eth.contract(_SharesControllerSol.SharesControllerAbi).at(address);
    }

    _createClass(SharesController, [{
        key: "getState",
        value: function getState(_cb) {
            var _this = this;

            return (0, _runethtx.asyncfunc)(function (cb) {
                var st = {};
                var nPayments = void 0;
                _async2.default.series([function (cb1) {
                    _this.contract.owner(function (err, _owner) {
                        if (err) {
                            cb(err);return;
                        }
                        st.owner = _owner;
                        cb1();
                    });
                }, function (cb1) {
                    _this.contract.escapeCaller(function (err, _escapeCaller) {
                        if (err) {
                            cb(err);return;
                        }
                        st.escapeCaller = _escapeCaller;
                        cb1();
                    });
                }, function (cb1) {
                    _this.contract.escapeDestination(function (err, _escapeDestination) {
                        if (err) {
                            cb(err);return;
                        }
                        st.escapeDestination = _escapeDestination;
                        cb1();
                    });
                }, function (cb1) {
                    _this.web3.eth.getBalance(_this.contract.address, function (err, _balance) {
                        if (err) {
                            cb(err);return;
                        }
                        st.balance = _balance;
                        cb1();
                    });
                }, function (cb1) {
                    _this.contract.numberOfAuthorizedPayments(function (err, res) {
                        if (err) {
                            cb(err);return;
                        }
                        nPayments = res.toNumber();
                        st.payments = [];
                        cb1();
                    });
                }, function (cb1) {
                    _async2.default.eachSeries(_lodash2.default.range(0, nPayments), function (idPayment, cb2) {
                        _this.contract.authorizedPayments(idPayment, function (err, res) {
                            if (err) {
                                cb(err);return;
                            }
                            st.payments.push({
                                idPayment: idPayment,
                                description: res[0],
                                spender: res[1],
                                earliestPayTime: res[2].toNumber(),
                                canceled: res[3],
                                paid: res[4],
                                recipient: res[5],
                                amount: res[6]
                            });
                            cb2();
                        });
                    }, cb1);
                }], function (err) {
                    if (err) {
                        cb(err);return;
                    }
                    cb(null, st);
                });
            }, _cb);
        }
    }, {
        key: "proposeTransfer",
        value: function proposeTransfer(opts, cb) {
            return (0, _runethtx.sendContractTx)(this.web3, this.contract, "proposeTransfer", opts, cb);
        }
    }, {
        key: "acceptTransfer",
        value: function acceptTransfer(opts, cb) {
            return (0, _runethtx.sendContractTx)(this.web3, this.contract, "acceptTransfer", opts, cb);
        }
    }, {
        key: "createTokens",
        value: function createTokens(opts, cb) {
            return (0, _runethtx.sendContractTx)(this.web3, this.contract, "acceptTransfer", opts, cb);
        }
    }, {
        key: "destroyTokens",
        value: function destroyTokens(opts, cb) {
            return (0, _runethtx.sendContractTx)(this.web3, this.contract, "acceptTransfer", opts, cb);
        }
    }], [{
        key: "deploy",
        value: function deploy(web3, opts, _cb) {
            var params = Object.assign({}, opts);
            return (0, _runethtx.asyncfunc)(function (cb) {
                params.parentToken = params.parentToken || 0;
                params.parentSnapShotBlock = params.parentSnapShotBlock || 0;
                params.transfersEnabled = typeof params.transfersEnabled === "undefined" ? true : params.transfersEnabled;
                _async2.default.series([function (cb1) {
                    console.log("c1");
                    params.abi = _MiniMeTokenSol.MiniMeTokenFactoryAbi;
                    params.byteCode = _MiniMeTokenSol.MiniMeTokenFactoryByteCode;
                    (0, _runethtx.deploy)(web3, params, function (err, _tokenFactory) {
                        if (err) {
                            cb1(err);
                            return;
                        }
                        params.tokenFactory = _tokenFactory.address;
                        cb1();
                    });
                }, function (cb1) {
                    console.log("c2");
                    params.abi = _MiniMeTokenSol.MiniMeTokenAbi;
                    params.byteCode = _MiniMeTokenSol.MiniMeTokenByteCode;
                    (0, _runethtx.deploy)(web3, params, function (err, _token) {
                        if (err) {
                            cb1(err);
                            return;
                        }

                        params.tokenAddr = _token.address;
                        console.log("MMT:" + params.tokenAddr);
                        cb1();
                    });
                }, function (cb1) {
                    console.log("c3");
                    params.abi = _KWCSol.KWCAbi;
                    params.byteCode = _KWCSol.KWCByteCode;
                    (0, _runethtx.deploy)(web3, params, function (err, _kwc) {
                        if (err) {
                            cb1(err);
                            return;
                        }
                        params.kwcAddr = _kwc.address;
                        cb1();
                    });
                }, function (cb1) {
                    console.log("c4");
                    params.abi = _SharesControllerSol.SharesControllerAbi;
                    params.byteCode = _SharesControllerSol.SharesControllerByteCode;
                    (0, _runethtx.deploy)(web3, params, function (err, _sharesController) {
                        if (err) {
                            cb1(err);
                            return;
                        }
                        params.sharesController = _sharesController.address;
                        cb1();
                    });
                }, function (cb1) {
                    console.log("c5");

                    var minime = web3.eth.contract(_MiniMeTokenSol.MiniMeTokenAbi).at(params.tokenAddr);
                    minime.changeController(params.sharesController, { from: web3.eth.accounts[0] }, cb1);
                }], function (err) {
                    console.log("c6");
                    if (err) {
                        cb(err);
                        return;
                    }
                    var sharesController = new SharesController(web3, params.sharesController);
                    cb(null, sharesController);
                });
            }, _cb);
        }
    }]);

    return SharesController;
}();

exports.default = SharesController;
module.exports = exports["default"];
