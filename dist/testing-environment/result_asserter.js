"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const json_processor = require("../helpers/json-path");

var expected_json_structure = {};
var expected_json_path_json = {};

function extract_assertion_details(request_json, structure_config){
    logger_1.log(`Extracting assertion details`);
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
    logger_1.log(`Assertion details extracted`);
    return [testing_json, testing_json_paths];
}

function assert_expected(test_results, reporting_mode, report_metrics) {
    logger_1.log(`Asserting`);
    var passed_assertions = 0;
    var failed_assertions = 0;
    var skipped_values = 0;
    var skipped_references = 0;
    Object.entries(test_results).forEach(([name, results]) => {
        var expected_json = expected_json_structure[name];
        if (typeof expected_json === "undefined") {
            skipped_references ++;
            return;
        }
        Object.entries(results).forEach(([key, value]) => {
            const expected_json_path = expected_json_path_json[key];
            if (typeof expected_json_path === "undefined") {
                skipped_values ++;
                return;
            }
            var expected_value = json_processor.jsonPath(expected_json, expected_json_path);
            if (expected_value === false) {
                expected_value = "not present";
            }
            // logger_1.log(`test: ${JSON.stringify(value)}, expected: ${JSON.stringify(expected_value)}`)
            if (reporting_mode) {
                switch (reporting_mode.toUpperCase()) {
                    case "REDUCED":
                        delete test_results[name][key];
                        break;
                    case "VERBOSE":
                        test_results[name][`${key}-expected`] = expected_value;
                    default:
                        break;
                }
            }
            const assertion_result = JSON.stringify(value) === JSON.stringify(expected_value);
            test_results[name][`${key}-matches`] = assertion_result;
            assertion_result ? passed_assertions ++ : failed_assertions ++;
        });
    });
    const metrics = {"passed-assertions": passed_assertions, "failed-assertions": failed_assertions, "skipped-values": skipped_values, "skipped-references": skipped_references};
    logger_1.log(JSON.stringify(metrics));
    if (report_metrics) test_results["metrics"] = metrics;
    return test_results;
}

exports.extract_assertion_details = extract_assertion_details;
exports.assert_expected = assert_expected;