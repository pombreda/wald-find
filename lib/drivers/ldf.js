/**
 *   This file is part of wald:find.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

'use strict';

var when = require ('when');
var ldf = require('ldf-client');

require ('ldf-client/lib/util/Logger').setLevel ('WARNING');
var FilterIterator = require ('ldf-client/lib/iterators/FilterIterator');

var matchesPattern = function (pattern, triple) {
    var subjectMatch = pattern.subject === triple.subject
        || pattern.subject === null || pattern.subject === '';

    var predicateMatch = pattern.predicate === triple.predicate
        || pattern.predicate === null || pattern.predicate === '';

    var objectMatch = pattern.object === triple.object
        || pattern.object === null || pattern.object === '';

    return subjectMatch && predicateMatch && objectMatch;
};

var Driver = function (connection) {
    this._client = new ldf.FragmentsClient (connection);
};

Driver.prototype.query = function (pattern) {
    var deferred = when.defer();

    var fragment = this._client.getFragmentByPattern(pattern);
    var filtered = new FilterIterator (fragment, function (triple) {
        return matchesPattern (pattern, triple);
    });

    filtered.toArray (function (error, items) {
        if (error) {
            console.log('ERROR:', error);
            deferred.reject (error);
        } else {
            deferred.resolve (items);
        }
    });

    return deferred.promise;
};

module.exports = function (registry) {
    registry.register('ldf', Driver);
};
