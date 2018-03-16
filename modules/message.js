var error = ( function(){

  var element = document.getElementById("error");
  let elementText = document.getElementById("errorMessage");

  function publicShow(text) {
    element.classList.add("visible");
    elementText.innerHTML = text;
  }

  function publicHide() {
    element.classList.remove("visible");
  }

  function publicButtonHide(e) {
    e.parentNode.classList.remove("visible");
  }

  return{
    show: publicShow,
    hide: publicHide,
    buttonHideError: publicButtonHide
  }

})();



var loadingScreen = ( function(){

  let element = document.getElementById("loadingScreen");

  function publicShow(text) {
    element.classList.add("visible");
  }

  function publicHide() {
    element.classList.remove("visible");
  }

  return {
    show: publicShow,
    hide: publicHide
  }
})();
