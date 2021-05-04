/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const express = require('express');
const project = require('@lib/utils/project');
const {
  getFormatFromRequest,
  DEFAULT_FORMAT,
} = require('../amp/formatHelper.js');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const {optimize} = require('@lib/utils/ampOptimizer.js');
const path = require('path');

// eslint-disable-next-line new-cap
const inlineExamples = express.Router();

inlineExamples.get('/*', async (request, response, next) => {
  const format = getFormatFromRequest(request);
  if (format && format !== DEFAULT_FORMAT) {
    request.url = request.path.replace('.html', `.${format}.html`);
  }

  try {
    const example = await readFileAsync(
      path.join(project.paths.INLINE_EXAMPLES_DEST, request.url),
      'utf-8'
    );
    response.send(await optimize(request, example));
  } catch (e) {
    next(e);
  }
});

module.exports = inlineExamples;
