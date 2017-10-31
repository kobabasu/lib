'use strict';

import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';
import shell from '/usr/local/lib/node_modules/gulp-shell';

import { dir } from '../dir.es6';

class Lib extends DefaultRegistry {

  init() {
    // task名の接頭辞を設定
    const prefix = (dir.name == '') ? '' : dir.name + ':';

    /*
     * lib
     */
    gulp.task(prefix + 'lib', shell.task([`
      hjson -j ${dir.content + '/lib.hjson'} | \
      jq -c '.[]' | \
      xargs cat > ${dir.content + '/lib.js'}
    `]));


    /*
     * min
     */
    gulp.task(prefix + 'lib:min', shell.task([`
      hjson -j ${dir.content + '/lib.hjson'} | \
      jq -c '.[]' | \
      xargs uglifyjs -c -o ${dir.root + '/lib.min.js'}
    `]));


    /*
     * mocha
     */
    gulp.task(prefix + 'lib:mocha', shell.task([`
      mocha ${dir.test}/*.js \
      --require babel-register \
      -g '^(?!EXCLUDE)' \
      --timeout 10000
    `]));


    /*
     * mocha:report
     */
    gulp.task(prefix + 'lib:mocha:report', shell.task([`
      mocha ${dir.test}/*.js \
      --require babel-register \
      --reporter mocha-junit-reporter \
      --reporter-options mochaFile=${dir.report} \
      -g '^(?!EXCLUDE)' \
      --timeout 10000
    `]));


    /*
     * mocha:cover
     */
    gulp.task(prefix + 'lib:mocha:cover', shell.task([`
      nyc \
      --cache false \
      --reporter=lcov \
      --reporter=text \
      --reporter=cobertura \
      mocha ${dir.test}/*.js \
      --require babel-register \
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
     * copy
     */
    gulp.task(prefix + 'lib:copy', shell.task([`
      echo ${dir.content};
      mkdir -p ${dir.content};
      if [ ! -f ${dir.content + '/ready.js'} ]; then
        cp -n ${dir.src + '/ready.js'} ${dir.content + '/ready.js'};
      fi
      if [ ! -f ${dir.content + '/ready-settings.js'} ]; then
        cp -n ${dir.src + '/ready-settings.js'} ${dir.content + '/ready-settings.js'};
      fi
      if [ ! -f ${dir.content + '/ready.min.js'} ]; then
        uglifyjs ${dir.src + '/ready.js'} -o ${dir.content + '/ready.min.js'};
      fi
      if [ ! -f ${dir.content + '/lib.hjson'} ]; then
        printf "\n";
        printf "specify the paths in lib.hjson. (from the same directory as node_modules)";
        printf "\n\n";
        cp -n ${dir.src + '/lib.hjson.sample'} ${dir.content + '/lib.hjson'};
      fi
    `]));


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
