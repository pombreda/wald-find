#!/usr/bin/env node
'use strict';

var query = require('../lib/query');
var core = require('../lib/core');

var wq = query.connect('ldf:http://localhost:4014/licensedb');
var result = wq.query('http://gnu.org/licenses/gpl-3.0.html', {
    id: '@id',
    logo: 'foaf:logo',
    sameAs: [ 'owl:sameAs' ],
    name: 'dcterms:title',
    version: 'dcterms:hasVersion',
    replaces: [ 'dcterms:replaces' ],
}).then (core.normalizeModel);

result.then (function (data) {
    console.log (JSON.stringify (data, null, 4));
}).catch (function (error) {
    console.log ('ERROR:', error.message);
});