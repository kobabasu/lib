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
      mkdir -p ${dir.root + '../js'};
      if [ ! -d ${dir.root + '../js/lib.hjson'} ]; then cp -n ${dir.src + 'lib.hjson.sample'} ${dir.root + '../js/lib.hjson'}; fi
      if [ ! -d ${dir.root + '../js/ready.js'} ]; then cp -n ${dir.src + 'ready.js'} ${dir.root + '../js/ready.js'}; fi
      if [ ! -d ${dir.root + '../js/ready-settings.js'} ]; then cp -n ${dir.src + 'ready-settings.js'} ${dir.root + '../js/ready-settings.js'}; fi
      if [ ! -d ${dir.root + '../js/ready.min.js'} ]; then uglifyjs ${dir.src + 'ready.js'} -o ${dir.root + '../js/ready.min.js'}; fi
    `]));


    /*
     * mocha
     */
    gulp.task(prefix + 'lib:mocha', shell.task([`
      mocha ${dir.test}*.js \
      --require babel-register \
      -g '^(?!EXCLUDE)' \
      --timeout 10000
    `]));


    /*
     * mocha:cover
     */
    gulp.task(prefix + 'lib:mocha:cover', shell.task([`
      nyc \
      --reporter=lcov \
      --reporter=text \
      --reporter=cobertura \
      mocha ${dir.test}*.js \
      --require babel-register \
      -g '^(?!EXCLUDE)' \
      --timeout 10000
    `]));


    /*
     * mocha:report
     */
    gulp.task(prefix + 'lib:mocha:report', shell.task([`
      mocha ${dir.test}*.js \
      --require babel-register \
      --reporter mocha-junit-reporter \
      --reporter-options mochaFile=${dir.report} \
      -g '^(?!EXCLUDE)' \
      --timeout 10000
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
        prefix + 'lib:copy',
        prefix + 'lib:mocha:report',
        prefix + 'lib:mocha:cover',
        prefix + 'lib',
        prefix + 'lib:min'
    ));
  }
};

module.exports = new Lib();
