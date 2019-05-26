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
    const testRequestsKey = testConfig[config_1.TEST_GROUP_KEY]
    const body = context.request.getBodyText();
    const jsonBody = JSON.parse(body);
    if (!jsonBody) {
        return;
    }
    const testRequests = jsonBody[testRequestsKey];
    if (!testRequests){
        return;
    }
    try {
        const structured_response = response_structure_processor.processStructure(testConfig[config_1.RESPONSE_STRUCTURE_KEY], testRequests);
        context.request.setBodyText(JSON.stringify(structured_response));
    } catch (error) {
        logger_1.log(`response_structure_processor.processStructure failed`)
        return;
    }
}
exports.requestHooks = [requestHook];
