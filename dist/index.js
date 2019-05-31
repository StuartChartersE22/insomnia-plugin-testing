"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const response_structure_processor = require("./testing-environment/response-structure");
const logger_1 = require("./logger");
const g_helper = require("./google-sheets-helper/dist/index")

function requestHook(context) {
    const testConfig = config_1.getTestEnvironmentConfig(context.request);
    if (testConfig) {
        const testRequestsKey = testConfig[config_1.TEST_GROUP_KEY]
        const body = context.request.getBodyText();
        const jsonBody = JSON.parse(body);
        if (jsonBody) {
            const testRequests = jsonBody[testRequestsKey];
            if (testRequests){
                logger_1.log(`Start testing`);
                try {
                    const structured_response = response_structure_processor.processStructure(testConfig[config_1.RESPONSE_STRUCTURE_KEY], testRequests);
                    context.request.setBodyText(JSON.stringify(structured_response));
                } catch (error) {
                    logger_1.log(`response_structure_processor.processStructure failed`)
                }
            }
        }
    }
    g_helper.send_to_sheet(context);
}
exports.requestHooks = [requestHook];
