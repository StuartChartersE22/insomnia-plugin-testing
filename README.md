# insomnia-plugin-testing

## Installation
1. Open your preferences in Insomnia
2. Type `insomnia-plugin-testing`
3. Click 'Install Plugin'

# Goal

This plugin is designed to provide a group of functionality that can be configured and used to help test single or multiple requests that are stored in a your Insomnia environment. The functionality can also be used seperately to enhance the overall usage of Insomnia.

# Test Request Formatter

This takes a JSON object under an environment defined key and runs through each key in the section to transform the corresponding JSON value into environment defined fields with values derived by JSON paths. This can be used to digest multiple existing requests who have the same response structure through the use of the [Insomnia Chaining Requests](https://support.insomnia.rest/article/43-chaining-requests "Insomnia chaining requests article") with response reference type "Raw Body".

## Usage
The request body is JSON with a key of a reference name and a value of JSON. This can be set up to trigger existing request to run by setting the value JSON to be a Response hook with response reference type of "Raw Body" and trigger behaviour of "Always".

The response field names and value paths are defined in the Insomnia environment. This will be the structure of the value under the key defined by the environment variable "test-group-key".


Request:
```
{
    "Key defined in the Insomnia environment under test-group-key": {
        "Reference name1": JSON1,
        "Reference name2": JSON2,
        "Reference name3": JSON3
    }
}
```

Environment:
```
{
    "TEST_ENV": {
        "test-group-key": "Key under which the JSON object of requests sits",
        "response-structure": {
            "field-name1": "JSON path string",
            "field-name2": "JSON path string",
            "field-name3": "JSON path string"
        }
    }
}
```

## Test Result Assertion

Optional functionality of the test request formatter that allows the value of each field to be compared with another value to see if they are equal. 

### Usage
To turn on, the "assert-equality" environment variable is present and set to true. The value of each reference name is set to an array with the JSON to be tested first and a JSON object containing the expected results second.

In the test environment configuration As default, the boolean result is added under the each field name with the key "\[field-name\]-matches". There are optional fields to add the expected value into the resopnse with the key "\[field-name\]-expected" or have only the matches evaluation result returned. 

Request:
```
{
    "Key defined in the Insomnia environment under test-group-key": {
        "Reference name1": [JSON1, expectedJSON1],
        "Reference name2": [JSON2, expectedJSON2],
        "Reference name3": [JSON3, expectedJSON3]
    }
}
```

Environment:
```
{
    "TEST_ENV": {
        "test-group-key": "Key under which the JSON object of requests sits",
        "assert-equality": true,
        "response-structure": {
            "field-name1": ["testing JSON path", expected JSON path],
            "field-name2": ["testing JSON path", expected JSON path],
            "field-name3": ["testing JSON path", expected JSON path]
        }
    } 
}
```

# Google Sheet Posting Helper

This will output a given body of JSON to an environment defined Google Sheet. This also comes as a serperate plugin and can be installed using [insomnia-plugin-google-sheets-helper](https://github.com/StuartChartersE22/insomnia-plugin-google-sheets-helper "Google Sheets helper plugin").

## Usage
Allows easy insertion of a JSON structure to a Google sheet whose ID is specified in the Insomnia Environment. The user must set up OAuth 2 token for the Google Sheet API to work. Here are instructions to [authorise on the Google API](https://developers.google.com/sheets/api/guides/authorizing "Google Sheet's Authorisation") and [set up OAuth in Insomnia](https://insomnia.rest/blog/oauth2-github-api/ "Insomnia OAuth setup")

The JSON structure will be converted to key value pairs being in adjacent columns. JSON objects as values will leave space in the key column and populate down the value column. JSON objects will cascade through repeating the pattern described, moving across the columns as the tree gets deeper. Currently limited to maximum right column of ZZ.

Request JSON:
```
{
    "Top": {
        "Child1": "String",
        "Child2": {
            "GrandChild21": "String",
            "GrandChild22": "String"
        },
        "Child3": [GrandChild31,GrandChild32]
    }
}
```
Corresponding sheet layout:
```
----------------------------------------
| Top | Child1 | String       |        |
----------------------------------------
|     | Child2 | GrandChild21 | String |
----------------------------------------
|     |        | GrandChild22 | String |
----------------------------------------
|     | Child3 | GrandChild31 |        |
----------------------------------------
|     |        | GrandChild32 |        |
----------------------------------------
```

The end point must be set to PUT "g-sheet-request" for the intended request to be picked up. The actual request URL is automatically generated from the Sheet's ID. It will be the [Google spreadsheets.values.update end point](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update).

```
{
    "G_SHEET_HELPER": {
        "sheet-id": "String",
        "top-left-coord": "A1" (optional)
    }
}
```