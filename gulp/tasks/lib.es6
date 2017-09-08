'use strict';

import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';
import shell from '/usr/local/lib/node_modules/gulp-shell';

import { dir } from '../dir.es6';

class Lib extends DefaultRegistry {

  init() {
    // task名の接頭辞を設定
    let prefix = (dir.name == '') ? '' : dir.name + ':';

    /*
     * lib
     */
    gulp.task(prefix + 'lib', shell.task([`
      hjson -j ${dir.setting + 'lib.hjson'} | jq -c '.[]' | xargs cat > ${dir.root + '../js/lib.js'}
    `]));


    /*
     * min
     */
    gulp.task(prefix + 'lib:min', shell.task([`
      hjson -j ${dir.setting + 'lib.hjson'} | jq -c '.[]' | xargs uglifyjs -c -o ${dir.root + '../js/lib.min.js'}
    `]));


    /*
     * copy
     */
    gulp.task(prefix + 'lib:copy', shell.task([`
      cp -n ${dir.src + 'lib.hjson.sample'} ${dir.root + '../js/lib.hjson'};
      cp -n ${dir.src + 'ready.js'} ${dir.root + '../js/ready.js'};
      cp -n ${dir.src + 'ready-settings.js'} ${dir.root + '../js/ready-settings.js'};
      uglifyjs ${dir.src + 'ready.js'} -o ${dir.root + '../js/ready.min.js'};
    `]));


    /*
     * nodejs
     */
    gulp.task(prefix + 'lib:mocha', shell.task([`
      mocha ${dir.test}*.js \
      -g '^(?!DOM)'
    `]));


    /*
     * nodejs:report
     */
    gulp.task(prefix + 'lib:mocha:report', shell.task([`
      mocha ${dir.test}*.js \
      --reporter mocha-junit-reporter \
      --reporter-options mochaFile=${dir.report} \
      -g '^(?!DOM)'
    `]));


    /*
     * watch
     */
    gulp.task(prefix + 'lib:watch', () => {
      gulp
        .watch(
          [lib.src, lib.modules, lib.test],
          gulp.series(prefix + 'lib:mocha')
        )
        .on('error', err => process.exit(1));
    });


    /*
     * build
     */
    gulp.task(prefix + 'lib:build', gulp.series(
        prefix + 'lib:mocha:report',
        prefix + 'lib:copy',
        prefix + 'lib',
        prefix + 'lib:min'
    ));
  }
};

module.exports = new Lib();
