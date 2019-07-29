#!/bin/bash
#
# lib.js, ready.jsをソースからconcatし生成
#


# ソースファイルのディレクトリ 
readonly SRC="./src"
# modulesへのパス
readonly MODULES="./src/modules"
# 設定ファイルのあるディレクトリ 
readonly SETTINGS="../javascript"
# 出力するディレクトリ
readonly DIST="../js"


#
# modulesをlib.jsにconcat
#
{
  cat $SETTINGS/enable.json |
  sed -n 's/.*"\([A-Za-z]*\.js\)".*/\1/p' |
  xargs -I{} cat $MODULES/{}
} >$DIST/lib.js

#
# ready-setting.jsをready.jsにconcat
#
{
  cat $SRC/ready.js $SETTINGS/ready-settings.js
} >$DIST/ready.js
