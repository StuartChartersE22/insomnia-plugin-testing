"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const jsonProcessor = require("./json-path");

function processStructure(structureConfig, testRequests){
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
        logger_1.log(`test request result: ${testRequestResult}`)
        structuredResponse[name] = testRequestResult;
    });
    return structuredResponse;
}

exports.processStructure = processStructure;