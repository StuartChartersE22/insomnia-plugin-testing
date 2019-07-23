"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");

function not_present(expected_value){
    const assertion_result = Object.values(expected_value).includes("not present") || expected_value == "not present";
    return assertion_result
}

function regex(value, regex_string){
    var assertion_result;
    try {
        const regex = new RegExp(regex_string);
        assertion_result = Boolean(value.match(regex));
    } catch {
        assertion_result = false;
    }
    return assertion_result;
}

function containsOne(actual_value_array, expected_value_array){
    var assertion_result = false;
    const continue_state = false;
    return contains(actual_value_array, expected_value_array, assertion_result, continue_state);
}

function containsAll(actual_value_array, expected_value_array){
    var assertion_result = true;
    const continue_state = true;
    return contains(actual_value_array, expected_value_array, assertion_result, continue_state);
}

exports.not_present = not_present;
exports.regex = regex;
exports.containsOne = containsOne;
exports.containsAll = containsAll;

function contains(actual_value_array, expected_value_array, assertion_result, continue_state){
    var i = 0;
    while (i < expected_value_array.length && assertion_result === continue_state) {
        const comparison_value = expected_value_array[i];
        assertion_result = actual_value_array.includes(comparison_value);
        i++;
    }
    return assertion_result;
}