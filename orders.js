// remove loader on page load
$(window).on("load", () => {
    setTimeout(() => {
        $("#s_page").fadeOut(100, () => {
            $("#s_page").remove();
        });
    }, 800);
});

// scroll x divider
$(".table-contents").scroll(function () {
    var scroll = $(".table-contents").scrollLeft();
    if (scroll > 0) {
        $(".table-cell-waybill-col").addClass("active");
    } else {
        $(".table-cell-waybill-col").removeClass("active");
    }
});

// btn loader
const BtnLoader = (e) => {
    if (e.target !== this) {
        $("#purchase_labels").addClass("btn-p-loading");
        $("#purchase_labels_loader").addClass("btn-p-loader-active");
    }
};
$("#purchase_labels").on("click", BtnLoader);

// list context menu
$(document).ready(() => {
    $(".shipment-row-context-btn").on("click", function (e) {
        if (e.target.closest(".shipment-row-context-btn")) {
            if ($(this).next(".context-menu-modal").hasClass("active")) {
                $(this).next(".context-menu-modal").removeClass("active");
                $(".table-cell").removeClass("active");
                $(".shipment-row-btn").removeClass("active");
                $(".shipment-row-context-btn").removeClass("active");
                setTimeout(() => {
                    $(this).next(".context-menu-modal").css("display", "none");
                }, 150);
            } else {
                $(".context-menu-modal").removeClass("active");
                $(".table-cell").removeClass("active");
                $(".shipment-row-btn").removeClass("active");
                $(".shipment-row-context-btn").removeClass("active");
                $(this).next(".context-menu-modal").css("display", "block");
                $(this).closest(".table-cell").addClass("active");
                $(this).siblings(".shipment-row-btn").addClass("active");
                $(this).addClass("active");
                setTimeout(() => {
                    $(this).next(".context-menu-modal").addClass("active");
                }, 1);
            }
        }
    });
    $(document).on("click", function (e) {
        if (!e.target.closest(".shipment-row-context-btn, .context-menu-btn")) {
            $(".context-menu-modal").removeClass("active");
            $(".table-cell").removeClass("active");
            $(".shipment-row-btn").removeClass("active");
            $(".shipment-row-context-btn").removeClass("active");
            setTimeout(() => {
                $(".context-menu-modal").css("display", "none");
            }, 150);
        }
    });
});

// context menus
$(document).ready(() => {
    $(".context-menu-btn").on("click", function (e) {
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
    $(document).on("click", function (e) {
        if (!e.target.closest(".context-menu-btn")) {
            $(".context-menu-modal").removeClass("active");
            setTimeout(() => {
                $(".context-menu-modal").css("display", "none");
            }, 150);
        }
    });
});

// toggle accordions on accordion-header click
$('.parcels-accordion-header').on('click', function () {
    $(this).parent().toggleClass('open');
    $(this).find('.accordion-arrow').toggleClass('active');
    $(this).siblings('.parcels-accordion-body').toggleClass('active');
});

/* Side menu animation JS */
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

  $(document).ready(() => {
    const shipmentSearch = $("#shipment-search");
    let searchSuggestions = $(".listing-search-suggestions");
    let suggestionItem = $(".listing-search-li");

    shipmentSearch.on("focus", () => {
        searchSuggestions.css("display", "block");
        setTimeout(() => {
            searchSuggestions.addClass("active");
        }, 1);
    });

    shipmentSearch.on("focusout", () => {
        setTimeout(() => {
            searchSuggestions.removeClass("active");
            setTimeout(() => {
                searchSuggestions.css("display", "none");
            }, 150);
        }, 100);
    });

    shipmentSearch.on("keyup", () => {
        if (shipmentSearch.val().trim() === "") {
            searchSuggestions.css("display", "block");
            setTimeout(() => {
                searchSuggestions.addClass("active");
            }, 10);
        } else {
            searchSuggestions.removeClass("active");
            setTimeout(() => {
                searchSuggestions.css("display", "none");
            }, 150);
        }
    });

    suggestionItem.on("click", function () {
        var suggestion = $(this).data("id");
        shipmentSearch.focus();
        shipmentSearch.val(suggestion);
        searchSuggestions.removeClass("active");
        setTimeout(() => {
            searchSuggestions.css("display", "none");
        }, 150);
    });
});

// filter side modal
$("#filter_btn").on("click", function () {
    $("#filter_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#filter_modal_container").addClass("side-modal-container-active");
        $("#filter_side_modal").addClass("side-modal-active");
    }, 1);
});

// toggle accordions on accordion-header click
$('.accordion-header').on('click', function () {
    $(this).parent().toggleClass('open');
    $(this).find('.accordion-arrow').toggleClass('active');
    $(this).siblings('.accordion-body').toggleClass('active');
});

// hide all modals
$(".close-modal-btn, .center-modal-container").on("click", function (e) {
    if (e.target == this) {
        $(".center-modal-container").removeClass("center-modal-container-active");
        $(".center-modal").removeClass("center-modal-active");
        setTimeout(() => {
            $(".center-modal-container").css("display", "none");
        }, 120);
    }
});

function hideAllCenterModal(e) {
    if (e.target == this) {
        $(".center-modal-container").removeClass("center-modal-container-active");
        $(".center-modal").removeClass("center-modal-active");
        setTimeout(() => {
            $(".center-modal-container").css("display", "none");
        }, 120);
    }
}
$(".close-modal-btn, .center-modal-container").on("click", hideAllCenterModal);

// purchase label center modal
$("#fulfill_btn").on("click", function() {
    $("#purchase_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#purchase_modal_container").addClass("center-modal-container-active");
        $("#purchase_center_modal").addClass("center-modal-active");
    }, 1);
});

$(document).ready(function() {
    // Loop through each fulfill counter container
    $('.fulfill-counter').each(function() {
      // Get the minus and plus elements within the current counter container
      var minusElement = $(this).find('.fulfill-counter-minus');
      var plusElement = $(this).find('.fulfill-counter-plus');
  
      // Get the counter body element within the current counter container
      var counterBody = $(this).find('.fulfil-counter-body div');
  
      // Get the maximum value for the current counter container
      var maxValue = parseInt(counterBody.text().split('/')[1].trim());
  
      // Set initial counter value as the maximum value
      var counterValue = maxValue;
  
      // Update the counter display for the current counter container
      counterBody.text(counterValue + ' / ' + maxValue);
  
      // Disable the plus button by default
      plusElement.addClass('disabled');
  
      // Add click event listener to the minus element
      minusElement.on('click', function() {
        // Decrease the counter value for the current counter container, ensuring it doesn't go below 0
        counterValue = Math.max(counterValue - 1, 0);
  
        // Update the counter display for the current counter container
        counterBody.text(counterValue + ' / ' + maxValue);
  
        // Check if counter value is equal to 0 and add "disabled" class to minus element
        if (counterValue === 0) {
          minusElement.addClass('disabled');
        } else {
          minusElement.removeClass('disabled');
        }
  
        // Remove "disabled" class from plus element
        plusElement.removeClass('disabled');
      });
  
      // Add click event listener to the plus element
      plusElement.on('click', function() {
        // Increase the counter value for the current counter container, ensuring it doesn't exceed the maximum value
        counterValue = Math.min(counterValue + 1, maxValue);
  
        // Update the counter display for the current counter container
        counterBody.text(counterValue + ' / ' + maxValue);
  
        // Check if counter value is equal to the maximum value and add "disabled" class to plus element
        if (counterValue === maxValue) {
          plusElement.addClass('disabled');
        } else {
          plusElement.removeClass('disabled');
        }
  
        // Remove "disabled" class from minus element
        minusElement.removeClass('disabled');
      });
    });
  });
  