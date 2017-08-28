# micro-lib
postcssを利用するためnodejs環境とpostcss-cliのインストールが必要

```
git add submodule git@github.com-kobabasu:kobabasu/micro-postcss.git postcss 
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
1. jqueryやfontawesomeやmaterial-designなどいらないものを削除
1. `cp bower.json.sample bower.json`
1. `bower install`

## gulp
1. 単独で動かす場合はgulpfile.babel.js.sampleをgulpfile.babel.jsにリネーム
1. projectに追加する場合はすでにあるgulpfile.babel.jsを編集
1. cp gulp/dir.es6.sample gulp/dir.es6
1. dir.es6を編集。  
   rootは`package.json`からみたmicro-postcssレポジトリのディレクトリを指定  
   `node_modules`は`package.json`からみた`node_modules/`の場所を指定。ほとんどの場合`./`
1. gulp postcss:example:reportで正常に動作するか試す
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
1. `docker build -t kobabasu/phantomjs:0.28` /home/core/share`
1. `docker login`
1. `docker push kobabasu/phantomjs:0.28`
1. docker-composeをインストール
1. `docker-compose up`
1. `docker-compose start`
1. `docker exec phantomjs gulp mocha:report`や`vagrant ssh -c 'docker exec phantomjs gulp mocha:report'`で確認
1. 問題なければ`.circleci/config.yml`のimagesのバージョンを変更
1. git pushで確認

## check
1. ブラウザで確認
   `gulp <dir.es6で設定した名前>:postcss:build`
   作成されたhtmlが動作するか確認

## guide
1. ブラウザで確認
   `gulp <dir.es6で設定した名前>:postcss:example`
   /example/index.htmlが動作するか確認

## todo
- [ ] postcss-cli v3 がでたらcompressがswitchできるかどうか試す
- [ ] postcss-cli v3 がでたらnextcssrcの読み込みを試す
- [ ] bower packageの読み込み方
- [ ] postcss.jsonのmapのinline:false化
- [ ] styleguideをどうするか(候補sc5, postcss-style-guide)
