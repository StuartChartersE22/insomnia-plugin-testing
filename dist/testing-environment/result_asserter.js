"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const JSONPath = require('JSONPath');

var expected_json_structure;
var expected_json_path_json;
var assertion_types;

function extract_assertion_details(request_json, structure_config){
    logger_1.log(`Extracting assertion details`);
    reset_properties();
    const testing_json = extract_details_from_body(request_json);
    const testing_json_paths = extract_details_from_config(structure_config);
    // logger_1.log(`expected_json_structure: ${JSON.stringify(expected_json_structure)}\nexpected_json_path_json: ${JSON.stringify(expected_json_path_json)}\nassertion_types: ${JSON.stringify(assertion_types)}`)
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
            const assertion_type = assertion_types[key];
            if (typeof expected_json_path === "undefined") {
                skipped_values ++;
                return;
            }
            var expected_value = JSONPath.eval(expected_json, expected_json_path);
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
            var assertion_result;
            switch (assertion_type) {
                case "REGEX":
                    try {
                        assertion_result = Boolean(value[0].match(`/${expected_value[0]}/`));
                    } catch {
                        assertion_result = false;
                    }
                    break;
                default:
                    assertion_result = JSON.stringify(value) === JSON.stringify(expected_value);
            }
            test_results[name][`${key}-matches`] = assertion_result;
            assertion_result ? passed_assertions ++ : failed_assertions ++;
        });
    });
    const metrics = {"passed-assertions": passed_assertions, "failed-assertions": failed_assertions, "skipped-values": skipped_values, "skipped-references": skipped_references};
    logger_1.log(JSON.stringify(metrics));
    if (report_metrics) {
        test_results["metrics"] = metrics;
    }
    return test_results;
}

exports.extract_assertion_details = extract_assertion_details;
exports.assert_expected = assert_expected;

function reset_properties() {
    expected_json_structure = {};
    expected_json_path_json = {};
    assertion_types = {};
}

function extract_details_from_body(request_json) {
    var testing_json = {};
    Object.entries(request_json).forEach(([key, assertion_array]) => {
        logger_1.log(`assertion_array.length: ${assertion_array.length}`)
        switch (assertion_array.length) {
            case 2:
                try {
                    testing_json[key]= assertion_array[0];
                    expected_json_structure[key] = assertion_array[1];
                    break;
                } catch {}
            default:
                testing_json[key]= assertion_array;
        }
    });
    return testing_json;
}

function extract_details_from_config(structure_config) {
    var testing_json_paths = {};
    Object.entries(structure_config).forEach(([key, required_json_paths]) => {
        switch (required_json_paths.length) {
            case 3:
                try {
                    assertion_types[key] = required_json_paths[2];
                } catch {}
            case 2:
                try {
                    testing_json_paths[key] = required_json_paths[0];
                    expected_json_path_json[key] = required_json_paths[1];
                    break;
                } catch {}
            default:
                testing_json_paths[key] = required_json_paths;
        }
    });
    return testing_json_paths;
}