"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.TEST_ENVIRONMENT_KEY = "TEST_ENV";
exports.RESPONSE_STRUCTURE_KEY = "response-structure";
exports.TEST_GROUP_KEY = "test-group-key";

function getTestEnvironmentConfig(request) {
    let config = request.getEnvironmentVariable(exports.TEST_ENVIRONMENT_KEY);
    return config;
}

exports.getTestEnvironmentConfig = getTestEnvironmentConfig;