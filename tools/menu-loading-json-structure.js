'use strict';

const request = require('request');

const jsonUriToStructure = function (url, callback) {
  let structure = {};

  /**
   * structure
   * @param object
   * @param structureFraction
   * @param title
   * @returns {string}
   */
  const parse = function (object, structureFraction, title) {
    if (!title) {
      title = 'ROOT';
    }
    if (typeof structureFraction !== 'object') {
      structureFraction = {};
      structure[title] = structureFraction;
    }
    if (typeof structureFraction[title] === 'undefined' && object instanceof Object) {
      structureFraction[title] = {};
    }

    if (object instanceof Array) {
      var obj;
      if (!structureFraction[title][0]) {
        obj = {};
        structureFraction[title] = [obj];
      } else {
        obj = structureFraction[title][0];
      }
      object.map(function (item) {
        parse(item, obj, title);
      });
      return '';
    }
    if (object instanceof Object) {
      for (let k in object) {
        parse(object[k], structureFraction, k);
      }
      return '';
    }
    // otherwise, just use plain structure
    structureFraction[title] = typeof object;
  };

  /**
   * request
   *
   * @param url
   * @param callback
   * @returns {boolean}
   */
  const getJSON = function (url, callback) {
    console.log(url);
    try {
      request(url, function (err, resp, body) {
        let json = JSON.parse(body);
        parse(json._source);
        console.log(JSON.stringify(structure, null, 2));
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  getJSON(url, callback);

};


// test
jsonUriToStructure('http://10.227.1.250:9200/menu/menu/3587283', function (src) {
  console.log(src);
});

