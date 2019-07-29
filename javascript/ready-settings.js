/**
 * ready-setting.js
 * @file ready.jsの設定
 */

var ready = new Ready({
  'preload': {
    'img': ['imgs/clear.png']
  },

  'interactive': function() {
  },

  'complete': function() {
    this.imagesrcset = new ImageSrcset();
    this.viewportSp = new DetectViewport({
      'name': 'sp',
      'viewport': '(max-width: 767px)'
    });
    this.viewportSp.init();
    this.viewport5k = new DetectViewport({
      'name': '5k',
      'viewport': '(min-width: 1280px)'
    });
    this.viewport5k.init();
    this.scrolltop = new ScrollTop();
    this.scrolltop.init();
    this.toggle = new Toggle();
    this.toggle.init();
    this.updateCopyright = new UpdateCopyright();
    this.updateCopyright.init();

    /* new HumbergerMenu(); */
    /* new InnerLink(); */
    /* this.inview = new InView(); */
    /* new RippleEffect(); */
    /* this.scrollit = new ScrollIt(); */
    /* this.scrollit.init(); */
    /* new SlideMenu(); */
    /* this.slideshow = new SlideShow(); */
    /* this.slideshow.start(); */
  },

  'scroll': function() {
    this.imagesrcset.lazyload();
    this.scrolltop.animate();

    /* this.inview.animate(); */
    /* this.scrollit.animate(); */
  },

  'resize': function() {
    this.scrolltop.animate();
  }
});

ready.init();
