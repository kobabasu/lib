/*
 * -----------
 * settings
 * -----------
 */
var ready = new Ready({
  'preload': {
    'img': ['imgs/clear.png']
  },

  'interactive': function() {
  },

  'complete': function() {
    new DetectViewport({'name': 'sp', 'viewport': '(max-width: 767px)'});
    new DetectViewport({'name': '5k', 'viewport': '(min-width: 1280px)'});
    new InnerLink();
    new SlideMenu();
    /* new HumbergerMenu(); */

    new RippleEffect();
    this.updateCopyright = new UpdateCopyright({'prefix': '2013-'});
    this.updateCopyright.init();

    this.imagesrcset = new ImageSrcset();
    this.scrolltop = new ScrollTop();
    this.scrollit = new ScrollIt();
    this.scrollit.init();
    this.inview = new InView();

    this.slideshow = new SlideShow();
    this.slideshow.start();
  },

  'scroll': function() {
    this.imagesrcset.lazyload();
    this.scrolltop.animate();
    this.inview.animate();
    this.scrollit.animate();
  },

  'resize': function() {
    this.scrolltop.animate();
  }
});

ready.init();


// vim: foldmethod=marker:ts=2:sts=0:sw=2
