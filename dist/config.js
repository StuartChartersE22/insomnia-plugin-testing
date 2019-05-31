"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.TEST_ENVIRONMENT_KEY = "TEST_ENV";
exports.RESPONSE_STRUCTURE_KEY = "response-structure";
exports.TEST_GROUP_KEY = "test-group-key";
exports.G_HELPER_KEY = "G_SHEET_HELPER";

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