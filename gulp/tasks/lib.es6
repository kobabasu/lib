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
      xargs -I {} cat ${dir.modules}/{} > ${dir.dist + '/lib.js'}
    `]));


    /*
     * min
     */
    gulp.task(prefix + 'lib:min', shell.task([`
      hjson -j ${dir.content + '/lib.hjson'} | \
      jq -c '.[]' | \
      xargs -I {} uglifyjs ${dir.modules}/{} -c -o ${dir.dist + '/lib.min.js'}
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
          [
            dir.src + '/**/*.*',
          ],
          gulp.series(
            prefix + 'lib',
            prefix + 'lib:min',
          )
        )
        .on('error', err => process.exit(1));
    });


    /*
     * copy
     */
    gulp.task(prefix + 'lib:copy', gulp.series(
      shell.task([`
        if [ ! -d ${dir.content + '/lib.hjson'} ]; then
          mkdir -p ${dir.content};
          cp -r ${dir.root + '/javascript/*'} ${dir.content}/;
        fi

        if [ ! -f ${dir.dist + '/ready.js'} ]; then
          mkdir -p ${dir.dist};
          cp -n ${dir.src + '/ready.js'} ${dir.dist + '/ready.js'};
          uglifyjs ${dir.src + '/ready.js'} -o ${dir.dist + '/ready.min.js'};
        fi
      `]),
      prefix + 'lib',
      prefix + 'lib:min'
    ));


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
