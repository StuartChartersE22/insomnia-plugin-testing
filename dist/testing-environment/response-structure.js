"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const jsonProcessor = require("./json-path");

function processStructure(structureConfig, request){
    try {
        var testRequests = JSON.parse(request.getBodyText());
    } catch (error) {
        logger_1.log("Request body must be valid JSON");
    }
    var structuredResponse = {}
    Object.entries(testRequests).forEach(([name, testRequest]) => {
        let testRequestResult = structuredResponse[name];
        Object.entries(structureConfig).forEach(([key, requiredJsonPath]) => {
            try {
                testRequestResult[key] = jsonProcessor.jsonPath(testRequest, requiredJsonPath);
            } catch (error) {
                testRequestResult[key] = "";
            }
        });
    });

    return structuredResponse;
}

exports.processStructure = processStructure;