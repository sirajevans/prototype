// set main card dynamic height
$(document).ready(() => {
    let cardFooterHeight = document.querySelector(".main-card-footer").offsetHeight;
    $(".main-card-content").height(`calc(100% - ${cardFooterHeight}px`);
});

// Greeting js
let greetingtext = document.getElementById('greeting-text');
let greetingTimeOfDay = new Date();
window.addEventListener('load', function getDate() {
    if (greetingTimeOfDay.getHours() >= 4 && greetingTimeOfDay.getHours() < 12) {
        greetingtext.innerHTML = 'Good morning, ';
    } else if (greetingTimeOfDay.getHours() >= 12 && greetingTimeOfDay.getHours() < 18) {
        greetingtext.innerHTML = 'Good afternoon, ';
    } else if (greetingTimeOfDay.getHours() >= 18 && greetingTimeOfDay.getHours() < 23) {
        greetingtext.innerHTML = 'Good evening, ';
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

// click & collect modal
$("#click_collect_btn").on("click", function () {
    $("#click_collect_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#click_collect_modal_container").addClass("center-modal-container-active");
        $("#click_collect_center_modal").addClass("center-modal-active");
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


// open + close side-menu
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const sideMenu = document.querySelector('.side-menu');
  const elementsToToggle = document.querySelectorAll('.side-menu, .main-content, .menu-company-name, .menu-item-text, .side-menu-category');
  
  // Check stored state
  const isMenuClosed = localStorage.getItem('sideMenuClosed') === 'true';
  
  // Apply stored state
  if (isMenuClosed) {
    menuToggle.classList.add('closed');
    elementsToToggle.forEach(element => {
      element.classList.add('side-menu-closed');
    });
  }

  // Show menu after state is applied
  requestAnimationFrame(() => {
    sideMenu.classList.add('initialized');
    // Remove initial state class after everything is set
    document.documentElement.classList.remove('side-menu-initial-closed');
  });

  // Menu toggle functionality
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('closed');
    
    elementsToToggle.forEach(element => {
      element.classList.toggle('side-menu-closed');
    });

    localStorage.setItem('sideMenuClosed', menuToggle.classList.contains('closed'));
  });

  // Close menu when clicking outside (for mobile)
  const closeMenu = (event) => {
    if (window.innerWidth > 760) return;

    const isMenuOpen = !sideMenu.classList.contains('side-menu-closed');
    const target = event.target || (event.touches && event.touches[0]?.target);
    const isClickOutside = target && !sideMenu.contains(target) && !target.classList.contains('menu-toggle');

    if (isMenuOpen && isClickOutside) {
      menuToggle.classList.add('closed');
      elementsToToggle.forEach(element => {
        element.classList.add('side-menu-closed');
      });
      
      localStorage.setItem('sideMenuClosed', 'true');
    }
  };

  document.addEventListener('click', closeMenu);
  document.addEventListener('touchend', closeMenu);

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 760) {
        menuToggle.classList.remove('closed');
        elementsToToggle.forEach(element => {
          element.classList.remove('side-menu-closed');
        });
        localStorage.setItem('sideMenuClosed', 'false');
      }
    }, 250);
  }, { passive: true });
});

// Refresh button
document.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.querySelector('.nav-refresh');
  const refreshPaths = document.querySelector('.nav-refresh-paths');
  let isRefreshing = false;
  
  if (refreshButton && refreshPaths) {
    refreshButton.addEventListener('click', () => {
      if (isRefreshing) return;
      
      isRefreshing = true;
      refreshPaths.classList.toggle('rotated');
      window.location.reload(true);
    });
  }

  // Navigation buttons
  const prevButton = document.querySelector('.nav-prev');
  const nextButton = document.querySelector('.nav-next');

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      window.history.forward();
    });
  }
});

// Check if application is native or not
if (window.todesktop) {
    document.querySelector('.macos-app-spacer').style.display = 'block';
} else {
    document.querySelector('.macos-app-spacer').style.display = 'none';
}