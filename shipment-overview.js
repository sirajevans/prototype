// remove loader on page load
$(window).on("load", () => {
  setTimeout((() => {
    $("#s_page").fadeOut(100, () => {
      $("#s_page").remove();
    });
  }), 800);
});

// set timeline card dynamic height
$(document).ready(() => {
  let cardHeightCalc = document.querySelector("#left_col_height").offsetHeight;
  let cardFooterHeight = document.querySelector("#timeline_footer").offsetHeight;
	$("#timeline_card").height(cardHeightCalc);
  $("#timeline_body").height(`calc(100% - ${cardFooterHeight}px)`);
});

// key shortcuts
$(document).keydown(function(e) {
  if ($(":input").is(":focus")) { 
    return; //abort key shortcuts 
  } else if (e.key && e.key.toLowerCase() == "p") {
    window.open("https://shippit-production.s3.amazonaws.com/uploads/label/attachment/5044/PPKFqy44U8Nff.pdf", "_blank");
  } else if (e.key && e.key.toLowerCase() == "r") {
    $("#s_card").css("display", "flex");
    setTimeout(() => {
      $("#s_card").fadeOut(100);
    }, 800);
  } else if (e.key && e.key.toLowerCase() == "t") {
    $("#tracking_modal_container").css("display", "flex");
    setTimeout(() => {
    $("#tracking_modal_container").addClass("center-modal-container-active");
    $("#tracking_center_modal").addClass("center-modal-active");
    }, 1);
  }
});

// print labels btn
$("#print_labels_btn").on("click", () => {
  window.open("https://shippit-production.s3.amazonaws.com/uploads/label/attachment/5044/PPKFqy44U8Nff.pdf", "_blank");
});


// show timeline loader
$("#card_refresh").on("click", () => {
  $("#s_card").css("display", "flex");
  setTimeout(() => {
    $("#s_card").fadeOut(100);
  }, 800);
});

// trigger edit modal
$("#edit_shipment_btn").on("click", () => {
  $("#edit_modal_container").css("display", "flex");
  $(".center-modal-body").scrollTop(0);
  $("#s_modal").css("display", "flex");
  setTimeout(() => {
    $("#edit_modal_container").addClass("center-modal-container-active");
    $("#edit_center_modal").addClass("center-modal-active");
  }, 1);
  setTimeout(() => {
    $("#s_modal").fadeOut(100);
  }, 800);
});

// trigger contact carrier modal
$("#contact_carrier_btn, #contact_carrier_btn_1").on("click", () => {
  if ($("#edit_modal_container").css("display") == "flex") {
    $("#edit_modal_container").removeClass("center-modal-container-active");
    $("#edit_center_modal").removeClass("center-modal-active");
    setTimeout(() => {
      $("#edit_modal_container").css("display", "none");
    }, 120);
  }
  $("#contact_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#contact_modal_container").addClass("center-modal-container-active");
    $("#contact_center_modal").addClass("center-modal-active");
  }, 1);
});

// trigger cancel shipment modal
$("#cancel_shipment_btn").on("click", () => {
  $("#cancel_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#cancel_modal_container").addClass("center-modal-container-active");
    $("#cancel_center_modal").addClass("center-modal-active");
  }, 1);
});

// carrier shipment location modal
$("#track_drivers_location").on("click", () => {
  $("#track_driver_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#track_driver_modal_container").addClass("center-modal-container-active");
    $("#track_driver_center_modal").addClass("center-modal-active");
  }, 1);
});

// trigger parcels modal
$("#view_all_parcels").on("click", () => {
  $("#parcels_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#parcels_modal_container").addClass("center-modal-container-active");
    $("#parcels_center_modal").addClass("center-modal-active");
  }, 1);
});

// trigger tracking links modal
$("#view_tracking_links").on("click", () => {
  $("#tracking_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#tracking_modal_container").addClass("center-modal-container-active");
    $("#tracking_center_modal").addClass("center-modal-active");
  }, 1);
});


// hide all modals
$(".close-modal-btn, .center-modal-container").on("click", function(e) {
  if (e.target == this) {
    $(".center-modal-container").removeClass("center-modal-container-active");
    $(".center-modal").removeClass("center-modal-active");
    setTimeout(() => {
      $(".center-modal-container").css("display", "none");
    }, 120);
  }
});

// context menus
$(document).ready(() => {
  $(".context-menu-btn").on("click", function(e) {
    if (e.target.closest(".context-menu-btn")) {
      if ($(this).next(".context-menu-modal").hasClass("active")) {
        $(this).next(".context-menu-modal").removeClass("active");
        setTimeout(() => {
          $(this).next(".context-menu-modal").css("display", "none");
        }, 150);
      } else {
        $(".context-menu-modal").removeClass("active");
        $(this).next(".context-menu-modal").css("display", "block");
        setTimeout(() => {
          $(this).next(".context-menu-modal").addClass("active");
        }, 1);
      };
    }
  });
  $(document).on("click", function(e) {
    if (!e.target.closest(".context-menu-btn")) {
      $(".context-menu-modal").removeClass("active");
      setTimeout(() => {
        $(".context-menu-modal").css("display", "none");
      }, 150);
    }
  });
});

// trigger pod error modal
$("#view_pod_btn").on("click", () => {
    $("#pod_error_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#pod_error_modal_container").addClass("center-modal-container-active");
        $("#pod_error_center_modal").addClass("center-modal-active");
    }, 1);
});

// btn loader
$("#view_pod_btn").on("click", (e) => {
    if (e.target !== this) {
        $("#view_pod_btn").addClass("btn-g-loading");
        $("#view_pod_loader").addClass("btn-g-loader-active");
    }
});

// card sticky header shadow
$("#timeline_body").scroll(function () {
  var scroll = $(this).scrollTop();
  $(".card-sticky-header").toggleClass("card-sticky-header-active", scroll > 0);
});

// copy tracking link
$("#copy_receiver_tracking").click(function() {
// Select the text inside the element with id "receiver_tracking_link"
var textToCopy = $("#receiver_tracking_link").text();

// Create a temporary input element and set its value to the text to copy
var tempInput = $("<input>");
$("body").append(tempInput);
tempInput.val(textToCopy).select();

// Copy the selected text to the clipboard
document.execCommand("copy");

// Remove the temporary input element
tempInput.remove();
