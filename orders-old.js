// show shortcut & address suggestions
$(document).ready(() => {
    const addressInput = $("#address_input");
    let shortcutSuggestions = $(".shortcut-suggestions");

    addressInput.on("focus", () => {
        if (addressInput.val().trim() === "") {
            shortcutSuggestions.css("display", "block");
            setTimeout(() => {
                shortcutSuggestions.addClass("active");
            }, 1);
        }

        else { }
    });

    addressInput.on("input", () => {
        if (addressInput.val().trim() === "") {
            shortcutSuggestions.css("display", "block");
            setTimeout(() => {
                shortcutSuggestions.addClass("active");
            }, 0);
        }

        else {
            shortcutSuggestions.css("display", "none");
        }
    });

    addressInput.on("focusout", () => {
        setTimeout(() => {
            shortcutSuggestions.removeClass("active");
            setTimeout(() => {
                shortcutSuggestions.css("display", "none");
            }, 150);
        }, 100);
    });
});
</script >

    <script>
/* Animate toast notification */
        function showDispatchNotification() {
            document.getElementById("dispatch-notification").style.transitionTimingFunction = "cubic-bezier(.42,0,.58,1.19)";
  setTimeout(() => {document.getElementById("dispatch-notification").style.transitionDuration = "255ms";
  document.getElementById("dispatch-notification").style.bottom = "25px"; }, 0);
	setTimeout(() => {document.getElementById("dispatch-notification").style.transitionDuration = "250ms";
  document.getElementById("dispatch-notification").style.bottom = "-70px"; }, 3500); 
}

        /* Animate slide in order popup */
        function openAddOrderPopup() {
            document.getElementById("add-order-popup").style.right = "0%";
        document.getElementById("overlay").style.transitionTimingFunction = "ease";
        document.getElementById("overlay").style.transitionDuration = "0ms";
        document.getElementById("overlay").style.zIndex = "1000";
	setTimeout(() => {document.getElementById("overlay").style.transitionDuration = "250ms";
  document.getElementById("overlay").style.opacity = "100%"; }, 10); /* Delay opacity to give zindex time to change from -1 - 1000 wwhile opacity is still at 0*/
}
        function closeAddOrderPopup() {
            document.getElementById("add-order-popup").style.right = "-455px";
        document.getElementById("overlay").style.opacity = "0%";
	setTimeout(() => {document.getElementById("overlay").style.zIndex = "-1"; }, 10); /* Delay zIndex so opacity changes to 0 before zindex is set to -1 */
}

        /* Animate slide in order popup */
        function openSidePopup() {
            document.getElementById("order-overview-popup").style.right = "0%";
        document.getElementById("overlay").style.transitionTimingFunction = "ease";
        document.getElementById("overlay").style.transitionDuration = "0ms";
        document.getElementById("overlay").style.zIndex = "1000";
	setTimeout(() => {document.getElementById("overlay").style.transitionDuration = "250ms";
  document.getElementById("overlay").style.opacity = "100%"; }, 10); /* Delay opacity to give zindex time to change from -1 - 1000 wwhile opacity is still at 0*/
}
        function closeSidePopup() {
            document.getElementById("order-overview-popup").style.right = "-455px";
        document.getElementById("overlay").style.opacity = "0%";
	setTimeout(() => {document.getElementById("overlay").style.zIndex = "-1"; }, 10); /* Delay zIndex so opacity changes to 0 before zindex is set to -1 */
}

        /* Animate slide in import popup */
        function openImportPopup() {
            document.getElementById("import-popup").style.right = "0%";
        document.getElementById("overlay").style.transitionTimingFunction = "ease";
        document.getElementById("overlay").style.transitionDuration = "0ms";
        document.getElementById("overlay").style.zIndex = "1000";
	setTimeout(() => {document.getElementById("overlay").style.transitionDuration = "250ms";
  document.getElementById("overlay").style.opacity = "100%"; }, 10); /* Delay opacity to give zindex time to change from -1 - 1000 wwhile opacity is still at 0*/
}
        function closeImportPopup() {
            document.getElementById("import-popup").style.right = "-455px";
        document.getElementById("overlay").style.opacity = "0%";
	setTimeout(() => {document.getElementById("overlay").style.zIndex = "-1"; }, 10); /* Delay zIndex so opacity changes to 0 before zindex is set to -1 */
}

        /* Side menu animation JS */
        function openSideMenu() {
            document.getElementById("side-menu").style.left = "0%";
        document.getElementById("overlay").style.transitionTimingFunction = "ease";
        document.getElementById("overlay").style.transitionDuration = "0ms";
        document.getElementById("overlay").style.zIndex = "1000";
	setTimeout(() => {document.getElementById("overlay").style.transitionDuration = "250ms";
  document.getElementById("overlay").style.opacity = "100%"; }, 10); /* Delay opacity to give zindex time to change from -1 - 1000 wwhile opacity is still at 0*/
}
        function closeSideMenu() {
            document.getElementById("side-menu").style.left = "-370px";
        document.getElementById("overlay").style.opacity = "0%";
	setTimeout(() => {document.getElementById("overlay").style.zIndex = "-1"; }, 10); /* Delay zIndex so opacity changes to 0 before zindex is set to -1 */
}