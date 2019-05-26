"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVIRONMENT_KEY = "TEST_VAR";
function getTestConfig(request) {
    let defaults = request.getEnvironmentVariable(exports.ENVIRONMENT_KEY);
    return defaults;
}
exports.getTestConfig = getTestConfig;