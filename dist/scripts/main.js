(function(){this.Application=function(){function i(){var i;this.options={animations:{fixedOnTop:{selector:".fixed-on-top"},fadeIn:{selector:".fade-in-on-load",wait:1200,speed:1700},inView:{selector:".animate-if-in-view",speed:830,wait:1200,offsetTop:100,css:{opacity:0,position:"relative",top:"100px"}}}},i=this.options.animations,this.animationFixedOnTop=new AnimationFixedOnTop(i.fixedOnTop),this.animationInView=new AnimationInView(i.inView),this.animationFadeIn=new AnimationFadeIn(i.fadeIn),this.fancybox=new Fancybox,this.tooltips=new Tooltips(".tooltip")}return i}(),function(i){return Raven.context(function(){return window.application=new Application})}(jQuery)}).call(this);