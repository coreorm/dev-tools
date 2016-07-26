# dev-tools
developer tools (no private stuff pls)

## JS for debug

Open up the chrome console, and type:
`$.getScript('https://goo.gl/nbRz6X');`

NOTE: it's shortened - the full url is `https://bruce-at-menulog.github.io/dev-tools/javascripts/bower_components/mltools/dist/tools.js`

## APIs available

Just use `ML_DEBUG` in the console and you'll figure out :)
 
e.g.
```
ML_DEBUG.summary() // prints out a summary

ML_DEBUG.file('checkout')   // will fetch any file with 'checkout' in it

ML_DEBUG.benchmark() // will list all benchmarks

ML_DEBUG.dump() // will list all <?php dumpToConsole(...) ?> variables
```
