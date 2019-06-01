"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const response_structure_processor = require("./testing-environment/response-structure");
const result_asserter = require("./testing-environment/result_asserter");
const logger_1 = require("./logger");
const g_request_processor = require("./google-sheets-helper/request_formatter");

function requestHook(context) {
    test_formatter(context);
    send_to_sheet(context);
}

function test_formatter(context) {
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
    var testRequests = jsonBody[testRequestsKey];
    if (!testRequests){
        return;
    }
    logger_1.log(`Start testing`);
    var structure_config = testConfig[config_1.RESPONSE_STRUCTURE_KEY];
    if (testConfig[config_1.ASSERTING_KEY]) {
        const reformatted_details = result_asserter.extract_assertion_details(testRequests, structure_config);
        testRequests = reformatted_details[0];
        structure_config = reformatted_details[1];
    }
    var structured_response = response_structure_processor.processStructure(testRequests, structure_config);
    if (testConfig[config_1.ASSERTING_KEY]) {
        const reporting_mode = testConfig[config_1.RESULT_REPORTING_KEY];
        const report_metrics = testConfig[config_1.REPORT_METRICS_KEY];
        structured_response = result_asserter.assert_expected(structured_response, reporting_mode, report_metrics);
    }
    jsonBody[testRequestsKey] = structured_response;
    context.request.setBodyText(JSON.stringify(jsonBody));
    logger_1.log(`Finished testing`)
    return;
}

function send_to_sheet(context) {
    const initial_request = context.request;
    const initial_request_url = initial_request.getUrl();
    if (!initial_request_url.match(/^http:\/\/g\-sheet\-request\[\d+\]$/i)) {
        return;
    }
    const sheet_option_number = Number(initial_request_url.substring(initial_request_url.indexOf("[") + 1, initial_request_url.indexOf("]")));
    const sheet_config = config_1.getTestEnvironmentConfig(initial_request)[sheet_option_number];
    if (!sheet_config) {
        return;
    }
    logger_1.log(`Start g helper`);
    const sheet_id = sheet_config[config_1.SHEET_ID_KEY];
    var top_left_a1 = "a1"
    if (sheet_config[config_1.TOP_LEFT_COORD_KEY]){
        top_left_a1 = sheet_config[config_1.TOP_LEFT_COORD_KEY].toLowerCase();
    }
    const body = initial_request.getBodyText();
    const json_body = JSON.parse(body);
    if (!json_body) {
        logger_1.log(`Body needs to be in a JSON format. Unable to parse`)
        return;
    }
    const formatted_body = g_request_processor.format_body(json_body, [0,0]);
    // logger_1.log(`Formatted body: ${JSON.stringify(formatted_body)}`)
    context.request = g_request_processor.format_request(sheet_id, formatted_body, initial_request, top_left_a1);
    logger_1.log(`Finished g helper`);
    return;
}

exports.requestHooks = [requestHook];
