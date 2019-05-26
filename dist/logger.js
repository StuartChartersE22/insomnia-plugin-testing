"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOG_PREFIX = `[insomnia-plugin-testing]: `;
function log(message) {
    console.log(`${LOG_PREFIX}${message}`);
}
exports.log = log;
