// GENERAL

// hide all modals
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

// context menus (including purple context menu btns)
$(document).ready(() => {
  $(".context-menu-btn, .context-menu-btn-p").on("click", function (e) {
      if (e.target.closest(".context-menu-btn, .context-menu-btn-p")) {
          var modal = $(this).next(".context-menu-modal");
          if (modal.hasClass("active")) {
              modal.removeClass("active");
              setTimeout(() => {
                  modal.css("display", "none");
              }, 150);
          } else {
              $(".context-menu-modal").removeClass("active");
              modal.css("display", "block");
              setTimeout(() => {
                  modal.addClass("active");
              }, 1);
          };
      }
  });

  $(document).on("click", function (e) {
      if (!e.target.closest(".context-menu-btn, .context-menu-btn-p")) {
          $(".context-menu-modal").removeClass("active");
          setTimeout(() => {
              $(".context-menu-modal").css("display", "none");
          }, 150);
      }
  });
});

// full-width selector / context-menu
$(document).ready(() => {

  // ───────────── Toggle menu ─────────────
  $(".full-w-context-menu-btn").on("click", function (e) {
    const $menu = $(this).siblings(".full-w-context-menu");

    if ($menu.hasClass("active")) {
      // closing
      $menu.removeClass("active");
      setTimeout(() => $menu.hide(), 150);
    } else {
      // open this one / close others
      $(".full-w-context-menu").removeClass("active").hide();
      $menu.show();                       // display:block
      setTimeout(() => $menu.addClass("active"), 1);
    }

    e.stopPropagation(); // keep outside click handler from firing
  });

  // ───────────── Item selection ─────────────
  $(document).on("click", ".full-w-context-menu .context-menu-modal-li", function () {
    const labelText = $(this).find("div").first().text().trim();   // visible text
    const codeValue = $(this).find("code").text().trim();          // value

    // Put label on the button
    $(this)
      .closest(".relative")
      .find(".full-w-context-menu-btn div")
      .first()
      .text(labelText);

    // Close menu
    const $menu = $(this).closest(".full-w-context-menu");
    $menu.removeClass("active");
    setTimeout(() => $menu.hide(), 150);

    // (Optional) do something with the value
    console.log("Selected event:", codeValue);
  });

  // ───────────── Outside click closes menus ─────────────
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".full-w-context-menu-btn, .full-w-context-menu").length) {
      $(".full-w-context-menu").removeClass("active").hide();
    }
  });
});

// auth full-width selector (api key, bearer, basic, none)
$(document).ready(function () {
  // Toggle dropdown menu
  $(".full-w-context-menu-btn").on("click", function (e) {
    const $menu = $(this).siblings(".full-w-context-menu");

    if ($menu.hasClass("active")) {
      $menu.removeClass("active");
      setTimeout(() => $menu.hide(), 150);
    } else {
      $(".full-w-context-menu").removeClass("active").hide();
      $menu.show();
      setTimeout(() => $menu.addClass("active"), 1);
    }

    e.stopPropagation();
  });

  // Handle auth type selection
  $(document).on("click", ".full-w-context-menu .context-menu-modal-li", function () {
    const labelText = $(this).find("div").first().text().trim();
    const $container = $(this).closest("#authInputs");

    // Update button label
    $container.find(".full-w-context-menu-btn div").first().text(labelText);

    const $valueGroup = $container.find("#authValue");
    const $basicGroup = $container.find("#basicAuth");

    const $valueInput = $valueGroup.find("input");
    const $usernameInput = $basicGroup.find("input").eq(0);
    const $passwordInput = $basicGroup.find("input").eq(1);

    // Reset values and visibility
    $valueInput.val("").attr("placeholder", "");
    $usernameInput.val("").attr("placeholder", "Enter username");
    $passwordInput.val("").attr("placeholder", "Enter password");

    $valueGroup.removeClass("display-none");
    $basicGroup.addClass("display-none");

    switch (labelText.toLowerCase()) {
      case "api key":
        $valueInput.attr("placeholder", "Enter your API key");
        break;

      case "bearer token":
        $valueInput.attr("placeholder", "Bearer eyJhbGciOiJIUzI1...");
        break;

      case "basic":
        $valueGroup.addClass("display-none");
        $basicGroup.removeClass("display-none");
        break;

      case "none":
        $valueGroup.addClass("display-none");
        $basicGroup.addClass("display-none");
        break;
    }

    // Close dropdown
    const $menu = $(this).closest(".full-w-context-menu");
    $menu.removeClass("active");
    setTimeout(() => $menu.hide(), 150);
  });

  // Close menu on outside click
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".full-w-context-menu-btn, .full-w-context-menu").length) {
      $(".full-w-context-menu").removeClass("active").hide();
    }
  });
});

$(document).ready(function () {
  // Template for a new custom header row
  function createHeaderRow() {
    return `
      <div class="flex col-gap-15 mb-14 a-end">
        <div class="flex-col flex-grow">
          <div class="form-label">Key</div>
          <input placeholder="e.g. CLIENT_KEY" class="form-input focus-effect">
        </div>
        <div class="flex-col flex-grow">
          <div class="form-label">Value</div>
          <input class="form-input focus-effect">
        </div>
        <div class="input-row-btn" style="cursor: pointer;">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.99707 3.00293L11.0028 11.0086" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M11.0029 3.00293L2.99723 11.0086" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
    `;
  }

  // Enforce minimum one row — disable remove buttons accordingly
  function updateDeleteButtonStates() {
    const $rows = $("#edit_custom_headers_center_modal .center-modal-body .flex.col-gap-15.mb-14.a-end");
    const $deleteBtns = $rows.find(".input-row-btn");

    if ($rows.length <= 1) {
      $deleteBtns.addClass("disabled").css({
        "pointer-events": "none",
        "opacity": "0.4"
      });
    } else {
      $deleteBtns.removeClass("disabled").css({
        "pointer-events": "",
        "opacity": ""
      });
    }
  }

  // Add new header row
  $("#edit_custom_headers_center_modal .btn-w").on("click", function () {
    const $body = $("#edit_custom_headers_center_modal .center-modal-body");
    const $newRow = $(createHeaderRow());
    $body.append($newRow);

    // Focus first input in new row
    setTimeout(() => {
      $newRow.find("input").first().focus();
      updateDeleteButtonStates();
    }, 10);
  });

  // Remove header row (only if not disabled)
  $(document).on("click", "#edit_custom_headers_center_modal .input-row-btn:not(.disabled)", function () {
    $(this).closest(".flex.col-gap-15.mb-14.a-end").remove();
    updateDeleteButtonStates();
  });

  // Initial check on page load
  updateDeleteButtonStates();
});



// ACCOUNT
const togglePassword = $("#togglePass");
const password = $("#resetPass");

togglePassword.on("click", function () {
  // toggle the type attribute
  const type = password.attr("type") === "password" ? "text" : "password";
  password.attr("type", type);

  // toggle the icon
  $(this).toggleClass("eye-open");
});

// prevent form submit
const form = $("form");
form.on("submit", function (e) {
  e.preventDefault();
});

// PAYMENTS

// eft modal
function showEftModal() {
  $("#eft_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#eft_modal_container").addClass("center-modal-container-active");
    $("#eft_center_modal").addClass("center-modal-active");
  }, 1);
}

// instant eft modal 
function showInstantEftModal() {
  $("#instant_eft_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#instant_eft_modal_container").addClass("center-modal-container-active");
    $("#instant_eft_center_modal").addClass("center-modal-active");
  }, 1);
}

// card modal
function showCardModal() {
  $("#card_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#card_modal_container").addClass("center-modal-container-active");
    $("#card_center_modal").addClass("center-modal-active");
  }, 1);
}

// button click handlers
$("#card_btn").on("click", showCardModal);
$("#eft_btn").on("click", showEftModal);
$("#instant_eft_btn").on("click", showInstantEftModal);

// key shortcuts
$(document).keydown(function (e) {
  if ($(":input").is(":focus")) {
      return; //abort key shortcuts
  } else if (e.key && e.key.toLowerCase() == "m") {
      showEftModal();
  } else if (e.key && e.key.toLowerCase() == "i") {
      showInstantEftModal();
  } else if (e.key && e.key.toLowerCase() == "c") {
      showCardModal();
  }
});

// NOTIFICATIONS

// STATUS PAGE
function countChars(obj) {
  $("#CharCount").text(obj.value.length + "/65");
}

let merchantMsgIn = $('#merchant-msg-input');
let merchantMsgOut = $('#merchant-msg-output');

function updateMsg() {
  if (merchantMsgIn.val() === "") {
    merchantMsgOut.text("Delivery updates for your order #23910");
  } else {
    merchantMsgOut.text(merchantMsgIn.val());
  }
}

// Profanity filter
function profanityCheck() {
  let merchantMsgValue = $('#merchant-msg-input').val();
  let profanity = /faggot|nigga|nigger|arse|wanker|retard|dick|crap|shit|fuck|ass|penis|vagina|porn|pussy|cock|testicles|bitch|twat|cunt|slut|whore|poes|naai/;

  if (merchantMsgValue.match(profanity)) {
    merchantMsgValue = merchantMsgValue.replace(profanity, '');
    $('#merchant-msg-input').val(merchantMsgValue);
  }
}

merchantMsgIn.on('keyup', profanityCheck);
merchantMsgIn.on('keyup', updateMsg);

// center modal tabs
const tabs = document.querySelectorAll(".table-tab");
const tabContent = document.querySelectorAll(".brand-toolbar-content");
let tabNo = 0;
let contentNo = 0;
tabs.forEach((tab) => {
    tab.dataset.id = tabNo;
    tabNo++;
    tab.addEventListener("click", function () {
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        });
        this.classList.add("active");
        tabContent.forEach((content) => {
            content.scrollTop = 0;
            content.classList.add("hidden");
            if (content.dataset.id === tab.dataset.id) {
                content.classList.remove("hidden");
            }
        });
    });
});

tabContent.forEach((content) => {
    content.dataset.id = contentNo;
    contentNo++;
});

// ad carousel
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
      this.slideElements.hide()
      this.slideElements.eq(this.currentIndex).show()
      this.progressBars.slice(0, this.currentIndex).stop().width("100%")
      this.progressBars.slice(this.currentIndex).stop().width("0%")

      clearInterval(this.interval)
      this.animateProgressBar(0, this.slideDuration)
      this.interval = setInterval(this.nextSlide, this.slideDuration + 10)
    }

    nextSlide = () => {
      clearInterval(this.interval)
      this.currentIndex = (this.currentIndex + 1) % this.slideCount
      this.showSlide()
    }

    prevSlide = () => {
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
      let currentProgressBar = this.progressBars.eq(this.currentIndex)
      clearInterval(this.interval)
      currentProgressBar.stop()
    }

    resume = () => {
      this.slideIsPaused = false
      let currentProgressBar = this.progressBars.eq(this.currentIndex)
      let currentProgress = currentProgressBar.width() * 1
      let timeElapsed = (currentProgress / 100.0 * this.slideDuration)
      let timeRemaining = this.slideDuration - timeElapsed
      this.animateProgressBar(currentProgress, timeRemaining)
      this.interval = setInterval(this.nextSlide, timeRemaining + 10)
    }

    animateProgressBar = (start, duration) => {
      let currentProgressBar = this.progressBars.eq(this.currentIndex)
      currentProgressBar.stop().width(`${start}%`).animate({ "width": "100%" }, duration, "linear")
    }

    start = () => this.showSlide()
    registerEventHandlers = () => {
      $(this.nextButtonSelector).on("click", this.nextSlide);
      $(this.prevButtonSelector).on("click", this.prevSlide);
      $(this.slideSelector).on("touchstart", this.pause)
      $(this.slideSelector).on("touchend", this.resume)
    }
  }
  let slideShow = new SlideShow(3000)
  slideShow.start()
})


// ACCESSIBILITY
// add shortcut modal
$("#add_shortcut_btn").on("click", function () {
  $("#shortcut_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#shortcut_modal_container").addClass("center-modal-container-active");
    $("#shortcut_center_modal").addClass("center-modal-active");
  }, 1);
});

/* add zone template */
$("#add_zone_btn").on("click", function () {
  $("#zone_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#zone_modal_container").addClass("center-modal-container-active");
    $("#zone_center_modal").addClass("center-modal-active");
  }, 1);
});

// CARRIERS
// carrier config modal
function showCarrierConfigModal() {
  $("#carrier_modal_container").css("display", "flex");
  $(".center-modal-body").scrollTop(0);
  $("#s_modal").css("display", "flex");
  setTimeout(() => {
    $("#carrier_modal_container").addClass("center-modal-container-active");
    $("#carrier_center_modal").addClass("center-modal-active");
  }, 1);
}

// fastway modal -- update this to use the trigger below and one global script for the modal.
$("#fastway_config_btn").on("click", function () {
  $("#fastway_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#fastway_modal_container").addClass("center-modal-container-active");
    $("#fastway_center_modal").addClass("center-modal-active");
  }, 1);
});

// trigger modal
$("[carrier='yango']").on("click", showCarrierConfigModal);

// TEAM
// add team member modal
$("#add_team_btn").on("click", function () {
  $("#team_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#team_modal_container").addClass("center-modal-container-active");
    $("#team_center_modal").addClass("center-modal-active");
  }, 1);
});

// toggle accordions on accordion-header click
$('.accordion-header').on('click', function () {
  $(this).parent().toggleClass('open');
  $(this).find('.accordion-arrow').toggleClass('active');
  $(this).siblings('.accordion-body').toggleClass('active');
});

// modal header shadow
$(".center-modal-body").scroll(function () {
  var scroll = $(this).scrollTop();
  $(".center-modal-header").toggleClass("center-modal-header-active", scroll > 0);
});

// btn loader
$("#send_invite_btn").on("click", function (e) {
  if (e.target !== this) {
    $("#send_invite_btn").addClass("btn-p-loading");
    $("#send_invite_loader").addClass("btn-p-loader-active");
  }
});

// FLEET
// add driver modal
$("#add_driver_btn").on("click", function () {
  $("#driver_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#driver_modal_container").addClass("center-modal-container-active");
    $("#driver_center_modal").addClass("center-modal-active");
  }, 1);
});

// TAGS
// add tags modal
$("#add_tags_btn").on("click", function () {
  $("#tags_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#tags_modal_container").addClass("center-modal-container-active");
    $("#tags_center_modal").addClass("center-modal-active");
  }, 1);
});

// INTEGRATIONS
// add webhook modal
$("#add_webhook_btn").on("click", function () {
  $("#add_webhook_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#add_webhook_modal_container").addClass("center-modal-container-active");
    $("#add_webhook_center_modal").addClass("center-modal-active");
  }, 1);
});


// edit webhook modal
$("#edit_webhook_btn").on("click", function () {
  $("#edit_webhook_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#edit_webhook_modal_container").addClass("center-modal-container-active");
    $("#edit_webhook_center_modal").addClass("center-modal-active");
  }, 1);
});

// edit webhook auth modal
$("#edit_auth_btn").on("click", function () {
  $("#edit_auth_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#edit_auth_modal_container").addClass("center-modal-container-active");
    $("#edit_auth_center_modal").addClass("center-modal-active");
  }, 1);
});

// edit custom headers modal
$("#edit_custom_headers_btn").on("click", function () {
  $("#edit_custom_headers_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#edit_custom_headers_modal_container").addClass("center-modal-container-active");
    $("#edit_custom_headers_center_modal").addClass("center-modal-active");
  }, 1);
});

// edit monitoring recipients modal
$(".settings-card").on("click", "#edit_monitoring_btn", function () {
  const $container = $("#edit_monitoring_modal_container");
  const $modal = $("#edit_monitoring_center_modal");

  if ($container.length && $modal.length) {
    $container.css("display", "flex");
    setTimeout(() => {
      $container.addClass("center-modal-container-active");
      $modal.addClass("center-modal-active");
    }, 1);
  }
});

// view webhook details modal
$("#webhook_event_btn").on("click", function () {
  $("#webhook_event_modal_container").css("display", "flex");
  setTimeout(() => {
    $("#webhook_event_modal_container").addClass("center-modal-container-active");
    $("#webhook_event_center_modal").addClass("center-modal-active");
  }, 1);
});

// delete webhook modal
$("#delete_webhook_btn").on("click", () => {
  $("#delete_webhook_modal_container").css("display", "flex");
  setTimeout(() => {
      $("#delete_webhook_modal_container").addClass("center-modal-container-active");
      $("#delete_webhook_center_modal").addClass("center-modal-active");
  }, 1);
});



// handle webhook test loading and response messages
document.getElementById('webhook_test').addEventListener('click', function () {
  const loading = document.getElementById('webhook-test-loading');
  const response = document.getElementById('webhook-test-response');
  const button = document.getElementById('webhook_test').closest('.settings-btn-p');

  // Show loading, hide response, disable button
  loading.classList.remove('display-none');
  response.classList.add('display-none');
  button.classList.add('btn-disabled');

  // After 2 seconds, show response, re-enable button
  setTimeout(() => {
    loading.classList.add('display-none');
    response.classList.remove('display-none');
    button.classList.remove('btn-disabled');
  }, 2000);
});

// control the monitor enabled hide and show recipients
(() => {
  const checkbox = document.getElementById('enable_monitoring');
  const originalPanel = document.getElementById('monitoring_recipients');
  const duration = 150;
  let panel = originalPanel;
  let parent = panel.parentNode;
  let nextSibling = panel.nextSibling;

  const computedStyle = getComputedStyle(panel);
  const originalPaddingTop = parseFloat(computedStyle.paddingTop) || 0;
  const originalPaddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
  const firstRow = parent.querySelector(".settings-card-li");

  function easeInOutQuart(t) {
    return t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function animate({ el, fromHeight, toHeight, fromOpacity, toOpacity, fromPaddingTop, toPaddingTop, fromPaddingBottom, toPaddingBottom, onEnd }) {
    const start = performance.now();

    function frame(time) {
      let progress = (time - start) / duration;
      if (progress > 1) progress = 1;

      const eased = easeInOutQuart(progress);

      const currentHeight = fromHeight + (toHeight - fromHeight) * eased;
      const currentOpacity = fromOpacity + (toOpacity - fromOpacity) * eased;
      const currentPaddingTop = fromPaddingTop + (toPaddingTop - fromPaddingTop) * eased;
      const currentPaddingBottom = fromPaddingBottom + (toPaddingBottom - fromPaddingBottom) * eased;

      el.style.height = `${currentHeight}px`;
      el.style.opacity = currentOpacity;
      el.style.paddingTop = `${currentPaddingTop}px`;
      el.style.paddingBottom = `${currentPaddingBottom}px`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        onEnd?.();
      }
    }

    requestAnimationFrame(frame);
  }

  function showPanel() {
    if (!panel) {
      firstRow?.classList.remove("last");

      panel = originalPanel.cloneNode(true);
      panel.style.display = 'flex';
      panel.style.visibility = 'hidden';
      panel.style.opacity = 0;
      panel.style.height = 'auto';
      panel.style.paddingTop = `${originalPaddingTop}px`;
      panel.style.paddingBottom = `${originalPaddingBottom}px`;
      parent.insertBefore(panel, nextSibling);

      requestAnimationFrame(() => {
        const fullHeight = panel.scrollHeight;

        panel.style.height = '0px';
        panel.style.opacity = 0;
        panel.style.paddingTop = '0px';
        panel.style.paddingBottom = '0px';
        panel.style.overflow = 'hidden';
        panel.style.visibility = 'visible';

        animate({
          el: panel,
          fromHeight: 0,
          toHeight: fullHeight,
          fromOpacity: 0,
          toOpacity: 1,
          fromPaddingTop: 0,
          toPaddingTop: originalPaddingTop,
          fromPaddingBottom: 0,
          toPaddingBottom: originalPaddingBottom,
          onEnd: () => {
            panel.style.height = 'auto';
            panel.style.paddingTop = `${originalPaddingTop}px`;
            panel.style.paddingBottom = `${originalPaddingBottom}px`;
            panel.style.overflow = '';
          }
        });
      });
    }
  }

  function hidePanel() {
    const currentHeight = panel.scrollHeight;
    const currentPaddingTop = parseFloat(getComputedStyle(panel).paddingTop) || 0;
    const currentPaddingBottom = parseFloat(getComputedStyle(panel).paddingBottom) || 0;

    panel.style.height = `${currentHeight}px`;
    panel.style.overflow = 'hidden';

    animate({
      el: panel,
      fromHeight: currentHeight,
      toHeight: 0,
      fromOpacity: 1,
      toOpacity: 0,
      fromPaddingTop: currentPaddingTop,
      toPaddingTop: 0,
      fromPaddingBottom: currentPaddingBottom,
      toPaddingBottom: 0,
      onEnd: () => {
        panel.remove();
        panel = null;
        firstRow?.classList.add("last");
      }
    });
  }

  checkbox.addEventListener('change', () => {
    checkbox.checked ? showPanel() : hidePanel();
  });

  if (checkbox.checked) {
    showPanel();
  } else {
    panel.remove();
    panel = null;
    firstRow?.classList.add("last");
  }
})();