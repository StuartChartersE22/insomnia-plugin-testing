# insomnia-plugin-testing

## Installation
1. Open your preferences in Insomnia
2. Type `insomnia-plugin-testing`
3. Click 'Install Plugin'

## Usage
Forms a testing environment that returns predefined properties from all requests (all requests must have the same response structure). At the moment, it must be pointed to an end point that returns the request or stores the request for the user to analyse.

The request body is JSON with a key of a reference name for the request and a value of a raw body response hooks to the corresponding requests you wish to test. The trigger behaviour must be set to always for the intended behaviour of running the requests automatically. Selecting other triggers will just collate the most recent runs together.

```
{
    "Key defined in the Insomnia environment under test-group-key": {
        "Reference test name1": Response1 hook raw body,
        "Reference test name2": Response2 hook raw body,
        "Reference test name3": Response3 hook raw body
    }
}
```

You define the response structure in your Insomnia environment.

```
{
    "TEST_ENV": {
        "test-group-key": "Key under which the JSON object of requests sits"
        "response-structure": {
            "field-name1": "JSON path string",
            "field-name2": "JSON path string",
            "field-name3": "JSON path string"
        }
    }
}
```

# Google Sheet Helper

Included in the testing plugin is a Google sheet helper, which will output the test results to a Google Sheet. This can also be used as stand alone functionality. It can be plugged in serperately as well using [insomnia-plugin-google-sheets-helper](https://github.com/StuartChartersE22/insomnia-plugin-google-sheets-helper "Google Sheets helper plugin").

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