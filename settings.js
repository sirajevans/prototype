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

// add card modal
$("#add_card_btn").on("click", function () {
    $("#add_card_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#add_card_modal_container").addClass("center-modal-container-active");
        $("#add_card_center_modal").addClass("center-modal-active");
    }, 1);
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