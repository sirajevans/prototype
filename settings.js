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
// card stacking
let cards = document.getElementsByClassName("payment-card")
for (let i = 0; i < cards.length; i++) {
  let card = cards[i]
  let leftPositioning = i * 20
  card.style.left = `${leftPositioning}px`
}
// predetermine how many cards are in the stack
let length = cards.length
/* Define key variables for configs etc
 * let cardStackIndent = style.getPropertyValue(--card-stack-indent) */
let cardStackIndent = 10;
let cardStackPadding = 30;
let defaultCardWidth = 165;
// Dynamically set the indentation for each card in the stack 
for (let index = 0; index < length; index++) {
  cards[index].style.left = `${index * cardStackIndent}px`;
}
try {
  let numberOfCards = length > 1 ? length - 1 : 1;
  let cardWidth = cards ? cards[0].offsetWidth : defaultCardWidth;
  let cardStackWidth = cardWidth + (cardStackIndent * numberOfCards)
  let addPaymentWrapper = document.getElementsByClassName("add-payment-wrapper")[0]
  addPaymentWrapper.style.setProperty("position", "sticky");
  addPaymentWrapper.style.setProperty("left", `${cardStackWidth + cardStackPadding}px`);
  addPaymentWrapper.style.setProperty("width", `calc(100% - ${cardStackWidth + cardStackPadding - cardStackIndent}px)`);
} catch (error) {
  console.error("", error)
}

// // add card modal
// $("#add_card_btn").on("click", function () {
//   $("#add_card_modal_container").css("display", "flex");
//   setTimeout(() => {
//     $("#add_card_modal_container").addClass("center-modal-container-active");
//     $("#add_card_center_modal").addClass("center-modal-active");
//   }, 1);
// });

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

// selector drop down menu
const selectBtn = $("#auth_selector");
const selectBtnText = $("#auth_type");
const selectMenu = $(".select-menu-modal");
const selectMenuItem = $(".select-menu-li");
let selectMenuStatus = false;

// opening and closing function
selectBtn.on("click", () => {
  if (!selectMenuStatus) {
    selectMenu.removeClass("display-none");
    setTimeout(() => {
      selectMenu.addClass("select-menu-active");
    }, 1);
    selectMenuStatus = true;
  } else {
    selectMenu.removeClass("select-menu-active");
    setTimeout(() => {
      selectMenu.addClass("display-none");
    }, 1);
    selectMenuStatus = false;
  }
});

// handling the select menu options
selectMenuItem.on("click", (option) => {
  selectBtnText.text(option.innerText);
  $("#auth-type").val(option.innerText);
  selectMenu.removeClass("select-menu-active");
  setTimeout(() => {
    selectMenu.addClass("display-none");
  }, 150);
  $(".auth-types").addClass("display-none");
  $("#auth_type_" + option.getAttribute("data-type")).removeClass("display-none");
});

// close on outside click
$(window).on("click", (e) => {
  if (!selectBtn.is(e.target)) {
    selectMenu.removeClass("select-menu-active");
    setTimeout(() => {
      selectMenu.addClass("display-none");
    }, 150);
    selectMenuStatus = false;
  }
});

// webhooks js tooltip
const trigger = $("#endpoint_test_btn");
let tooltip = $("#endpoint_tooltip");

function showBtnTooltip() {
  tooltip.css("display", "block");
  setTimeout(() => {
    tooltip.addClass("btn-tooltip-active");
  }, 1);
}

function hideBtnTooltip() {
  tooltip.removeClass("btn-tooltip-active");
  setTimeout(() => {
    tooltip.css("display", "none");
  }, 100);
}

trigger.on("mouseover", showBtnTooltip);
trigger.on("mouseout", hideBtnTooltip);

// OTHER
// side nav modal
function openSideMenu() {
  $("#side-menu").css("left", "0%");
  $("#overlay").css({
    transitionTimingFunction: "ease", transitionDuration: "0ms", zIndex: "1000"
  });
  setTimeout(() => {
    $("#overlay").css({
      transitionDuration: "250ms", opacity: "100%"
    });
  }, 10);
}

function closeSideMenu() {
  $("#side-menu").css("left", "-370px");
  $("#overlay").css("opacity", "0%");
  setTimeout(() => {
    $("#overlay").css("zIndex", "-1");
  }, 10);
}

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