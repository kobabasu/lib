FROM ubuntu:latest
MAINTAINER Keiji Kobayashi <keiji.kobayashi.web@gmail.com>

RUN apt-get update && apt-get install -y curl git nodejs npm fontconfig && \
    npm cache clean && npm install -g n && n stable && \
    ln -s /usr/local/bin/node /usr/bin/node && \
    npm install -g pm2 phantomjs-prebuilt bower && \
    npm install -g 'github:gulpjs/gulp.git#4.0' gulp-shell gulp-cli && \
    npm install -g mocha mocha-junit-reporter && \
    rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    mkdir /app

CMD ["pm2", "--no-daemon"]
