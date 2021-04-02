"use strict";
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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const HttpException_1 = __importDefault(require("../../models/HttpException"));
const MasterValidator_1 = __importDefault(require("../../MasterValidator"));
const ResponseSchema_1 = __importDefault(require("../../models/ResponseSchema"));
const user_validator_1 = require("../validators/user.validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const exitCodes_config_1 = __importDefault(require("../../config/exitCodes.config"));
const createToken_1 = __importDefault(require("../../scripts/createToken"));
class UserRouter {
    constructor() {
        this._router = express_1.default.Router();
        this._registration = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            yield user_model_1.default.findOne({ login: userData.login }, {}, {}, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (user)
                    next(new HttpException_1.default(0, 400, exitCodes_config_1.default.loginWasTaken));
                else {
                    yield user_model_1.default.findOne({ mail: userData.mail }, {}, {}, (err, user) => __awaiter(this, void 0, void 0, function* () {
                        if (user)
                            next(new HttpException_1.default(0, 400, exitCodes_config_1.default.emailWasTaken));
                        else {
                            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
                            const user = yield user_model_1.default.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                            const tokenData = yield createToken_1.default(user, user_model_1.default);
                            yield response.setHeader("Set-Cookie", [this._createCookie(tokenData)]);
                            yield response.send(new ResponseSchema_1.default(request.originalUrl, { tokenData }, 1, exitCodes_config_1.default.success));
                        }
                    }));
                }
            }));
        });
        this._login = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            yield user_model_1.default.findOne({ login: userData.login }, {}, {}, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (!user)
                    next(new HttpException_1.default(0, 400, exitCodes_config_1.default.userNotFound));
                else {
                    const isPasswordMatching = yield bcrypt_1.default.compare(userData.password, user.password);
                    if (isPasswordMatching) {
                        const tokenData = yield createToken_1.default(user, user_model_1.default);
                        response.setHeader("Set-Cookie", [this._createCookie(tokenData)]);
                        response.send(new ResponseSchema_1.default(request.originalUrl, { tokenData }, 1, exitCodes_config_1.default.success));
                    }
                    else {
                        next(new HttpException_1.default(0, 400, exitCodes_config_1.default.wrongPassword));
                    }
                }
            }));
        });
        this._configure();
    }
    get router() {
        return this._router;
    }
    _createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/api/`;
    }
    _configure() {
        this._router.post("/register", MasterValidator_1.default.validationMiddleware(user_validator_1.RegisterDto), this._registration);
        this._router.post("/login", MasterValidator_1.default.validationMiddleware(user_validator_1.LoginDto), this._login);
    }
}
module.exports = new UserRouter().router;
