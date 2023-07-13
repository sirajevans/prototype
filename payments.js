/* Card stacking js */
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

/* Side nav */
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

/* Add card */
$("#add_card_btn").on("click", function () {
  $("#add_card_modal_container").css("display", "flex");
  setTimeout(() => {
      $("#add_card_modal_container").addClass("center-modal-container-active");
      $("#add_card_center_modal").addClass("center-modal-active");
  }, 1);
});