"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.TEST_ENVIRONMENT_KEY = "TEST_ENV";
exports.RESPONSE_STRUCTURE_KEY = "response-structure";
exports.TEST_GROUP_KEY = "test-group-key";
exports.ASSERTING_KEY = "assert-equality";
exports.RESULT_REPORTING_KEY = "result-reporting";

exports.G_HELPER_KEY = "G_SHEET_HELPER";
exports.SHEET_ID_KEY = "sheet-id";
exports.TOP_LEFT_COORD_KEY = "top-left-coord";

function getTestEnvironmentConfig(request) {
    let config = request.getEnvironmentVariable(exports.TEST_ENVIRONMENT_KEY);
    return config;
}

function getGHelperConfig(request) {
    let config = request.getEnvironmentVariable(exports.G_HELPER_KEY);
    return config;
}

exports.getTestEnvironmentConfig = getTestEnvironmentConfig;
exports.getGHelperConfig = getGHelperConfig;