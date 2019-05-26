"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const response_structure_processor = require("./testing-environment/response-structure");
const logger_1 = require("./logger");

function requestHook(context) {
    const testConfig = config_1.getTestEnvironmentConfig(context.request);
    if (!testConfig) {
        return;
    }
    try {
        const structured_response = response_structure_processor.processStructure(testConfig[config_1.RESPONSE_STRUCTURE_KEY], context.request);
        context.request.setBodyText(structured_response);
    } catch (error) {
        logger_1.log(`Need valid response structure defined under ${config_1.RESPONSE_STRUCTURE_KEY}`)
        return;
    }
}
exports.requestHooks = [requestHook];
