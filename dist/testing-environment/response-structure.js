"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const jsonProcessor = require("../helpers/json-path");

function processStructure(testRequests, structureConfig){
    logger_1.log(`Start processing`)
    var structuredResponse = {};
    Object.entries(testRequests).forEach(([name, testRequest]) => {
        var testRequestResult = {};
        Object.entries(structureConfig).forEach(([key, requiredJsonPath]) => {
            try {
                testRequestResult[key] = jsonProcessor.jsonPath(testRequest, requiredJsonPath);
            } catch (error) {
                testRequestResult[key] = "";
            }
        });
        structuredResponse[name] = testRequestResult;
    });
    return structuredResponse;
}

exports.processStructure = processStructure;