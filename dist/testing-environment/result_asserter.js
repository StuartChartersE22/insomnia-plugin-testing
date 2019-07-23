"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const JSONPath = require("JSONPath");
const assertion_method = require("./assertion_methods")

var expected_json_structure;
var expected_json_path_json;
var assertion_types;

function extract_assertion_details(request_json, structure_config){
    logger_1.log(`Extracting assertion details`);
    reset_properties();
    const testing_json = extract_details_from_body(request_json);
    const testing_json_paths = extract_details_from_config(structure_config);
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
            var assertion_type = assertion_types[key];
            if (typeof expected_json_path === "undefined") {
                skipped_values ++;
                return;
            }
            var expected_value = JSONPath.eval(expected_json, expected_json_path);
            if (expected_value == "") {
                skipped_values ++;
                return;
            }
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
            var invert = false;
            if (assertion_type.includes("NOT ")) {
                assertion_type = assertion_type.replace("NOT ", "");
                invert = true;
            }
            if (value == "") {
                if (assertion_type === "CONTAINS ALL" || assertion_type === "CONTAINS"){
                    assertion_result = expected_value[0] == "not present";
                } else {
                    assertion_result = assertion_method.not_present(expected_value[0]);
                }
            } else {
                switch (assertion_type) {
                    case "REGEX":
                        assertion_result = assertion_method.regex(value[0], expected_value[0]);
                        break;
                    case "CONTAINS":
                    case "CONTAINS ALL":
                        try {
                            const actual_value_array = form_actual_value_array(value);
                            const comparison_array = form_comparison_array(expected_value);
                            assertion_result = assertion_method.containsAll(actual_value_array, comparison_array);
                        } catch {
                            logger_1.log(`error contains all`);
                            assertion_result = false;
                        }
                           break;
                    case "CONTAINS ONE":
                        try {
                            const actual_value_array = form_actual_value_array(value);
                            const comparison_array = form_comparison_array(expected_value);
                            assertion_result = assertion_method.containsOne(actual_value_array, comparison_array);
                        } catch {
                            logger_1.log(`error contains one`);
                            assertion_result = false;
                        }
                        break;
                    default:
                        assertion_result = JSON.stringify(value) === JSON.stringify(expected_value);
                }
            }
            if (invert) {
                assertion_result = !assertion_result;
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

function form_comparison_array(expected_value){
    const comparison_array = [];
    expected_value.forEach(entry => {
        try {
            entry.forEach(sub_entry => comparison_array.push(sub_entry));
        } catch {
            comparison_array.push(entry)
        }
    });
    return comparison_array;
}

function form_actual_value_array(actual_value){
    const actual_value_array = [];
    actual_value.forEach(entry => actual_value_array.push(entry));
    return actual_value_array;
}