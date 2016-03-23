[![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

[![NPM][npm-image]][npm-url]

# simple-jsonapi
A node.js module for serializing objects to [JSON API][json-api-url] compliant documents. Very flexible whilst not caring about your choice of framework or database layer. Aims to cover the latest published version of the spec, which is currently 1.0.

Inspired by the great work of these modules:
* [jsonapi-serializer](https://github.com/SeyZ/jsonapi-serializer)
* [jsonapify](https://github.com/alex94puchades/jsonapify)
* [json-api](https://github.com/tobscure/json-api)

**Note:** this is a very young module, and as such, has no proven track record...yet. Please feel free to give it a spin in your project and send me some feedback, but take it with a pinch of salt for now.

## Why another JSON API module?
There's a couple of reasons:

* [JSON API][json-api-url] is a relatively young specification, and I believe that having a strong variety of modules available to developers will help in increasing it's adoption.
* I wanted a module that keeps the power and flexibility in my hands without hiding behind any magic. This also means keeping to itself, and not worrying about my choices of frameworks, databases and other modules.
* I wanted a module that speaks the same language as the specification, namely by using concepts such as *document*, *resource*, *relationship* etc.

These all boil down to a matter of personal opinion, but I hope you enjoy the approach I've taken.

## Installation
Grab it from the NPM repository:
```
npm install simple-jsonapi
```

## Quick start
Import the module:
```
var api = require('simple-jsonapi');
```
Create a serializer:
```
var serializer = new api.Serializer({
    getType: function(resource, options, callback) {
        callback(null, 'person')
    },
    getId: function(resource, options, callback) {
        callback(null, resource.id);
    },
    getAttributes: function(resource, options, callback) {
        var attributes = {
            firstName: resource.firstName,
            lastName: resource.lastName
        };

        callback(null, attributes);
    }
});
```
Create a resource with some data and your new serializer:
```
var user = {
    id: 1,
    firstName: 'John',
    lastName: 'Smith'
};

var resource = new api.Resource(user, serializer);
```
Create a document using your new resource:
```
var document = new api.Document(resource);
```
Serialize that baby:
```
var output = document.toJSON();
```
And you should be left with `output` being:
```
{
    data: {
        type: 'person',
        id: 1,
        attributes: {
            firstName: 'John',
            lastName: 'Smith'
        }
    }
}
```
Pop that into the normal `JSON.stringify()` or `res.json()` methods, and you're good to go.

## Detailed usage
*Coming soon...*

## Testing
Running the tests is easy - just use:
```
npm test
```

## Still to do
- [ ] allow the use of promises as an alternative to callbacks
- [ ] add a helper method for deserializing
- [ ] add more robust parameter checking and error handling
- [ ] add more edge cases to tests

## Contributing
*Coming soon...*

[travis-image]: https://travis-ci.org/allistercsmith/simple-jsonapi.svg?branch=master
[travis-url]: https://travis-ci.org/allistercsmith/simple-jsonapi

[coveralls-image]: https://coveralls.io/repos/github/allistercsmith/simple-jsonapi/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/allistercsmith/simple-jsonapi?branch=master

[npm-image]: https://nodei.co/npm/simple-jsonapi.png?downloads=true
[npm-url]: https://nodei.co/npm/simple-jsonapi/

[json-api-url]: http://jsonapi.org
