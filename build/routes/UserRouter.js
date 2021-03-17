"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
class UserRouter {
    constructor() {
        this._router = express_1.default.Router();
        this.route = "/login";
        this._action = "auth.login";
        this._configure();
    }
    get router() {
        return this._router;
    }
    _configure() {
        this._router.get("/", (req, res, next) => {
            res.status(200).send("hello there!");
        });
    }
}
module.exports = new UserRouter().router;