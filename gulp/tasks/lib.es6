'use strict';

import gulp from 'gulp';
import DefaultRegistry from 'undertaker-registry';
import shell from '/usr/local/lib/node_modules/gulp-shell';

import { dir } from '../dir.es6';

class Postcss extends DefaultRegistry {

  init() {
    // task名の接頭辞を設定
    let prefix = (dir.name == '') ? '' : dir.name + ':';

    /*
     * postcss
     */
    const style = {
      src:     dir.src  + 'style.css',
      dist:    dir.dist + 'style.css',
      watch:   dir.src  + '**/*.*'
    };

    gulp.task(prefix + 'postcss', shell.task([`
      postcss ${style.src} \
      -m \
      -o ${style.dist};

      postcss ${dir.pages + '**/*.css'} \
      -m \
      -c ${dir.root + 'postcss.config.js'} \
      -d ${dir.dist};
    `]));


    /*
     * example
     */
    const example = {
      dist:  dir.example.css.dist
    };

    gulp.task(prefix + 'postcss:example', shell.task([`
      postcss ${style.src} \
      -m \
      -o ${dir.example.css.dist + 'style.css'};

      postcss ${dir.pages + '**/*.css'} \
      -m \
      -c ${dir.root + 'postcss.config.js'} \
      -d ${dir.example.css.dist};
    `]));


    /*
     * example:nodejs
     */
    gulp.task(prefix + 'postcss:example:nodejs', shell.task([`
      mocha ${dir.example.js.test}*.js \
      -g '^(?!DOM)'
    `]));


    /*
     * example:phantomjs
     */
    gulp.task(prefix + 'postcss:example:phantomjs', shell.task([`
      for f in \`ls ${dir.example.js.test}*.html\`
      do
        phantomjs ${dir.node_module_path}node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js $f
      done
    `]));


    /*
     * nodejs:report
     */
    gulp.task(prefix + 'postcss:example:nodejs:report', shell.task([`
      mocha ${dir.example.js.test}*.js \
      --reporter mocha-junit-reporter \
      --reporter-options mochaFile=${dir.example.js.report.nodejs} \
      -g '^(?!DOM)'
    `]));


    /*
     * phantomjs:report 
     */
    gulp.task(prefix + 'postcss:example:phantomjs:report', shell.task([`
      if [ -f "${dir.example.js.report.phantomjs}" ]; then
        rm ${dir.example.js.report.phantomjs};
      fi
      for f in \`ls ${dir.example.js.test}*.html\`
      do
        phantomjs ${dir.node_module_path}node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js $f xunit >> ${dir.example.js.report.phantomjs}
      done
    `]));


    /*
     * example:mocha
     */
    gulp.task(prefix + 'postcss:example:mocha', gulp.series(
        prefix + 'postcss:example:nodejs',
        prefix + 'postcss:example:phantomjs'
    ));


    /*
     *  example:mocha:report
     */
    gulp.task(prefix + 'postcss:example:mocha:report', gulp.series(
        prefix + 'postcss:example:nodejs:report',
        prefix + 'postcss:example:phantomjs:report'
    ));


    /*
     * watch
     */
    gulp.task(prefix + 'postcss:watch', () => {
      gulp
        .watch(
          [style.watch],
          gulp.series(prefix + 'postcss')
        )
        .on('error', err => process.exit(1));
    });


    /*
     * build
     */
    gulp.task(prefix + 'postcss:build',
      gulp.series(
        prefix + 'postcss'
        // prefix + 'postcss:docs'
    ));
  }
};

module.exports = new Postcss();
