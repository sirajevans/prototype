/* Side menu */
function openSideMenu() {
    document.getElementById("side-menu").style.left = "0%";
    document.getElementById("overlay").style.transitionTimingFunction = "ease";
    document.getElementById("overlay").style.transitionDuration = "0ms";
    document.getElementById("overlay").style.zIndex = "1000";
      setTimeout(() => {  document.getElementById("overlay").style.transitionDuration = "250ms";
    document.getElementById("overlay").style.opacity = "100%"; }, 10); /* Delay opacity to give zindex time to change from -1 - 1000 wwhile opacity is still at 0*/
  }
  function closeSideMenu() {
    document.getElementById("side-menu").style.left = "-370px";
    document.getElementById("overlay").style.opacity = "0%";
      setTimeout(() => {  document.getElementById("overlay").style.zIndex = "-1"; }, 10); /* Delay zIndex so opacity changes to 0 before zindex is set to -1 */
  }

/* Add shortcut */
$("#add_shortcut_btn").on("click", function () {
    $("#shortcut_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#shortcut_modal_container").addClass("center-modal-container-active");
        $("#shortcut_center_modal").addClass("center-modal-active");
    }, 1);
  });