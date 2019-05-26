"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.ENVIRONMENT_KEY = "TEST_ENV";
exports.RESPONSE_STRUCTURE_KEY = "response-structure";

function getTestEnvironmentConfig(request) {
    let config = request.getEnvironmentVariable(ENVIRONMENT_KEY);
    return config;
}

exports.getTestEnvironmentConfig = getTestEnvironmentConfig;