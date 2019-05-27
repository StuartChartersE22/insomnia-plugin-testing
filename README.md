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