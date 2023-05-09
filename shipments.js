// remove loader on page load
$(window).on("load", () => {
    setTimeout(() => {
        $("#s_page").fadeOut(100, () => {
            $("#s_page").remove();
        });
    }, 800);
});

// key shortcuts
$(document).keydown(function (e) {
    if ($(":input").is(":focus")) {
        return; //abort key shortcuts
    } else if (e.key && e.key.toLowerCase() == "/") {
        e.preventDefault();
        document.getElementById("shipment-search").focus();
    } else if (e.key && e.key.toLowerCase() == "i") {
        showUploadCenterModal();
    } else if (e.key && e.key.toLowerCase() == "l") {
        showPurchaseCenterModal();
    }
});

// upload center modal
$("#import_btn").on("click", function () {
    $("#upload_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#upload_modal_container").addClass("center-modal-container-active");
        $("#upload_center_modal").addClass("center-modal-active");
    }, 1);
});

// edit label center modal
function showEditCenterModal() {
    $("#edit_modal_container").css("display", "flex");
    $("#shipment_title").removeClass("edit-shipment-title-input-active");
    $(".center-modal-body").scrollTop(0);
    $("#s_modal").css("display", "flex");
    setTimeout(() => {
        $("#edit_modal_container").addClass("center-modal-container-active");
        $("#edit_center_modal").addClass("center-modal-active");
    }, 1);
    setTimeout(() => {
        $("#s_modal").fadeOut(100);
        $("#shipment_title").addClass("edit-shipment-title-input-active");
    }, 800);
}

// purchase label center modal
function showPurchaseCenterModal() {
    $("#purchase_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#purchase_modal_container").addClass("center-modal-container-active");
        $("#purchase_center_modal").addClass("center-modal-active");
    }, 1);
}

function hideAllCenterModal(e) {
    if (e.target == this) {
        $(".center-modal-container").removeClass("center-modal-container-active");
        $(".center-modal").removeClass("center-modal-active");
        setTimeout(() => {
            $(".center-modal-container").css("display", "none");
        }, 120);
    }
}
// trigger modals
$("#purchase_label_btn").on("click", showPurchaseCenterModal);
$("#edit_shipment_btn").on("click", showEditCenterModal);
$(".close-modal-btn, .center-modal-container").on("click", hideAllCenterModal);

// center modal tabs
const tabs = document.querySelectorAll(".modal-tab");
const tabContent = document.querySelectorAll(".modal-tab-content");
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

// trigger cancel shipment modal
$("#cancel_shipment_btn").on("click", () => {
    $("#cancel_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#cancel_modal_container").addClass("center-modal-container-active");
        $("#cancel_center_modal").addClass("center-modal-active");
    }, 1);
});

// trigger delete shipment modal
$("#delete_shipment_btn").on("click", () => {
    $("#delete_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#delete_modal_container").addClass("center-modal-container-active");
        $("#delete_center_modal").addClass("center-modal-active");
    }, 1);
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

// hide all modals
$(".side-modal-container").on("click", function (e) {
    if (e.target == this) {
        $(".side-modal-container").removeClass("side-modal-container-active");
        $(".side-modal").removeClass("side-modal-active");
        setTimeout(() => {
            $(".side-modal-container").css("display", "none");
        }, 120);
    }
});

// ship date context menu
$(document).ready(() => {
    $(".ship-date-btn").on("click", function (e) {
        if (e.target.closest(".ship-date-btn")) {
            if ($(this).next(".ship-date-context-modal").hasClass("active")) {
                $(this).next(".ship-date-context-modal").removeClass("active");
                setTimeout(() => {
                    $(this).next(".ship-date-context-modal").css("display", "none");
                }, 150);
            } else {
                $(".ship-date-context-modal").removeClass("active");
                $(this).next(".ship-date-context-modal").css("display", "block");
                $(this).next(".ship-date-context-modal").scrollTop(0);
                setTimeout(() => {
                    $(this).next(".ship-date-context-modal").addClass("active");
                }, 1);
            };
        }
    });
    $(document).on("click", function (e) {
        if (!e.target.closest(".ship-date-btn")) {
            $(".ship-date-context-modal").removeClass("active");
            setTimeout(() => {
                $(".ship-date-context-modal").css("display", "none");
            }, 150);
        };
    });
});

// show search suggestions
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

    suggestionItem.on("click", function () {
        var suggestion = $(this).data("id");
        shipmentSearch.focus();
        shipmentSearch.val(suggestion);
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

// toggle accordions
$('.accordion').on('click', function () {
    $(this).toggleClass('open');
    $(this).find('.accordion-arrow').toggleClass('active');
    $(this).find('.accordion-body').toggleClass('active');
});