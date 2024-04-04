"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authroutes = void 0;
/**
 *    SPDX-License-Identifier: Apache-2.0
 */
const passport_1 = __importDefault(require("passport"));
const helper_1 = require("../common/helper");
const requestutils_1 = require("./requestutils");
const requtil = __importStar(require("./requestutils"));
const logger = helper_1.helper.getLogger("Auth");
/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
function authroutes(router, platform) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = platform.getProxy();
        const dbCrudService = platform.getPersistence().getCrudService();
        /**
         * *
         * Network list
         * GET /networklist -> /login
         * curl -i 'http://<host>:<port>/networklist'
         */
        router.get("/networklist", requestutils_1.responder((req) => __awaiter(this, void 0, void 0, function* () {
            const networkList = yield proxy.networkList(req);
            return { networkList };
        })));
        /**
         * *
         * Login
         * POST /login -> /login
         * curl -X POST -H 'Content-Type: application/json' -d '{ 'user': '<user>', 'password': '<password>', 'network': '<network>' }' -i 'http://<host>:<port>/login'
         */
        router.post("/login", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.debug("req.body", req.body);
            return passport_1.default.authenticate("local-login", (err, token, userData) => {
                if (!token) {
                    return res.status(400).json({
                        success: false,
                        message: userData.message
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "You have successfully logged in!",
                    token,
                    user: userData
                });
            })(req, res, next);
        }));
        router.post("/logout", (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.debug("req.body", req.body);
            req.logout();
            res.send();
        }));
        router.post("/logout", (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.debug("req.body", req.body);
            req.logout();
            res.send();
        }));
        router.get("/blockDetail/:blockDataHash", (req, res) => {
            const blockDataHash = req.params.blockDataHash;
            if (blockDataHash) {
                dbCrudService
                    .getBlockDetail(blockDataHash)
                    .then(row => {
                    if (row) {
                        return res.send({
                            status: 200,
                            row
                        });
                    }
                })
                    .catch(e => {
                    res.send({
                        status: 500,
                        message: "Internal Server Error"
                    });
                });
            }
            else {
                return requtil.invalidRequest(req, res);
            }
        });
        router.get("/txDetail/:txHashDetail", (req, res) => {
            const txHashDetail = req.params.txHashDetail;
            if (txHashDetail) {
                dbCrudService
                    .getTransactionDetail(txHashDetail)
                    .then(row => {
                    if (row) {
                        return res.send({
                            status: 200,
                            row
                        });
                    }
                })
                    .catch(e => {
                    res.send({
                        status: 500,
                        message: "Internal Server Error"
                    });
                });
            }
            else {
                return requtil.invalidRequest(req, res);
            }
        });
    });
}
exports.authroutes = authroutes;
//# sourceMappingURL=authroutes.js.map