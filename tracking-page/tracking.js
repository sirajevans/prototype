function activateLiveTrackingButton() {
  $(".live-tracking-toast").addClass("active");
}

// Function to wait for 8 seconds and then show the live tracking button
// $(document).ready(function() {
//   setTimeout(activateLiveTrackingButton, 8000); // 8 seconds (8,000 milliseconds)
// });

// context menus
$(document).ready(function () {
  $(".context-menu-btn").on("click", function (e) {
      const contextMenuModal = $(this).next(".context-menu-modal");

      if (e.target.closest(".context-menu-btn")) {
          if (contextMenuModal.hasClass("active")) {
              contextMenuModal.removeClass("active");
              setTimeout(() => contextMenuModal.css("display", "none"), 150);
          } else {
              $(".context-menu-modal").removeClass("active");
              contextMenuModal.css("display", "block");
              setTimeout(() => contextMenuModal.addClass("active"), 1);
          }
      }
  });

  $(document).on("click", function (e) {
      const contextMenuModal = $(".context-menu-modal");

      if (!e.target.closest(".context-menu-btn")) {
          contextMenuModal.removeClass("active");
          setTimeout(() => contextMenuModal.css("display", "none"), 150);
      }
  });
});

// card sticky header shadow
$(".center-modal-body").scroll(function () {
  var scroll = $(this).scrollTop();
  $(".center-modal-header").toggleClass("center-modal-header-active", scroll > 5);
});

// swiper
var swiper = new Swiper(".swiper-container", {
  pagination: ".swiper-pagination",
  slidesPerView: 1,
  paginationClickable: true,
  loop: false,
  autoHeight: true,
  paginationBulletRender: function (index, className) {
    var tabsName = ["Delivery status", "Shipment details"];
    var tabsIcon = ["delivery-status-icon", "shipment-details-icon"];
    if (index === tabsName.length - 1) {
      return (
        '<span class="' + className + '">' + '<span class="' + tabsIcon[index] + '">' + "</span>" + tabsName[index] + "</span>" + '<div class="active-mark "></div>'
        );
      }
      return '<span class="' + className + '">' + '<span class="' + tabsIcon[index] + '">' + "</span>" + tabsName[index] + "</span>";
    }
  });
  

$(document).ready(function() {
  var mobileMediaQuery = window.matchMedia("(max-width: 990px)"); // Check if the viewport width is greater than a certain value (e.g., 768px for typical tablets)

  if (mobileMediaQuery.matches) { // Check if the mobileMediaQuery matches
    console.log("Executing mobile-only jQuery function"); // This code will only execute on mobile devices

    var startY = 0;
    var startPosY = 0;
    var isDragging = false;
    var activePopupId = null; // Variable to track the active popup

    // Function to show a popup
    function showPopup(popupId) {
      $("body").css("overflow", "hidden"); // Disable page scrolling
      $(popupId).css("transform", "translateY(0px)"); // Reset the popup position before showing it
      $(".overlay").fadeIn(); // Show the overlay with fade-in animation
      $(popupId).slideDown(250); // Show the popup with slide-down animation
      activePopupId = popupId; // Set the active popup
    }

    // Function to hide a popup
    function hidePopup(popupId) {
      $(popupId).slideUp(250, function() {
        $(popupId).removeClass("center-modal-container-active"); // After the popup is closed, remove the class and set display to none on the container
        $(popupId).css("display", "none"); 
        $(".overlay").fadeOut(); // Hide the overlay with fade-out animation
        $("body").css("overflow", "auto"); // Re-enable page scrolling
        activePopupId = null; // Clear the active popup
      });
    }

    // Touch event handling for popup header
    $(".center-modal-header").on("touchstart", function(event) {
      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      startY = touch.clientY;
      startPosY = touch.clientY;
      isDragging = true;
    });

    $(".center-modal-header").on("touchmove", function(event) {
      if (isDragging) {
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        var deltaY = touch.clientY - startY;
        var newPos = Math.max(deltaY, 0);

        $(this).closest(".center-modal").css("transform", "translateY(" + newPos + "px)");
      }
    });

    $(".center-modal-header").on("touchend", function(event) {
      isDragging = false;
      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      var endY = touch.clientY;

      if (endY > startPosY && endY - startY > 50) {
        hidePopup($(this).closest(".center-modal"));
      } else {
        $(this).closest(".center-modal").css("transform", "translateY(0px)");
      }
    });

    // Show the Updates Popup when the "Show Updates Popup" button is clicked
    $("#updates_btn").click(function() {
      showPopup("#updates_modal");
    });

    // Hide the Updates Popup when its close button is clicked
    $("#close_updates_modal").click(function() {
      hidePopup("#updates_modal");
    });
    
    // Touch event handling for Shipment Popup header
    $("#shipment_modal .center-modal-header").on("touchstart", function(event) {
      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      startY = touch.clientY;
      startPosY = touch.clientY;
      isDragging = true;
    });

    $("#shipment_modal .center-modal-header").on("touchmove", function(event) {
      if (isDragging) {
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        var deltaY = touch.clientY - startY;
        var newPos = Math.max(deltaY, 0);

        $(this).closest(".center-modal").css("transform", "translateY(" + newPos + "px)");
      }
    });

    $("#shipment_modal .center-modal-header").on("touchend", function(event) {
      isDragging = false;
      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      var endY = touch.clientY;

      if (endY > startPosY && endY - startY > 50) {
        hidePopup("#shipment_modal");
      } else {
        $(this).closest(".center-modal").css("transform", "translateY(0px)");
      }
    });

    // Show the Shipment Popup when the "Show Shipment Popup" button is clicked
    $("#shipment_btn").click(function() {
      showPopup("#shipment_modal");
    });

    // Hide the Shipment Popup when its close button is clicked
    $("#close_shipment_modal").click(function() {
      hidePopup("#shipment_modal");
    });

    $(".overlay").on("click", function() {
      if (activePopupId) {
        hidePopup(activePopupId); // Close the active popup
      }
    });
  }
});


$(document).ready(function () {
  var desktopMediaQuery = window.matchMedia("(min-width: 990px)");

  if (desktopMediaQuery.matches) {
    // all tracking updates center modal
    $("#updates_btn").on("click", function () {
      $('.body').addClass("no-scroll")
      $(".overlay").css("display", "block");
      $("#updates_modal").css("display", "block");
      setTimeout(() => {
        $(".overlay").addClass("overlay-active");
        $("#updates_modal").addClass("center-modal-active");
      }, 1);
    })

    // shipment center modal
    $("#shipment_btn").on("click", function () {
      $('.body').addClass("no-scroll")
      $(".overlay").css("display", "block");
      $("#shipment_modal").css("display", "block");
      setTimeout(() => {
        $(".overlay").addClass("overlay-active");
        $("#shipment_modal").addClass("center-modal-active");
      }, 1);
    })

    // close all modals
    $(".close-modal-btn, .overlay").on("click", function (e) {
      if (e.target == this) {
        $('.body').removeClass("no-scroll")
        $(".overlay").removeClass("overlay-active");
        $(".center-modal").removeClass("center-modal-active");
        setTimeout(() => {
          $(".center-modal").css("display", "none");
          $('.overlay').css("display", "none")
        }, 200);
      }
    });

    // // help modal
    // $(".help-modal-btn").on("click", function () {
    //   $(".help-modal-container").css("display", "flex");
    //   $('.body').addClass("no-scroll")
    //   setTimeout(() => {
    //     $(".help-modal-container").addClass("active");
    //     $(".help-modal").addClass("active");
    //   }, 1);
    // })

    // // close help modal
    // $(".help-modal-container").on("click", function (e) {
    //   if (e.target == this) {
    //     $(".help-modal-container").removeClass("active");
    //     $(".help-modal").removeClass("active");
    //     $('.body').removeClass("no-scroll")
    //     setTimeout(() => {
    //       $(".help-modal-container").css("display", "none");
    //     }, 120);
    //   }
    // });
  };
});