(function (w) {
  // ml debug functions
  const d = w._ml_debug || [];
  w.ML_DEBUG = {
    report(section, keyword) {
      // report on section, when keyword exists, show only things related to keyword
      if (!d[section]) return;
      for (let index in d[section]) {
        // if keyword exists, show only those with the keyword...
        let tmp = Object.create(d[section][index]);
        tmp.map(function (tmpItem) {
          let val = tmpItem;
          // force array to make it easier
          if (!Array.isArray(val)) {
            val = [val];
          }
          if (keyword) {
            let valSelected = [];
            // search
            val.map(function (item) {
              try {
                if (index.indexOf(keyword) >= 0) {
                  valSelected.push(item);
                }
                if (item.indexOf(keyword) >= 0) {
                  valSelected.push(item);
                }
              } catch (e) {
              }
            });
            val = valSelected;
          }

          if (val.length > 0) {
            console.group(index);
            val.map(function (item) {
              console.log(item);
            });
            console.groupEnd();
          }
        });
      }
    },
    summary(name) {
      this.report('summary', name);
    },
    file(name) {
      this.report('files', name);
    },
    template(name) {
      if (!name) name = 'tpl.';
      this.report('files', name);
    },
    benchmark(key) {
      // can't use normal report, as benchmark stores objects
      var b = d.benchmark;
      if (!b) return;

      // now find each bench
      for (let index in b) {
        if (key) {
          if (index.indexOf(key) < 0) {
            continue;
          }
        }
        let val = b[index];
        console.group(index);
        val.map(function (item) {
          console.log(`${item.context} is processed in ${item.time} ms, \nsrc: ${item.trace}`);
        });
        console.groupEnd();
      }
    },
    dump() {
      this.report('dump');
    }
  };
})(this);
