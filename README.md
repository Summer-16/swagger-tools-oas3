The project provides various tools for integrating and interacting with Swagger.  This project is in its infancy but
what is within the repository should be fully tested and reusable.  Please visit the [issue tracker][project-issues] to
see what issues we are aware of and what features/enhancements we are working on.

## Project Badges

* Build status: [![Build Status](https://travis-ci.org/apigee-127/swagger-tools.svg)](https://travis-ci.org/apigee-127/swagger-tools)
* Dependencies: [![Dependencies](https://david-dm.org/apigee-127/swagger-tools.svg)](https://david-dm.org/apigee-127/swagger-tools)
* Developer dependencies: [![Dev Dependencies](https://david-dm.org/apigee-127/swagger-tools/dev-status.svg)](https://david-dm.org/apigee-127/swagger-tools#info=devDependencies&view=table)
* Downloads: [![NPM Downloads Per Month](http://img.shields.io/npm/dm/swagger-tools.svg)](https://www.npmjs.org/package/swagger-tools)
* License: [![License](http://img.shields.io/npm/l/swagger-tools.svg)](https://github.com/apigee-127/swagger-tools/blob/master/LICENSE)
* Version: [![NPM Version](http://img.shields.io/npm/v/swagger-tools.svg)](https://www.npmjs.org/package/swagger-tools)

## Supported Swagger Versions

* [1.2][swagger-docs-v1_2]
* [2.0 (WIP)][swagger-docs-v2_0]

## Features

* Schema validation: For the file(s) supported by the Swagger specification, ensure they pass structural validation
based on the [JSON Schema][json-schema] associated with that version of the specification
* Semantic validation: Validates Swagger files above and beyond the structure of the file
* Connect middleware for adding pertinent Swagger information to your requests (swagger-metadata)
* Connect middleware for wiring request handlers to requests based on Swagger documentation (swagger-router)
* Connect middleware for serving your Swagger documents and [Swagger UI][swagger-ui]
* Connect middleware for using Swagger resource documents for pre-route validation (swagger-validator)
    * Validate the request Content-Type based on the operation's `consumes` value(s)
    * Validate the request parameter types
    * Validate the request parameter values

## Installation

swagger-tools is distributed via [NPM][npm] so installation is the usual: `npm install swagger-tools --save`

## Usage

The swagger-tools module currently exposes one property: `v1_2`.  This is a reference to an object that has the
following structure:

* `docsUrl`: This is a link to the Swagger documentation for the corresponding specification version
* `schemasUrl`: This is a link to the Swagger JSON Schema files for the corresponding specification version
* `version`: This is the Swagger specification version
* `schemas`: This is an object where the keys are the Swagger JSON Schema file names and the object is the loaded schema
contents
* `validate`: This is a function used to validate your Swagger document(s) based on the schema(s) for that
specifications schemas and semantically
* `composeModel`: This takes a Swagger document and generates a JSON Schema representation of the model completely
composed
* `validateModel`: This takes a Swagger document, a model id/path and a model document and validates the model document
against its defined schema in the Swagger document

## Documentation

For more detailed documentation on what is provided by Swagger Tools and how to use it, please view the
[documentation][documentation] or jump straight to the [Quick Start][quick-start].

## Contributing

This project uses [Gulp][gulp] for building so `npm install -g gulp` once you clone this project.  Running `gulp` in the
project root will lint check the source code and run the unit tests.

[documentation]: https://github.com/apigee-127/swagger-tools/blob/master/docs/README.md
[gulp]: http://gulpjs.com/
[json-schema]: http://json-schema.org/
[npm]: https://www.npmjs.org/
[project-issues]: https://github.com/apigee/swagger-tools/issues
[quick-start]: https://github.com/apigee-127/swagger-tools/blob/master/docs/QuickStart.md
[swagger]: https://helloreverb.com/developers/swagger
[swagger-docs-v1_2]: https://github.com/wordnik/swagger-spec/blob/master/versions/1.2.md
[swagger-docs-v2_0]: https://github.com/reverb/swagger-spec/blob/master/versions/2.0.md
[swagger-ui]: https://github.com/wordnik/swagger-ui
