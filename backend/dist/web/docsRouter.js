"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsRouter = void 0;
const express_1 = require("express");
const openapi_json_1 = __importDefault(require("./openapi.json"));
exports.docsRouter = (0, express_1.Router)();
exports.docsRouter.get("/openapi.json", (_req, res) => {
    res.json(openapi_json_1.default);
});
