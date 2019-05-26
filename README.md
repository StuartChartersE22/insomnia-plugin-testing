# insomnia-plugin-testing

## Installation
1. Open your preferences in Insomnia
2. Type `insomnia-plugin-testing`
3. Click 'Install Plugin'

## Usage
Forms a testing environment that returns predefined properties from all requests (all requests must have the same response structure).

The request body is JSON with a key of a reference name for the request and a value of a raw body response hooks to the corresponding requests you wish to test. The trigger behaviour must be set to always for the intended behaviour of running the requests automatically. Selecting other triggers will just collate the most recent runs together.

You define the response structure in your Insomnia environment.

```
{
    "TEST_ENV": {
        "response-structure": {
            "field-name1": "JSON path",
            "field-name2": "JSON path",
            "field-name3": "JSON path"
        }
    }
}
```