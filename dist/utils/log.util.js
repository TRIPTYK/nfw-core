"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadowLog = exports.fullLog = void 0;
const NodeUtil = require("util");
const fullLog = (element) => console.log(NodeUtil.inspect(element, { showHidden: true, depth: null, colors: true }));
exports.fullLog = fullLog;
const shadowLog = (element) => console.log(NodeUtil.inspect(element, { showHidden: true, depth: 1, colors: true }));
exports.shadowLog = shadowLog;
