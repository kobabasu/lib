#!/bin/bash
#
# enable.jsonに書かれたmodulesのリストをlib.jsにconcatする
#


# modulesへのパス
readonly MODULES="./src/modules"
# lib.jsに含めるmodulesリストのファイル
readonly LIST="../javascript/enable.json"
# 出力するファイル
readonly DIST="../js/lib.js"


{
  cat $LIST |
  sed -n 's/.*"\([A-Za-z]*\.js\)".*/\1/p' |
  xargs -I{} cat $MODULES/{}
} >$DIST
