// add fleet driver center modal
$("#fleet_btn").on("click", () => {
    $("#fleet_modal_container").css("display", "flex");
    setTimeout(function () {
        $("#fleet_modal_container").addClass("center-modal-container-active");
        $("#fleet_center_modal").addClass("center-modal-active");
    }, 1);
});