"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const JSONPath = require('JSONPath');

function processStructure(testRequests, structureConfig){
    logger_1.log(`Processing test JSON`)
    var structuredResponse = {};
    Object.entries(testRequests).forEach(([name, testRequest]) => {
        var testRequestResult = {};
        Object.entries(structureConfig).forEach(([key, requiredJsonPath]) => {
            var result = JSONPath.eval(testRequest, requiredJsonPath);
            if (result === false) {
                result = "not present";
            }
            testRequestResult[key] = result;
        });
        structuredResponse[name] = testRequestResult;
    });
    logger_1.log(`processed`);
    return structuredResponse;
}

exports.processStructure = processStructure;