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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const token_config_1 = __importDefault(require("../config/token.config"));
module.exports = function createToken(user, User) {
    return __awaiter(this, void 0, void 0, function* () {
        let uuid = uuid_1.v4();
        yield User.update({ login: user.login }, { id: uuid });
        console.log(uuid);
        let tokenConfig = token_config_1.default.config;
        const expiresIn = tokenConfig.date; // 1 month
        const secret = tokenConfig.secretKey;
        const dataStoredInToken = {
            _id: uuid,
        };
        return {
            expiresIn,
            token: jsonwebtoken_1.default.sign(dataStoredInToken, secret, { expiresIn }),
        };
    });
};
