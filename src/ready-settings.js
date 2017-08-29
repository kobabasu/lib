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
    new DetectViewport({
      'name': 'sp',
      'viewport': '(max-width: 767px)'
    });
    new DetectViewport({
      'name': '5k',
      'viewport': '(min-width: 1280px)'
    });
    new InnerLink();
    this.inview = new InView();
    this.scrollit = new ScrollIt();
    this.scrollit.init();
    this.scrolltop = new ScrollTop();
    new SlideMenu();
    /* new HumbergerMenu(); */
    this.slideshow = new SlideShow();
    this.slideshow.start();
    new RippleEffect();
    this.updateCopyright = new UpdateCopyright();
    this.updateCopyright.init();
  },

  'scroll': function() {
    this.imagesrcset.lazyload();
    this.scrollit.animate();
    this.scrolltop.animate();
    this.inview.animate();
  },

  'resize': function() {
    this.scrolltop.animate();
  }
});

ready.init();
