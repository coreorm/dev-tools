/**
 * php object generator
 * will automatically make setter/getters with proper comments
 * told ya'll i'm lazy.
 */
'use strict';
// 1st. gimme a source json, and a target file
let args = [];

var startRetrieving = false;
process.argv.forEach(function (el) {
  if (el.indexOf('php-object-generator.js') >= 0) {
    startRetrieving = true;
  }
  if (startRetrieving) {
    args.push(el);
  }
});

const jsonTemplate = {
  class: 'Foo',
  parent: 'Bar',
  namespace: "/Foo/Bar",
  use: ["class1", "class2"],
  comment: ['@see something', 'a new line'],
  data: {
    id: 'int',
    name: 'string',
    address: 'string',
    external_object: '/Class',
    array_element: 'array'
  }
};

const help = () => {
  console.log(`
USAGE:
node php-object-generator.js <object.json> <target.php>
  
object.json example:
${JSON.stringify(jsonTemplate, null, 2)}  
  
NOTE:
 JS doesn't like backslash \\ so please use / instead, it will be replaced with backslash in the actual code.

If you have custom functions, place them at the bottom of the class and mark as custom func by putting this line above the code:
# custom functions
 
and the file will be updated instead of overwritten. 
 
`);
};


// funcs
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const slash = (str) => str.replace(/\//g, '\\');

String.prototype.camelCase = function () {
  let tmpAr = this.split('_');
  let output = '';
  tmpAr.forEach(function (el) {
    output += el.capitalizeFirstLetter();
  });
  return output;
};

const setter = (name, type) => {
  let typeStr = '';
  if (type.indexOf('/') >= 0) {
    typeStr = slash(type) + ' ';
  }
  return `    
    /**
     * set ${name}
     * @param ${type} $val
     * @return $this
     */
    public function set${name.camelCase()}(${typeStr}$val)
    {
        return $this->set('${name}', $val);
    }  
`;
};

const getter = (name, type) => {
  let typeStr = slash(type);

  return `
    /**
     * get ${name}
     * @param mixed $default null
     * @return ${typeStr}
     */
    public function get${name.camelCase()}($default = null)
    {
        return $this->get('${name}', $default);
    }

`;
};

const classifier = (conf) => {
  let src = '';
  let used = '';

  if (conf.use) {
    used = 'use ' + conf.use.join(', ') + ';';
  }

  src += slash(`<?php
namespace ${conf.namespace};

${used}

class ${conf.class} extends ${conf.parent}
{`);

  for (let i in conf.data) {
    let k = conf.data[i];
    src += setter(i, k);
  }

  for (let i in conf.data) {
    let k = conf.data[i];
    src += getter(i, k);
  }

  return src + '}';

};


// verify
if (!args[2]) {
  help();
  process.exit(1);
}

// read args
const fs = require('fs');
const classConfig = JSON.parse(fs.readFileSync(args[1]));

let data = classifier(classConfig);

const targFile = args[2];

let srcExisting = fs.readFileSync(targFile).toString();

if (srcExisting.indexOf('# custom functions') >= 0) {
  // update
  let tmpAr = srcExisting.split('# custom functions');
  tmpAr[0] = data.slice(0, data.length - 1);
  data = tmpAr.join('# custom functions');
}

// write
fs.writeFileSync(args[2], data);

// finish here
console.log('File generated to ' + args[2]);
