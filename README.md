[![CircleCI](https://circleci.com/gh/kobabasu/micro-lib.svg?style=shield&circle-token=14c34d44469b7917518845857413cc7156d32fd9)](https://circleci.com/gh/kobabasu/micro-lib)

# micro-lib
es6を利用するためbabelが必要

```
git submodule add git@github.com-kobabasu:kobabasu/micro-lib.git lib
git submodule update
```

## npm
preinstallでひとつ上の階層にjs/, javascript/が作成される
変更はその中で行う
1. 必要があればdevelopブランチを使う  
   `git checkout develop`
1. `npm start`
1. `npm install`

## bower
example用の`test/*.html`で読み込むようにtest専用のライブラリを用意する  
.bowerrcでexample/vendor以下にインストールされるよう設定
1. `cp bower.json.sample bower.json`
1. `bower install`

## gulp
1. 単独で動かす場合はgulpfile.babel.js.sampleをgulpfile.babel.jsにリネーム
1. projectに追加する場合はすでにあるgulpfile.babel.jsを編集
1. cp gulp/dir.es6.sample gulp/dir.es6
1. dir.es6を編集。  
   rootは`package.json`からみたmicro-libレポジトリのディレクトリを指定  
   `node_modules`は`package.json`からみた`node_modules/`の場所を指定。ほとんどの場合`./`
1. gulp lib:mocha:reportで正常に動作するか試す
1. dir.es6のsrcを実際にソースがあるディレクトリに変更

## circleci
1. githubとcircleciとslackを連携させる
1. .cicrleci/config.ymlをプロジェクトルートにコピー
1. config.ymlの`working_directory`を編集
1. プロジェクトのREADME.mdのbadgeを編集
1. git push してみて成功するか確認

## Dockerfile
もしcircleciのコンテナになにか追加する必要があれば、
Dockerfileを編集しbuildしdocker hubにpush

1. `hub clone cores/cores-vagrant coreos`
1. config.rbをコピー
1. config.rbを編集
1. `shared_folder`でレポジトリのルートを共有
1. `docker build -t kobabasu/alpine-chrome:0.xx` /home/core/share`
1. `docker login`
1. `docker push kobabasu/alpine-chrome:0.xx`
1. docker-composeをインストール
1. `docker-compose up`
1. `docker-compose start`
1. `docker exec chrome gulp mocha:report`や`vagrant ssh -c 'docker exec chrome gulp mocha:report'`で確認
1. 問題なければ`.circleci/config.yml`のimagesのバージョンを変更
1. git pushで確認

## gulp tasks
1. `gulp [prefix]:lib`  
   lib.hjsonに記述されたファイルをconcatするのみ
1. `gulp [prefix]:lib:min`  
   lib.hjsonに記述されたファイルをuglifyjsを使い結合、圧縮
1. `gulp [prefix]:lib:mocha`  
   mochaでtestディレクトリ内の`js`拡張子が付いたファイルをtest
1. `gulp [prefix]:lib:mocha:report`  
   mochaでtestディレクトリ内の`js`拡張子が付いたファイルをtestしresults/にレポートを作成
1. `gulp [prefix]:lib:mocha:cover`  
   nyc(istanbul)でcoverageを測定。coverageディレクトリにreportを出力
1. `gulp [prefix]:lib:watch`  
   src/内のファイルが変更されたらlib, lib:minを実行
1. `gulp [prefix]:lib:copy`  
   src/からlib.hjsonを../javascriptに。ready.js, ready-settings.jsコピーし、uglifyjsでready.min.jsを圧縮・生成 (lib.hjson, ready.jsが存在すればコピーしない)
1. `gulp [prefix]:lib:build`  
   lib:copy, lib:mocha:report, lib:mocha:coverをまとめて実行

## build files
gulp lib:buildで一つ上の階層の../js, ../javascriptに以下が生成される

1. lib.hjson (lib.jsに含めるmoduleを設定)
1. ready.js (初期ロード時用ライブラリ)
1. ready.min.js (ready.jsのminify)
1. ready-settings.js (実際に読み込むmodule、順番、設定用)
1. lib.js (使用moduleを単純にconcatしたもの)
1. lib.min.js (lib.jsのminify)

## edit
1. package.json, bower.json, gulp/dir.es6を作成
1. npm installでlib:buildが実行され../js/にコピーされる
1. 生成した../js/lib.hjsonで必要なmoduleを読み込む
1. `lib`, `lib:min`でビルド

## lib repository update
1. libディレクリに移動
1. git pullでアップデート
1. [prefix]:lib:buildする
1. ../jsはディレクトリが存在した場合コピーしないので注意する

## todo
- [ ] testファイル内のaddScriptToEvaluateOnLoadをchromeのstableでaddScriptToEvaluateOnNewDocumentが使用するようになったら変更する
