// PAYMENTS
// Card stacking js
let cards = document.getElementsByClassName("payment-card")
for(let i=0; i < cards.length; i++) {
    let card = cards[i]
    let leftPositioning = i * 20
    card.style.left = `${leftPositioning}px`
}
// Predetermine how many cards are in the stack
let length = cards.length
/** Define key variables for configs etc
 *
 * let cardStackIndent = style.getPropertyValue(--card-stack-indent)
 *
 */
let cardStackIndent = 10;
let cardStackPadding = 30;
let defaultCardWidth = 165;
// Dynamically set the indentation for each card in the stack 
for (let index=0; index < length; index++){
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
} catch(error) {
    console.error("", error)
}

// Side nav modal
function openSideMenu() {
  $("#side-menu").css("left", "0%");
  $("#overlay").css({ transitionTimingFunction: "ease", transitionDuration: "0ms", zIndex: "1000"
  });
  setTimeout(() => {
    $("#overlay").css({ transitionDuration: "250ms", opacity: "100%"
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

// Add card modal
$("#add_card_btn").on("click", function () {
  $("#add_card_modal_container").css("display", "flex");
  setTimeout(() => {
      $("#add_card_modal_container").addClass("center-modal-container-active");
      $("#add_card_center_modal").addClass("center-modal-active");
  }, 1);
});

// ACCESSIBILITY
// Add shortcut modal
$("#add_shortcut_btn").on("click", function () {
  $("#shortcut_modal_container").css("display", "flex");
  setTimeout(() => {
      $("#shortcut_modal_container").addClass("center-modal-container-active");
      $("#shortcut_center_modal").addClass("center-modal-active");
  }, 1);
});

/* Add zone template */
$("#add_zone_btn").on("click", function () {
  $("#zone_modal_container").css("display", "flex");
  setTimeout(() => {
      $("#zone_modal_container").addClass("center-modal-container-active");
      $("#zone_center_modal").addClass("center-modal-active");
  }, 1);
});

// TEAM
// Add team member modal
$("#add_team_btn").on("click", function () {
    $("#team_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#team_modal_container").addClass("center-modal-container-active");
        $("#team_center_modal").addClass("center-modal-active");
    }, 1);
});

// FLEET
// Add driver modal
$("#add_driver_btn").on("click", function () {
    $("#driver_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#driver_modal_container").addClass("center-modal-container-active");
        $("#driver_center_modal").addClass("center-modal-active");
    }, 1);
});