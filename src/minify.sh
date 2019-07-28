#!/bin/bash
#
# 対象ディレクトリ内のmin.js以外のファイルをminifyする
#


# 対象ディレクトリ
readonly TARGET="../js"


find $TARGET -type f -a ! -name '*.min.js' -exec basename {} .js \; |
xargs -I{} uglifyjs $TARGET/{}.js -c -o $TARGET/{}.min.js
