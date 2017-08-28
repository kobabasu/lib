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
     * nodejs
     */
    gulp.task(prefix + 'lib:nodejs', shell.task([`
      mocha ${dir.test}*.js \
      -g '^(?!DOM)'
    `]));


    /*
     * example:phantomjs
     */
    gulp.task(prefix + 'lib:phantomjs', shell.task([`
      for f in \`ls ${dir.test}*.html\`
      do
        phantomjs ${dir.node_module_path}node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js $f
      done
    `]));


    /*
     * nodejs:report
     */
    gulp.task(prefix + 'lib:nodejs:report', shell.task([`
      mocha ${dir.test}*.js \
      --reporter mocha-junit-reporter \
      --reporter-options mochaFile=${dir.report.nodejs} \
      -g '^(?!DOM)'
    `]));


    /*
     * phantomjs:report 
     */
    gulp.task(prefix + 'lib:phantomjs:report', shell.task([`
      if [ -f "${dir.report.phantomjs}" ]; then
        rm ${dir.report.phantomjs};
      fi
      for f in \`ls ${dir.test}*.html\`
      do
        phantomjs ${dir.node_module_path}node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js $f xunit >> ${dir.report.phantomjs}
      done
    `]));


    /*
     * example:mocha
     */
    gulp.task(prefix + 'lib:mocha', gulp.series(
        prefix + 'lib:nodejs',
        prefix + 'lib:phantomjs'
    ));


    /*
     *  example:mocha:report
     */
    gulp.task(prefix + 'lib:mocha:report', gulp.series(
        prefix + 'lib:nodejs:report',
        prefix + 'lib:phantomjs:report'
    ));


    /*
     * watch
     */
    gulp.task(prefix + 'lib:watch', () => {
      gulp
        .watch(
          [lib.src],
          gulp.series(prefix + 'lib:mocha')
        )
        .on('error', err => process.exit(1));
    });
  }
};

module.exports = new Lib();
