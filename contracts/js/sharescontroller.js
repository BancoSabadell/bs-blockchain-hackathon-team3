import async from "async";
import _ from "lodash";
import { deploy, sendContractTx, asyncfunc } from "runethtx";
import { SharesControllerAbi, SharesControllerByteCode } from "../contracts/SharesController.sol.js";
import { KWCAbi, KWCByteCode } from "../contracts/KWC.sol.js";
import { MiniMeTokenAbi, MiniMeTokenByteCode, MiniMeTokenFactoryAbi, MiniMeTokenFactoryByteCode }
    from "../contracts/MiniMeToken.sol.js";

export default class SharesController {

    constructor(web3, address) {
        this.web3 = web3;
        this.contract = this.web3.eth.contract(SharesControllerAbi).at(address);
    }

    getState(_cb) {
        return asyncfunc((cb) => {
            const st = {};
            let nPayments;
            async.series([
                (cb1) => {
                    this.contract.owner((err, _owner) => {
                        if (err) { cb(err); return; }
                        st.owner = _owner;
                        cb1();
                    });
                },
                (cb1) => {
                    this.contract.escapeCaller((err, _escapeCaller) => {
                        if (err) { cb(err); return; }
                        st.escapeCaller = _escapeCaller;
                        cb1();
                    });
                },
                (cb1) => {
                    this.contract.escapeDestination((err, _escapeDestination) => {
                        if (err) { cb(err); return; }
                        st.escapeDestination = _escapeDestination;
                        cb1();
                    });
                },
                (cb1) => {
                    this.web3.eth.getBalance(this.contract.address, (err, _balance) => {
                        if (err) { cb(err); return; }
                        st.balance = _balance;
                        cb1();
                    });
                },
                (cb1) => {
                    this.contract.numberOfAuthorizedPayments((err, res) => {
                        if (err) { cb(err); return; }
                        nPayments = res.toNumber();
                        st.payments = [];
                        cb1();
                    });
                },
                (cb1) => {
                    async.eachSeries(_.range(0, nPayments), (idPayment, cb2) => {
                        this.contract.authorizedPayments(idPayment, (err, res) => {
                            if (err) { cb(err); return; }
                            st.payments.push({
                                idPayment,
                                description: res[ 0 ],
                                spender: res[ 1 ],
                                earliestPayTime: res[ 2 ].toNumber(),
                                canceled: res[ 3 ],
                                paid: res[ 4 ],
                                recipient: res[ 5 ],
                                amount: res[ 6 ],
                            });
                            cb2();
                        });
                    }, cb1);
                },
            ], (err) => {
                if (err) { cb(err); return; }
                cb(null, st);
            });
        }, _cb);
    }

    static deploy(web3, opts, _cb) {
        const params = Object.assign({}, opts);
        return asyncfunc((cb) => {
            params.parentToken = params.parentToken || 0;
            params.parentSnapShotBlock = params.parentSnapShotBlock || 0;
            params.transfersEnabled = (typeof params.transfersEnabled === "undefined") ? true : params.transfersEnabled;
            async.series([
                (cb1) => {
                    console.log("c1");
                    params.abi = MiniMeTokenFactoryAbi;
                    params.byteCode = MiniMeTokenFactoryByteCode;
                    deploy(web3, params, (err, _tokenFactory) => {
                        if (err) {
                            cb1(err);
                            return;
                        }
                        params.tokenFactory = _tokenFactory.address;
                        cb1();
                    });
                },
                (cb1) => {
                    console.log("c2");
                    params.abi = MiniMeTokenAbi;
                    params.byteCode = MiniMeTokenByteCode;
                    deploy(web3, params, (err, _token) => {
                        if (err) {
                            cb1(err);
                            return;
                        }

                        params.tokenAddr = _token.address;
                        console.log("MMT:" +  params.tokenAddr);
                        cb1();
                    });
                },
                (cb1) => {
                    console.log("c3");
                    params.abi = KWCAbi;
                    params.byteCode = KWCByteCode;
                    deploy(web3, params, (err, _kwc) => {
                        if (err) {
                            cb1(err);
                            return;
                        }
                        params.kwcAddr = _kwc.address;
                        cb1();
                    });
                },
                (cb1) => {
                    console.log("c4");
                    params.abi = SharesControllerAbi;
                    params.byteCode = SharesControllerByteCode;
                    deploy(web3, params, (err, _sharesController) => {
                        if (err) {
                            cb1(err);
                            return;
                        }
                        params.sharesController = _sharesController.address;
                        cb1();
                    });
                },
                (cb1) => {
                    console.log("c5");

                    const minime = web3.eth.contract(MiniMeTokenAbi).at(params.tokenAddr);
                    minime.changeController(params.sharesController,
                        { from: web3.eth.accounts[ 0 ] }, cb1);
                },
            ],
            (err) => {
                console.log("c6");
                if (err) {
                    cb(err);
                    return;
                }
                const sharesController = new SharesController(web3, params.sharesController);
                cb(null, sharesController);
            });
        }, _cb);
    }

    proposeTransfer(opts, cb) {
        return sendContractTx(
            this.web3,
            this.contract,
            "proposeTransfer",
            opts,
            cb);
    }

    acceptTransfer(opts, cb) {
        return sendContractTx(
            this.web3,
            this.contract,
            "acceptTransfer",
            opts,
            cb);
    }

    createTokens(opts, cb) {
        return sendContractTx(
            this.web3,
            this.contract,
            "acceptTransfer",
            opts,
            cb);
    }

    destroyTokens(opts, cb) {
        return sendContractTx(
            this.web3,
            this.contract,
            "acceptTransfer",
            opts,
            cb);
    }
}
