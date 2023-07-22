// set main card dynamic height
$(document).ready(() => {
    let cardFooterHeight = document.querySelector(".main-card-footer").offsetHeight;
    $(".main-card-content").height(`calc(100% - ${cardFooterHeight}px`);
});

// Greeting js
let greetingtext = document.getElementById('greeting-text');
let greetingTimeOfDay = new Date();
let userGreetingName = document.querySelector('.nav-profile-container').innerHTML;
window.addEventListener('load', function getDate() {
    if (greetingTimeOfDay.getHours() >= 4 && greetingTimeOfDay.getHours() < 12) {
        greetingtext.innerHTML = 'Good morning, ' + userGreetingName;
    } else if (greetingTimeOfDay.getHours() >= 12 && greetingTimeOfDay.getHours() < 18) {
        greetingtext.innerHTML = 'Good afternoon, ' + userGreetingName;
    } else if (greetingTimeOfDay.getHours() >= 18 && greetingTimeOfDay.getHours() < 23) {
        greetingtext.innerHTML = 'Good evening, ' + userGreetingName;
    } else {
        greetingtext.innerHTML = 'Hey there night owl';
    }
})
window.addEventListener('load', function displayGreeting() {
    setTimeout(() => {
        $('#greeting-text').removeClass('opacity-0');
    }, 1)
});

// add pod modal
$("#add_pod_btn").on("click", function () {
    $("#add_pod_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#add_pod_modal_container").addClass("center-modal-container-active");
        $("#add_pod_center_modal").addClass("center-modal-active");
    }, 1);
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

// Google autocomplete
$(document).ready(function () {
    function initAutocomplete() {
      const input = document.getElementById('address_input');
      const options = {
        // types: ['geocode'], // Restrict the autocomplete results to geographical addresses
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
    }

    initAutocomplete();
  });