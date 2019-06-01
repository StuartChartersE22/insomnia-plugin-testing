"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const json_processor = require("../helpers/json-path");

var expected_json_structure = {};
var expected_json_path_json = {};

function extract_assertion_details(request_json, structure_config){
    logger_1.log(`start extracting`);
    var testing_json = {};
    Object.entries(request_json).forEach(([key, assertion_array]) => {
        if (assertion_array.length === 2) {
            try {
                testing_json[key]= assertion_array[0];
                expected_json_structure[key] = assertion_array[1];
            } catch {
                testing_json[key]= assertion_array;
            }
        } else {
            testing_json[key]= assertion_array;
        }
    });
    var testing_json_paths = {};
    Object.entries(structure_config).forEach(([key, required_json_paths]) => {
        if (required_json_paths.length === 2){
            try {
                testing_json_paths[key] = required_json_paths[0];
                expected_json_path_json[key] = required_json_paths[1];
            } catch {
                testing_json_paths[key] = required_json_paths;
            }
        } else {
            testing_json_paths[key] = required_json_paths;
        }
    });
    return [testing_json, testing_json_paths];
}

function assert_expected(test_results) {
    logger_1.log(`start asserting`);
    Object.entries(test_results).forEach(([name, results]) => {
        var expected_json = expected_json_structure[name];
        if (typeof expected_json === "undefined") {
            return;
        }
        Object.entries(results).forEach(([key, value]) => {
            const expected_json_path = expected_json_path_json[key];
            if (typeof expected_json_path === "undefined") {
                return;
            }
            var expected_value;
            try {
                expected_value = json_processor.jsonPath(expected_json, expected_json_path);
            } catch {
                expected_value = "";
            }
            test_results[name][`${key}-matches`] = value === expected_value;
        });
    });
    return test_results;
}

exports.extract_assertion_details = extract_assertion_details;
exports.assert_expected = assert_expected;