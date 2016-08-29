'use strict';

let args = [];

var startRetrieving = false;
process.argv.forEach(function (el) {
  if (el.indexOf('structure.js') >= 0) {
    startRetrieving = true;
  }
  if (startRetrieving) {
    args.push(el);
  }
});


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
      structureFraction = structure = {};
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
      delete structureFraction[title];
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
if (!args[1]) args[1] = 'http://10.227.1.250:9200/menu/menu/582469';

jsonUriToStructure(args[1], function (src) {
  console.log(src);
});

