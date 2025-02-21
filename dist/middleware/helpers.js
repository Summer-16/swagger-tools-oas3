/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Apigee Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugError = debugError;
exports.removeDashElementToCamelCase = removeDashElementToCamelCase;
const lodash_1 = require("lodash");
function debugError(err, logger) {
    let reason = err.message.replace(/^.*validation failed: /, '');
    reason = reason.charAt(0).toUpperCase() + reason.substring(1);
    logger.log('  Reason: %s', reason);
    if (err.failedValidation === true) {
        if (err.results) {
            logger.log('  Errors:');
            (0, lodash_1.each)(err.results.errors, function (error, index) {
                logger.log('    %d:', index);
                logger.log('      code: %s', error.code);
                logger.log('      message: %s', error.message);
                logger.log('      path: %s', JSON.stringify(error.path));
            });
        }
    }
    if (err.stack) {
        logger.log('  Stack:');
        (0, lodash_1.each)(err.stack.split('\n'), function (line, index) {
            // Skip the first line since it's in the reasonx
            if (index > 0) {
                logger.log('  %s', line);
            }
        });
    }
}
;
function removeDashElementToCamelCase(str) {
    const pieces = (0, lodash_1.split)(str, '-');
    if (pieces.length <= 1) {
        return str;
    }
    let result = pieces[0];
    for (let index = 1; index < pieces.length; index++) {
        result += (0, lodash_1.capitalize)(pieces[index]);
    }
    return result;
}
//# sourceMappingURL=helpers.js.map