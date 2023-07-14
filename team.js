/* Add team member */
$("#add_team_btn").on("click", function () {
    $("#team_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#team_modal_container").addClass("center-modal-container-active");
        $("#team_center_modal").addClass("center-modal-active");
    }, 1);
});