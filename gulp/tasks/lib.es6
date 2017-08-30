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
      cp ${dir.src + 'ready.js'} ${dir.root + '../js/ready.js'};
      uglifyjs ${dir.src + 'ready.js'} -o ${dir.root + '../js/ready.min.js'};
      cp ${dir.src + 'ready-settings.js'} ${dir.root + '../js/ready-settings.js'};
    `]));


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
     * mocha
     */
    gulp.task(prefix + 'lib:mocha', gulp.series(
        prefix + 'lib:nodejs',
        prefix + 'lib:phantomjs'
    ));


    /*
     * mocha:report
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
        prefix + 'lib',
        prefix + 'lib:min',
        prefix + 'lib:copy'
    ));
  }
};

module.exports = new Lib();
