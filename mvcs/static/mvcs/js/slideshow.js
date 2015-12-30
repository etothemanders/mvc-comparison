var slideshowApp = slideshowApp || {};

var Slideshow = (function() {
  var images = ["cat1.jpeg", "cat2.jpeg", "cat3.jpeg", "cat4.jpeg"];

  function listenForPrevClicks() {
    $("#previous").click(function() {
      var prevImage = images.pop();
      images.unshift(prevImage);

      var sourceArr = $("img").attr("src").split("/");
      sourceArr.pop();
      sourceArr.push(images[0]);

      $("img").attr("src", sourceArr.join("/"));
      $("img").attr("alt", images[0]);
    });
  }

  function listenForNextClicks() {
    $("#next").click(function() {
      var currentImage = images.shift();
      images.push(currentImage);

      var sourceArr = $("img").attr("src").split("/");
      sourceArr.pop();
      sourceArr.push(images[0]);

      $("img").attr("src", sourceArr.join("/"));
      $("img").attr("alt", images[0]);
    });
  }

  function init() {
    listenForPrevClicks();
    listenForNextClicks();
  }

  return {
    init: init
  };
})();

$(document).ready(function() {
  slideshowApp.slideshow = Slideshow.init();
});
