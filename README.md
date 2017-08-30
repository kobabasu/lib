[![CircleCI](https://circleci.com/gh/kobabasu/micro-lib.svg?style=shield&circle-token=14c34d44469b7917518845857413cc7156d32fd9)](https://circleci.com/gh/kobabasu/micro-lib)

# micro-lib

```
git add submodule git@github.com-kobabasu:kobabasu/micro-lib.git lib
```

## npm
preinstallでひとつ上の階層にstylesheets/が作成される
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
1. config.rb, user-dataをコピー
1. config.rbを編集
1. `shared_folder`でレポジトリのルートを共有
1. `docker build -t kobabasu/phantomjs:0.27` /home/core/share`
1. `docker login`
1. `docker push kobabasu/phantomjs:0.27`
1. docker-composeをインストール
1. `docker-compose up`
1. `docker-compose start`
1. `docker exec phantomjs gulp mocha:report`や`vagrant ssh -c 'docker exec phantomjs gulp mocha:report'`で確認
1. 問題なければ`.circleci/config.yml`のimagesのバージョンを変更
1. git pushで確認

## gulp tasks
1. `gulp [prefix]:lib`  
   lib.hjsonに記述されたファイルをconcatするのみ
1. `gulp [prefix]:lib:min`  
   lib.hjsonに記述されたファイルをuglifyjsを使い結合、圧縮
1. `gulp [prefix]:lib:copy`  
   src/からlib.hjson, ready.js, ready-settings.jsコピーし、uglifyjsでready.min.jsを圧縮・生成
1. `gulp [prefix]:lib:nodejs`  
   mochaでのDOM操作を伴わないファイルをtest
1. `gulp [prefix]:lib:phantomjs`  
   mocha-phantomjs-coreでDOM操作を伴うファイルをtest
1. `gulp [prefix]:lib:nodejs:report`  
   mochaでのDOM操作を伴わないファイルをtestしresults/にレポートを作成
1. `gulp [prefix]:lib:phantomjs:report`  
   mocha-phantomjs-coreでDOM操作を伴うファイルをtestしresults/にレポートを作成
1. `gulp [prefix]:lib:mocha`  
   lib:nodejs, lib:phantomjsをまとめて実行
1. `gulp [prefix]:lib:mocha:report`  
   lib:nodejs:report, lib:phantomjs:reportをまとめて実行
1. `gulp [prefix]:lib:watch`  
   src/, modules/, test/内のファイルが変更されたらlib:mochaを実行
1. `gulp [prefix]:lib:build`  
   lib:mocha:report, lib:copy, lib, lib:minをまとめて実行

## build files
gulp lib:buildで一つ上の階層のjsに以下が生成される

1. lib.hjson (lib.jsに含めるmoduleを設定)
1. ready.js (初期ロード時用ライブラリ)
1. ready.min.js (ready.jsのminify)
1. ready-settings.js (実際に読み込むmodule、順番、設定用)
1. lib.js (module郡 単純にconcatしたもの)
1. lib.min.js (lib.jsのminify)

## edit
1. package.json, bower.json, gulp/dir.es6を作成
1. npm installでlib:buildが実行され../js/にコピーされる
1. 生成した../js/lib.hjsonで必要なmoduleを読み込む
1. `lib`, `lib:min`でビルド
