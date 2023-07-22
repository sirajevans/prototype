// Animate an element's CSS properties
function animateElement(element, properties, duration) {
$(element).css("transitionTimingFunction", "ease");
$(element).css("transitionDuration", "0ms");
$(element).css("zIndex", "1000");

setTimeout(function () {
    $(element).css({
    transitionDuration: duration,
    ...properties,
    });
}, 10);
}

// Animate toast notification
function showDispatchNotification() {
animateElement("#dispatch-notification", { bottom: "25px" }, "255ms");
setTimeout(function () {
    animateElement("#dispatch-notification", { bottom: "-70px" }, "250ms");
}, 3500);
}

// Animate slide in popup
function openPopup(popupId) {
animateElement(popupId, { right: "0%" }, "250ms");
animateElement("#overlay", { opacity: "100%" }, "250ms");
}

// Animate slide out popup
function closePopup(popupId) {
animateElement(popupId, { right: "-455px" }, "250ms");
animateElement("#overlay", { opacity: "0%" }, "250ms");
}

function openSideMenu() {
openPopup("#side-menu");
}

function closeSideMenu() {
closePopup("#side-menu");
}

function openAddOrderPopup() {
openPopup("#add-order-popup");
}

function closeAddOrderPopup() {
closePopup("#add-order-popup");
}

function openSidePopup() {
openPopup("#order-overview-popup");
}

function closeSidePopup() {
closePopup("#order-overview-popup");
}

function openImportPopup() {
openPopup("#import-popup");
}

function closeImportPopup() {
closePopup("#import-popup");
}