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
  };
});


// interactive ad code
$(document).ready(function () {

  class SlideShow {
    constructor(slideDuration) {
      this.slideDuration = slideDuration
      this.nextButtonSelector = ".next"
      this.prevButtonSelector = ".prev"
      this.slideSelector = ".ad-slide"
      this.slideElements = $(this.slideSelector)
      this.slideCount = Array.from(this.slideElements).length
      this.slideIsPaused = false

      $(".bars").html(Array(this.slideCount).fill('<div class="time-bar"><div class="time-bar-fill"></div></div>').join(""))
      this.progressBars = $(".time-bar-fill");
      this.currentIndex = 0
      this.interval = null

      this.registerEventHandlers()
    }

    showSlide = () => {
      /**
       * Show the current slide
       *  - Resets all progress bars after the current slide to 0 (not viewed)
       *  - Resets all progress bars before the current slide to 100% (viewed)
       *  - Animates the progress bar from 0 to 100 for the configured slide duration
       *  - To prevent race conditions between the slide hide/display toggle and progress
       *    bar animation, add a buffer of about 10 or more milliseconds so the browsers can
       *    complete any pending/queued animations.
       */
      this.slideElements.hide()
      this.slideElements.eq(this.currentIndex).show()
      this.progressBars.slice(0, this.currentIndex).stop().width("100%")
      this.progressBars.slice(this.currentIndex).stop().width("0%")

      clearInterval(this.interval)
      this.animateProgressBar(0, this.slideDuration)
      this.interval = setInterval(this.nextSlide, this.slideDuration + 10)
    }

    nextSlide = () => {
      /* Navigate to the previous slide */
      clearInterval(this.interval)
      this.currentIndex = (this.currentIndex + 1) % this.slideCount
      this.showSlide()
    }

    prevSlide = () => {
      /* Navigate to the previous slide if we're not on the first slide */
      clearInterval(this.interval)
      if (this.currentIndex == 0) {
        this.currentIndex = 0
      } else {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount
      }
      this.showSlide()
    }

    pause = () => {
      this.slideIsPaused = true

      /* Stop the darn thing, let me read it... :) */
      let currentProgressBar = this.progressBars.eq(this.currentIndex)
      clearInterval(this.interval)
      currentProgressBar.stop()
    }

    resume = () => {
      this.slideIsPaused = false

      /* Start a few milliseconds before where you left off for a better continuation.*/
      let currentProgressBar = this.progressBars.eq(this.currentIndex)
      let currentProgress = currentProgressBar.width() * 1
      let timeElapsed = (currentProgress / 100.0 * this.slideDuration)
      let timeRemaining = this.slideDuration - timeElapsed
      this.animateProgressBar(currentProgress, timeRemaining)
      this.interval = setInterval(this.nextSlide, timeRemaining + 10)
    }

    animateProgressBar = (start, duration) => {
      /* Animate the progress bar from a given percentage `start` to 100% in `duration` milliseconds */
      let currentProgressBar = this.progressBars.eq(this.currentIndex)
      currentProgressBar.stop().width(`${start}%`).animate({ "width": "100%" }, duration, "linear")
    }

    start = () => this.showSlide()

    registerEventHandlers = () => {
      /**
       * Bind event handlers for any clickable elements
       *  > Prev   - Left Panel
       *  > Next   - Right Panel
       *  > Pause  - Click the slide
       *  > Resume - Click the slide again
       */
      $(this.nextButtonSelector).on("click", this.nextSlide);
      $(this.prevButtonSelector).on("click", this.prevSlide);
      $(this.slideSelector).on("touchstart", this.pause)
      $(this.slideSelector).on("touchend", this.resume)
    }
  }

  let slideShow = new SlideShow(3000)
  slideShow.start()
})