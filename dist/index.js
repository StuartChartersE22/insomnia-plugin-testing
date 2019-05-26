"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const testing_1 = require("./testing");
const logger_1 = require("./logger");
const defaultHandlers = {
    testing: testing_1.processDefaultParameters,
};
function requestHook(context) {
    const defaults = config_1.getDefaultsConfig(context.request);
    if (!defaults) {
        return;
    }
    Object.entries(defaults).forEach(([key, value]) => {
        if (key in defaultHandlers) {
            defaultHandlers[key](context.request, value);
        }
        else {
            logger_1.log(`Cannot handle defaults for ${key}`);
        }
    });
}
exports.requestHooks = [requestHook];
