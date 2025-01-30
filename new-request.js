var map;
var map_details = [];
var deliveryObj;
var driversObj;
var vehiclesObj;
var carriersObj = [];
var searchInput;
var paymentCards;
var selecteddpdRatesObj;
var selectedRateType;
var availableIntervals;
var collectionTimes = [];
var mainPurchaseObj = [];
var selectedRatesObj;
var etaData = [];
var refershRates = false;
var newDeliveryRoutePath = [];
var originalForm;
var markerArr;
var dpdLaserIntervals;
var fastwayIntervals;

$(document).ready(function () {
    if (
        window.location.pathname == "/home" ||
        window.location.pathname == "/"
    ) {
        localStorage.clear();
    }
    if (
        $(
            '#finalise-rate-btn .primary-btn-text:contains("Please select a rate")'
        ).length > 0
    ) {
        $(document).find("#finalise-rate-btn .primary-btn-text").click(false);
    } else {
        $(document).find("#finalise-rate-btn .primary-btn-text").click(true);
    }
    // -----------------FUNCTIONS START-----------------
    function hideAllCenterModal(e) {
        if (e.target == this) {
            $(".center-modal-container").removeClass(
                "center-modal-container-active"
            );
            $(".center-modal").removeClass("center-modal-active");
            setTimeout(() => {
                $(".center-modal-container").css("display", "none");
            }, 120);
        }
    }
    
    // GOOGLE AUTOSUGGESTION INITIALISE
    function newDeliveryGoogleSuggestion(id) {
        var new_delivery_google_suggestion = document.getElementById(id);
        if (
            currENV == "live" &&
            passengerFirestoreId != "6b6177788c644db7b788"
        ) {
            var autocomplete = new google.maps.places.Autocomplete(
                new_delivery_google_suggestion,
                { componentRestrictions: { country: "za" } }
            );
        } else {
            var autocomplete = new google.maps.places.Autocomplete(
                new_delivery_google_suggestion,
                {}
            );
        }

        autocomplete.setFields([
            "address_components",
            "formatted_address",
            "geometry",
            "place_id",
            "types",
            "name",
            "icon",
        ]);
        autocomplete.addListener("place_changed", async function () {
            $(document).find(".pac-container-second").hide();
            if (autocomplete.getPlace().geometry != undefined) {
                var place = autocomplete.getPlace();
                var placeName = place.name ? place.name + ", " : "";

                var containerDiv = $("#" + id).closest("form");

                containerDiv
                    .find("#address_lat")
                    .val(autocomplete.getPlace().geometry.location.lat());
                containerDiv
                    .find("#address_lang")
                    .val(autocomplete.getPlace().geometry.location.lng());

                // GET POSTAL CODE
                var postal_code = "";
                var province = "";
                var city = "";
                var sublocality = "";
                var fastway_postal_code = "";
                var fastway_sublocality = "";
                $.each(
                    autocomplete.getPlace().address_components,
                    function (key, value) {
                        var tmpArr = value.types; 
                        if (tmpArr.includes("postal_code")) {
                            postal_code = value.long_name;
                            return false;
                        }

                        if (
                            tmpArr.includes("administrative_area_level_1") &&
                            province == ""
                        ) {
                            province = value.long_name;
                            suburb = value.long_name;
                        }

                        if (tmpArr.includes("locality") && city == "") {
                            city = value.long_name;
                        }

                        if (tmpArr.includes("sublocality") && sublocality == "") {
                            sublocality = value.long_name;
                        }
                    }
                );
               
                var fullAdrees = autocomplete.getPlace().formatted_address;
                var shortAdress = "";
                if (fullAdrees.includes(",")) {
                    var fullAddressArr = fullAdrees.split(",");
                    if (fullAddressArr.length > 1) {
                        shortAdress =
                            fullAddressArr[0] + ", " + fullAddressArr[1];
                    } else {
                        shortAdress = fullAddressArr[0];
                    }
                    placeName =
                        place.name != fullAddressArr[0] ? placeName : "";
                }
                $("#" + id)
                    .closest(".flex-col")
                    .removeClass("has-error");
                $("#" + id)
                    .closest(".flex-col")
                    .find(".form-error-message-container")
                    .remove();
                containerDiv.find(".submit-step").removeClass("disabled");
                containerDiv.find(".submit-step").on("click");

                var addLatitude = autocomplete.getPlace().geometry.location.lat();
                var addLongtitude = autocomplete.getPlace().geometry.location.lng();

                /* var fastwayZoneData = await getFastwayZoneMethod(addLatitude, addLongtitude); 
                console.log("fastwayZoneData"); console.log(fastwayZoneData);
                fastway_sublocality = fastwayZoneData.zoneSuburb;
                fastway_postal_code = fastwayZoneData.zonePostcode; */
                // Get postcode using opencage maps service
                if(postal_code == ''){
                    async function getPostalCode() {
                        try {
                            const response = await callGetPostCode(addLatitude, addLongtitude);
                            const postalCode = response.results[0].components.postcode;
                            return postalCode; // return the postal code
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    try {
                        const postalCode = await getPostalCode(); // wait for getPostalCode to complete
                        postal_code = postalCode;
                    } catch (error) {
                        console.error(error);
                    }
                }
               
                if (postal_code === "") {
                    containerDiv.find("#address_postal_code").val("");
                    $("#" + id).closest(".flex-col").addClass("has-error");
                    var error_block ='<div class="form-error-message-container help-block"><img src="' +SITE_URL +'/images/Mismatch-Icon.svg" loading="lazy" alt="" class="error-message-img"><div class="form-error-message-text">Please enter an accurate address that includes a street name and number or place name</div></div>';
                    $("#" + id).closest(".flex-col").append(error_block);
                    containerDiv.find(".submit-step").addClass("disabled");
                    containerDiv.find(".submit-step").off("click");
                } else {
                    containerDiv
                        .find("#address")
                        .val(
                            placeName +
                                autocomplete.getPlace().formatted_address
                        );
                    containerDiv
                        .find("#address_short_address")
                        .val(placeName + shortAdress);
                    containerDiv.find("#address_postal_code").val(postal_code);
                    containerDiv.find("#address_province").val(province);
                    containerDiv.find("#address_suburb").val(suburb);
                    containerDiv.find("#address_sublocality").val(sublocality);
                    containerDiv.find("#address_city").val(city);
                    /* containerDiv.find("#address_fastway_postal_code").val(fastway_postal_code);
                    containerDiv.find("#address_fastway_sublocality").val(fastway_sublocality); */

                    containerDiv
                        .find(".flex-col .auto_additional")
                        .val("selected");

                    // REMOVE ERRORS ON SELECT
                    $("#" + id)
                        .attr("aria-invalid", "")
                        .attr("aria-describedby", "");
                    $("#" + id)
                        .closest(".flex-col")
                        .removeClass("has-error");
                    $("#" + id)
                        .closest(".flex-col")
                        .find(".form-error-message-container")
                        .remove();
                    containerDiv.find(".submit-step").removeClass("disabled");
                    containerDiv.find(".submit-step").on("click");
                    var typeId =
                        containerDiv
                            .find(".new-delivery-form-container")
                            .attr("id") == "pick-up"
                            ? "pickupAddress"
                            : "dropoff";

                    dropMarker(
                        autocomplete.getPlace().geometry.location.lat(),
                        autocomplete.getPlace().geometry.location.lng(),
                        typeId
                    );
                }
            }
        });
    }

    // DROP NEW MARKER INTO OVERLAY
    async function dropMarker(lat, lng, action) {
        if (!jQuery.isEmptyObject(markerArr)) {
            markerArr.setMap(null);
        }

        if (action == "pickupAddress") {
            var iconUrl = SITE_URL + "/images/zone-map-pin-1.svg";
        } else {
            var iconUrl = SITE_URL + "/images/Parameters-Common-Marker.svg";
        }

        markerArr = new google.maps.Marker({
            map: map,
            draggable: false,
            icon: {
                url: iconUrl, // url
                scaledSize: new google.maps.Size(30, 40), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(25, 40), // anchor
            },
            title: "",
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        });

        map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });

        afterMapFitBounds();
    }

    // MAP ZOOM IN
    function mapZoomIn() {
        var zoomLevel = map.getZoom() + 1;
        if (zoomLevel <= 22) {
            map.setZoom(zoomLevel);
        }
    }

    // MAP ZOOM OUT
    function mapZoomOut() {
        var zoomLevel = map.getZoom() - 1;
        if (zoomLevel >= 5) {
            map.setZoom(zoomLevel);
        }
    }

    // LOAD DATA ON STEP CHANGE FROM LOCAL STORAGE
    function loadData(isEdit = false, pushState = false) {
        var currentHour = new Date().getHours();
        var greetings = "";
        var index = 0;
        var containerDiv = $(document).find(".main-card-content");
        var dataObj = undefined;

        var pickup = localStorage.getItem("pickup")
            ? JSON.parse(localStorage.getItem("pickup"))
            : undefined;
        var dropoffs = localStorage.getItem("dropoff")
            ? JSON.parse(localStorage.getItem("dropoff"))
            : undefined;

        var user_name_txt = $(document).find("#greeting-text .user-name-comma");
        user_name_txt.removeClass("display-none");
        if (currentHour >= 4 && currentHour < 12) {
            greetings = "Good morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            greetings = "Good afternoon";
        } else if (currentHour >= 18 && currentHour < 23) {
            greetings = "Good evening";
        } else {
            user_name_txt.addClass("display-none");
            greetings = "Hey there night owl";
        }

        $(document).find("#greeting-text .greeting-txt").text(greetings);

        if (step == "pick-up") {
            $("body").addClass("body-map-grid");
            if (pickup) {
                dataObj = pickup;
            }
        } else if (step == "confirm-delivery") {
            $("body").removeClass("body-map-grid");
            if (pickup && dropoffs) {
                getDeliveryInfo();
                return false;
            } else {
                step = "pick-up";
            }
        } else {
            $("body").addClass("body-map-grid");
            if (dropoffs) {
                if (step != "drop-off")
                    index = step.replace("additional-drop-off-", "");

                dataObj = dropoffs[index];
            }
        }

        $("#s_page").fadeOut(100);

        if (dataObj) {
            clearDropoffForm(step, containerDiv, isEdit);

            dropMarker(
                parseFloat(dataObj.lat),
                parseFloat(dataObj.long),
                step == "pick-up" ? "pickupAddress" : "dropaddress"
            );

            containerDiv.find(".auto_additional").val("selected");
            containerDiv.find("#address_lat").val(dataObj.lat);
            containerDiv.find("#address_lang").val(dataObj.long);
            containerDiv.find("#address").val(dataObj.address);
            containerDiv
                .find("#address_short_address")
                .val(dataObj.shortAdress);
            containerDiv.find("#address_city").val(dataObj.city);
            containerDiv.find("#address_suburb").val(dataObj.suburb);
            containerDiv.find("#address_sublocality").val(dataObj.sublocality);
            containerDiv.find("#address_province").val(dataObj.province);
            containerDiv.find(".form-address-input").val(dataObj.shortAdress);
            containerDiv.find("#address_postal_code").val(dataObj.postalCode);
            containerDiv.find("#fullname").val(dataObj.fullName);
            /* containerDiv.find("#address_fastway_postal_code").val(dataObj.fastway_postal_code);
            containerDiv.find("#address_fastway_sublocality").val(dataObj.fastway_sublocality); */
            containerDiv
                .find("#contactno")
                .val($.trim(formateMobileNumber(dataObj.mobileNumber)));
            containerDiv.find("#notes").val(dataObj.notes);
            containerDiv.find("#email").val(dataObj.email);

            var addressTypeId = containerDiv
                .find(".address-type-field-container")
                .attr("data-input-id");
            var addressType =
                dataObj.addressType +
                (addressTypeId ? "-" + addressTypeId : "");

            containerDiv
                .find("#address-type-" + addressType)
                .prop("checked", true);
            containerDiv
                .find("label.address-type-btn")
                .removeClass("address-type-selected");
            containerDiv
                .find('label[for="address-type-' + addressType + '"]')
                .addClass("address-type-selected");

            containerDiv
                .find(".address-form-type")
                .removeClass("display-block")
                .addClass("display-none");
            containerDiv
                .find("#form-type-" + dataObj.addressType)
                .removeClass("display-none")
                .addClass("display-block");

            $.each(
                containerDiv.find(
                    ".address-type-field-container input.form-input[type=text]"
                ),
                function () {
                    $(this).val("");
                }
            );

            containerDiv
                .find(
                    'input[name="' +
                        dataObj.addressType +
                        '_address_type_detail"]'
                )
                .val(dataObj.addressTypeDetail);
            containerDiv
                .find(
                    'input[name="' +
                        dataObj.addressType +
                        '_address_type_detail_1"]'
                )
                .val(dataObj.addressTypeDetail1);
            containerDiv
                .find(
                    'input[name="' +
                        dataObj.addressType +
                        '_address_type_detail_2"]'
                )
                .val(dataObj.addressTypeDetail2);

            containerDiv
                .find(".new-delivery-form-container")
                .find(".form-error-message-container")
                .remove();

            var podText = [];

            if (dataObj.isPictureProof == 1) podText.push("Picture");

            if (dataObj.isSignatureProof == 1) podText.push("Signature");

            if (podText.length == 0) podText.push("No");

            containerDiv
                .find("#add_pod_btn_txt span:first")
                .text(podText.join(" & "));
            containerDiv
                .find("#add_pod_btn #signature_proof")
                .val(dataObj.isSignatureProof);
            containerDiv
                .find("#add_pod_btn #picture_proof")
                .val(dataObj.isPictureProof);

            var text = "No authority to leave";
            var selectedVal = dataObj.leaveAuthority || 0;

            if (selectedVal == "1") {
                text = "Authority to leave at the reception or security";
            } else if (selectedVal == "2") {
                text = "Authority to leave at the door";
            }

            $(document).find("#add_authority_btn_txt").text(text);
            $(document).find("#leave_authority").val(selectedVal);
        } else {
            if (!jQuery.isEmptyObject(markerArr)) {
                markerArr.setMap(null);
            }

            map.setCenter({
                lat: parseFloat(mapLat),
                lng: parseFloat(mapLong),
            });
            map.setZoom(13);

            afterMapFitBounds();

            $(document)
                .find("#add_pod_modal_container")
                .find("#signature-proof,#picture-proof")
                .removeClass("add-pod-item-selected");

            // check requested dropoff is additional dropoff
            if (step.indexOf("additional-drop-off-") != -1) {
                if (!pickup) {
                    step = "pick-up";
                } else if (!dropoffs) {
                    step = "drop-off";
                } else if (index > dropoffs.length) {
                    step = "additional-drop-off-" + dropoffs.length;
                    index = dropoffs.length;
                }
            } else if (step == "drop-off" && !pickup) {
                step = "pick-up";
            }

            clearDropoffForm(
                step,
                $(document).find(".main-card-content"),
                isEdit
            );
        }

        getShortDeliveryInfo(index);
        updateClearDataButton();

        if (!pushState) {
            history.pushState("", "", SITE_URL + "/new-request/" + step);
        }
    }

    // RESET DROPOFF FORM
    function clearDropoffForm(index, containerDiv, isEdit = false) {
        containerDiv.attr("id", index + "-div");
        containerDiv.find("form").attr("id", "frm_new_booking_" + index);
        containerDiv.find(".new-delivery-form-container").attr("id", index);
        containerDiv
            .find(
                "form input[type=text], form input[type=hidden], form textarea"
            )
            .val("");
        containerDiv.find("#add_pod_btn_txt span:first").text("No");
        containerDiv.find("input[name=current_index]").val(index);
        containerDiv
            .find(".new-delivery-form-container")
            .attr(
                "data-id",
                index.indexOf("additional-drop-off-") != -1
                    ? index.replace("additional-drop-off-", "")
                    : 0
            );

        containerDiv.find("#short-info").remove();

        containerDiv
            .find(".address-type-field-container")
            .attr({ id: index + "-form-address", "data-input-id": index });

        containerDiv
            .find(".address-type-btn")
            .removeClass("address-type-selected");
        containerDiv
            .find(".address-form-type")
            .removeClass("display-block")
            .addClass("display-none");

        $.each(containerDiv.find(".address-type-btn"), function () {
            var temp =
                "address-type-" + $(this).attr("data-type") + "-" + index;

            $(this).attr("for", temp);
            $(this)
                .find("input")
                .attr({ id: temp, name: "address_type_" + index })
                .prop("checked", false);
        });

        containerDiv
            .find(".address-type-btn[data-type=house]")
            .addClass("address-type-selected");
        containerDiv
            .find(".address-type-btn[data-type=house] input")
            .prop("checked", true);

        if (index == "pick-up") {
            containerDiv
                .find(".new-delivery-form-container")
                .removeClass("dropoff-container")
                .addClass("pickup-container");
            containerDiv
                .find(".new_delivery_google_suggestion")
                .removeClass("delivery-address-input");

            containerDiv.find(".address-label span").text("collecting");
            containerDiv
                .find(".label-change span:not(.opacity-50)")
                .text("Senders");
            containerDiv.find(".change-span").text("collection");
            containerDiv
                .find(".pickup-footer")
                .removeClass("display-none")
                .addClass("display-flex");
            containerDiv
                .find(".dropoff-footer")
                .removeClass("display-flex")
                .addClass("display-none");
            containerDiv.find("#add_pod_btn").attr("data-type", "pickup");
            containerDiv.find("#dropoff-index").text("");

            containerDiv.find("#confirm-pickup").attr("data-edit", isEdit);
        } else {
            containerDiv
                .find(".new-delivery-form-container")
                .addClass("dropoff-container")
                .removeClass("pickup-container");
            containerDiv
                .find(".new_delivery_google_suggestion")
                .addClass("delivery-address-input");

            containerDiv.find(".address-label span").text("delivering");
            containerDiv
                .find(".label-change span:not(.opacity-50)")
                .text("Receivers");
            containerDiv.find(".change-span").text("delivery");

            containerDiv
                .find(".pickup-footer")
                .addClass("display-none")
                .removeClass("display-flex");
            containerDiv
                .find(".dropoff-footer")
                .addClass("display-flex")
                .removeClass("display-none");

            var dropoffNumber =
                index.indexOf("additional-drop-off-") != -1
                    ? parseInt(index.replace("additional-drop-off-", "")) + 1
                    : "";

            if (dropoffNumber == 0) {
                containerDiv.find("#dropoff-index").text("");
            } else {
                containerDiv
                    .find("#dropoff-index")
                    .html("Drop off " + dropoffNumber + " ·&nbsp;");
            }

            containerDiv.find("#add_pod_btn").attr("data-type", "dropoff");
            containerDiv.find("#add_authority_btn #leave_authority").val(0);
            containerDiv
                .find("#add_authority_btn #add_authority_btn_txt")
                .text("No authority to leave");

            if (isEdit) {
                containerDiv
                    .find("#confirm-dropoff-additional, #prev-step")
                    .hide();
                containerDiv
                    .find("#confirm-dropoff")
                    .addClass("bor-rad-10")
                    .addClass("edit-droppoff-btn");
            } else {
                containerDiv
                    .find("#confirm-dropoff-additional, #prev-step")
                    .show();
                containerDiv
                    .find("#confirm-dropoff")
                    .removeClass("bor-rad-10")
                    .removeClass("edit-droppoff-btn");
            }
        }

        containerDiv.animate({ scrollTop: 0 });
        originalForm = containerDiv.find("form").serialize();

        $(document).find("#confirm-delivery").hide();
        $(document).find("#delivery-form").show();
    }

    // HTML SHORT DELIVERY INFO APPEND
    function getShortDeliveryInfo(index) {
        if (step != "pick-up") {
            var pickup = JSON.parse(localStorage.getItem("pickup"));

            var deliveryShortHtml =
                '<div id="short-info"><div class="nd-waypoint-container ' +
                (index > 0 ? "top" : "") +
                '"> <div class="flex-col"> <div class="nd-waypoint-pickup">Pick up · ' +
                pickup.fullName +
                '</div> <div class="text-sm-grey">' +
                getAddressDetails(
                    pickup.addressType,
                    pickup.addressTypeDetail,
                    pickup.addressTypeDetail1,
                    pickup.addressTypeDetail2
                ) +
                pickup.address +
                "</div> </div> </div>";

            dropoffs = localStorage.getItem("dropoff")
                ? JSON.parse(localStorage.getItem("dropoff"))
                : [];

            for (let i = 0; i <= dropoffs.length; i++) {
                if (i < index && dropoffs[i]) {
                    deliveryShortHtml +=
                        '<div class="nd-waypoint-container ' +
                        (index - 1 == i ? "bottom" : "middle") +
                        '"> <div class="flex-col"> <div class="nd-waypoint-dropoff">Drop off ' +
                        parseInt(i + 1) +
                        " · " +
                        dropoffs[i].fullName +
                        '</div> <div class="text-sm-grey">' +
                        getAddressDetails(
                            dropoffs[i].addressType,
                            dropoffs[i].addressTypeDetail,
                            dropoffs[i].addressTypeDetail1,
                            dropoffs[i].addressTypeDetail2
                        ) +
                        dropoffs[i].address +
                        "</div> </div> </div>";
                } else {
                    break;
                }
            }

            deliveryShortHtml += "</div>";
            $(deliveryShortHtml).insertAfter(
                $(document).find(".greeting-container")
            );
        }
    }

    function getAddressDetails(type, detail1, detail2, detail3) {
        var html = "";

        if (type == "business") {
            html +=
                detail1 +
                " · " +
                (detail2 ? detail2 + " · " : "") +
                (detail3 ? "Unit/floor: " + detail3 + " · " : "");
        } else if (type == "apartment") {
            html +=
                detail1 + " · " + (detail2 ? " Unit: " + detail2 + " · " : "");
        } else if (type == "estate") {
            html +=
                detail1 +
                " · " +
                (detail2 ? " Code: " + detail2 + " · " : "") +
                (detail3 ? detail3 + " · " : "");
        }

        return html;
    }

    function getDeliveryInfo() {
        var pickup = localStorage.getItem("pickup") || undefined;
        var dropoff = localStorage.getItem("dropoff") || undefined;

        if (pickup && dropoff) {
            step = "confirm-delivery";
            $("body").removeClass("body-map-grid");
            history.pushState(
                "",
                "",
                SITE_URL + "/new-request/confirm-delivery"
            );

            $(document).find("#delivery-form, #confirm-delivery").hide();

            $("#s_page.page").fadeIn(100);
            // $(document).find('#confirm-delivery').show();

            $("#s_page.rates").fadeIn(100, () => {
                /* $(document).find("#s_card").css("display", "flex"); */
            });
            // return false;
            var form_data = new FormData();

            form_data.append("pickup", pickup);
            form_data.append("dropoff", dropoff);
            form_data.append("title", localStorage.getItem("title") || "");
            form_data.append(
                "rateType",
                localStorage.getItem("rateType") || ""
            );
            form_data.append("rateId", localStorage.getItem("rateId") || "");
            form_data.append(
                "delivery_type",
                localStorage.getItem("delivery_type") || "outbound"
            );

            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
            });

            $.ajax({
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: "post",
                url: SITE_URL + "/new-request/get-delivery-info",
                success: function (obj) {
                    if (obj.code == 1) {
                        $(document).find("#delivery-form").hide();
                        $(document)
                            .find("#confirm-delivery")
                            .html(obj.html)
                            .show();

                        deliveryObj = obj.data;

                        $.each($(document).find(".shipment-map"), function () {
                            loadAddressMarker(
                                $(this).attr("id"),
                                $(this).attr("data-type"),
                                $(this).attr("data-lat"),
                                $(this).attr("data-long")
                            );
                        });

                        getDeliveryRates();
                        setRatesBodyHeight();

                        $("#s_page").fadeOut(100);
                    }
                },
            });
        }
    }

    //LOAD ADDRESS MAP ON EDIT FOR PICKUP AND DROPOFF
    function loadAddressMarker(id, type, lat, long) {
        const myLatLng = {
            lat: parseFloat(lat + 0.0005),
            lng: parseFloat(long),
        };

        map_details[id + "_map"] = new google.maps.Map(
            document.getElementById(id),
            {
                zoom: 14,
                center: myLatLng,
                clickableIcons: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false,
                scrollwheel: false,
                mapId: cloudMapId,
                gestureHandling: "none",
                keyboardShortcuts: false,
            }
        );

        addMarker(lat, long, type, id);
    }

    //LOAD ADDRESS MARKERS ON EDIT FOR PICKUP AND DROPOFF
    function addMarker(lat, lang, type, id) {
        if (!jQuery.isEmptyObject(map_details[type + "_marker"])) {
            map_details[id + "_marker"].setMap(null);
        }

        var iconPng = {
            url: SITE_URL + "/images/collection-map-marker.svg",
            size: new google.maps.Size(129, 57),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(64.5, 50),
        };
        if (type == "dropoff") {
            var iconPng = {
                url: SITE_URL + "/images/delivery-map-marker.svg",
                size: new google.maps.Size(119, 57),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(59.5, 50),
            };
        }

        map_details[id + "_marker"] = new google.maps.Marker({
            position: { lat: parseFloat(lat), lng: parseFloat(lang) },
            map: map_details[id + "_map"],
            icon: iconPng,
            draggable: false,
        });

        var bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: parseFloat(lat), lng: parseFloat(lang) });

        if (map_details[id + "_map"].getZoom() > 13) {
            map_details[id + "_map"].setZoom(13);
        }
    }

    // set rates div height
    function setRatesBodyHeight() {
        var ratesFooterHeight =
            $(document).find("#rates_footer")[0].offsetHeight;
        var ratesBodyCalc = `calc((100vh - 138px) - calc(${ratesFooterHeight}px + 68px))`;

        $(document)
            .find("#rates_body")
            .css("height", ratesBodyCalc)
            .css("maxHeight", "685px");
        $(document).find("#rates_card").css({ maxHeight: "800px" });
    }

    function ratesScrollPrompt() {
        $("#rates_body").animate(
            {
                scrollTop: 0,
            },
            300
        );
    }

    // purchase label center modal
    function showPurchaseCenterModal() {
        var obj = $("#purchase_modal_container");
        obj.find("#loader-div").removeClass("display-none");
        obj.find("#details-div").addClass("display-none");

        obj.find(".center-modal-heading").text(
            "Purchase " +
                (deliveryObj.rateType == "carrier" ? "labels" : "delivery")
        );
       
        obj.css("display", "flex");

        setTimeout(() => {
            obj.addClass("center-modal-container-active");
            $("#purchase_center_modal").addClass("center-modal-active");
        }, 1);

        var form_data = new FormData();
        var rateObj;

        if (deliveryObj.rateType == "vehicle") {
            rateObj = vehiclesObj[deliveryObj.rateId];
        } else if (deliveryObj.rateType == "fleet") {
            rateObj = driversObj.find(function (element) {
                return element.id == deliveryObj.rateId;
            });
        } else {
            rateObj = carriersObj.find(function (element) {
                return element.service_id == deliveryObj.rateId;
            });
        }
     
        form_data.append("rateId", deliveryObj.rateId);
        form_data.append("rateType", deliveryObj.rateType);
        form_data.append("totDropoff", deliveryObj.totDropoffs);
        form_data.append("totParcels", deliveryObj.totParcels);
        form_data.append("pickupAddress", deliveryObj.pickup.address);
        form_data.append("pickupAddressLong", deliveryObj.pickup.long);
        form_data.append("pickupAddressLat", deliveryObj.pickup.lat);
        form_data.append(
            "operatingTimes",
            JSON.stringify(deliveryObj.dayWiseOperatingTimes)
        );
        form_data.append("rateObj", JSON.stringify(rateObj));

        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });

        $.ajax({
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: "post",
            url: SITE_URL + "/new-request/get-purchase-details",
            success: function (obj) {
                if (obj.code == 1) {
                    paymentCards = obj.paymentCards;
                    mainPurchaseObj = obj.data.purchaseObj;
                    selectedRatesObj = obj.data.ratesObj;
                    selectedRateType = obj.data.rateType;
                    availableIntervals = obj.data.availableIntervals;
                    dpdLaserIntervals = obj.availableIntervals;
                    fastwayIntervals = obj.availableIntervals;
                    $(document)
                        .find("#purchase_modal_container #details-div")
                        .html(obj.html)
                        .removeClass("display-none");

                    if (selectedRateType != "carrier" && availableIntervals) {
                        setCollectionTimes(
                            availableIntervals[0],
                            moment(availableIntervals[0])
                                .format("ddd")
                                .toLowerCase(),
                            $(".dpd-dropdown").length
                        );
                    }

                    if ($(document).find(".dpd-dropdown").length > 0) {
                        var dropdownData = $(document)
                            .find(".dpd-dropdown .ship-date")
                            .first();
                        setCollectionTimesDPD(
                            dropdownData.attr("data-date"),
                            $(document).find(".dpd-dropdown")
                        );
                    }

                    if ($(document).find(".fastway-dropdown").length > 0) {
                        var dropdownData = $(document)
                            .find(".fastway-dropdown .ship-date")
                            .first();
                        setCollectionTimesFastway(
                            dropdownData.attr("data-date"),
                            $(document).find(".fastway-dropdown")
                        );
                    }

                    $(
                        "#purchase_modal_container #loader-div, #purchase_modal_container #error-div"
                    )
                        .removeClass("display-block")
                        .addClass("display-none");
                    $("#purchase_center_inner_modal").removeClass(
                        "display-none"
                    );
                } else {
                    $("#purchase_modal_container #loader-div")
                        .removeClass("display-block")
                        .addClass("display-none");
                    $("#purchase_modal_container #error-div")
                        .addClass("display-block")
                        .removeClass("display-none");
                    $("#purchase_center_inner_modal").addClass("display-none");
                }
            },
        });
    }

    // add title center modal
    function showAddTitleCenterModal() {
        $(document).find("#title-delivery").val(deliveryObj.title);

        if (!deliveryObj.title) {
            $(document).find("#save-title").addClass("btn-disabled");
        } else {
            $(document).find("#save-title").removeClass("btn-disabled");
        }

        $("#add_title_modal_container").css("display", "flex");
        setTimeout(() => {
            $("#add_title_modal_container").addClass(
                "center-modal-container-active"
            );
            $("#add_title_center_modal").addClass("center-modal-active");
        }, 1);
    }

    // delivery type center modal
    function showTypeCenterModal() {
        $("#type_modal_container").css("display", "flex");
        if (!deliveryObj.delivery_type) {
            $("#type_modal_container").removeClass("type-selected");
            $("#type_modal_container #save-delivery-type").addClass(
                "btn-disabled"
            );
        } else {
            $("#type_modal_container").addClass("type-selected");
            $("#type_modal_container #save-delivery-type").removeClass(
                "btn-disabled"
            );
            $("#type_modal_container .add-pod-item").removeClass("checked");
            $("#type_modal_container .add-pod-item .pod-item-tick").css(
                "display",
                "none"
            );
            $(
                "#type_modal_container .add-pod-item[data-value=" +
                    deliveryObj.delivery_type +
                    "]"
            ).addClass("checked");
            $("#type_modal_container .add-pod-item.checked .pod-item-tick").css(
                "display",
                "block"
            );
        }
        setTimeout(() => {
            $("#type_modal_container").addClass(
                "center-modal-container-active"
            );
            $("#type_center_modal").addClass("center-modal-active");
        }, 1);
    }

    function hideAllCenterModal(e) {
        if (e.target == this) {
            $(".center-modal-container").removeClass(
                "center-modal-container-active"
            );
            $(".center-modal").removeClass("center-modal-active");
            setTimeout(() => {
                $(".center-modal-container").css("display", "none");
            }, 120);
        }
    }

    function addDropOff() {
        step = "additional-drop-off-" + deliveryObj.dropoffs.length;
        loadData();
    }

    async function getDeliveryRates() {
        $("#noRateFound").html("");
        $("#yangoRate").html("");
        $("#dpdRate").html("");
        $("#fastwayRate").html("");
        $("#noParcel").hide();
        var pickup = localStorage.getItem("pickup") || undefined;
        var dropoff = localStorage.getItem("dropoff") || undefined;

        if (pickup && dropoff) {
            $("#rates_body_content").fadeIn(100, () => {
                $(document).find(".refresh-rates").removeClass("active");
                $(document).find("#rates_body #s_card").css("display", "none");
                $(document)
                    .find("#rates_body_content .loader-col")
                    .removeClass("display-none");
                $(document)
                    .find("#rates_body_content .rates-result-col")
                    .remove();
            });
            $(document).find("#finalise-rate-btn").prop("disabled", true);
            $(document).find("#finalise-rate-btn").addClass("unavailable");
            $(document)
                .find("#finalise-rate-btn .primary-btn-text")
                .text("Please select a rate");
            $(document)
                .find("#finalise-rate-btn .primary-btn-text")
                .click(false);
            pickup = JSON.parse(pickup);
            dropoff = JSON.parse(dropoff);

            var pickLatLng =
                parseFloat(pickup.lat) + "," + parseFloat(pickup.long);
            var lastDropLatLng;
            var extraDropLatLng = [];
            var totalDropoff = dropoff.length;
            var totVolume = 0;
            var totWeight = 0;
            var parcelAddedDropoffCounter = 0;
            var totalParcels = 0;
            
            dropoff.forEach((v, k) => {
                if (k == totalDropoff - 1) {
                    lastDropLatLng =
                        parseFloat(v.lat) + "," + parseFloat(v.long);
                } else {
                    extraDropLatLng.push({
                        location: new google.maps.LatLng(
                            parseFloat(v.lat),
                            parseFloat(v.long)
                        ),
                        stopover: true,
                    });
                }

                var cardObj = $(document).find(".card[data-key=" + k + "]");
                var parcelArr = [];
                var shipmentParcelArr = [];
                $.each(
                    cardObj.find(".parcel-form:not(.parcel-labels)"),
                    function () {
                        // FOR CARTER AND FLEET IN METERS
                        var temp = {
                            desc: $(this).find(".parcel-desc").val() || "",
                            ref: $(this).find(".parcel-ref").val() || "",
                            length:
                                parseFloat(
                                    $(this).find(".parcel-length").val() || 0
                                ) / 100, // Convert from cm to meters
                            width:
                                parseFloat(
                                    $(this).find(".parcel-width").val() || 0
                                ) / 100, // Convert from cm to meters
                            height:
                                parseFloat(
                                    $(this).find(".parcel-height").val() || 0
                                ) / 100, // Convert from cm to meters
                            weight: parseFloat(
                                $(this).find(".parcel-weight").val() || 0
                            ),
                        };

                        // FOR SHIPMENTS IN CM
                        var shipmentTemp = {
                            desc: $(this).find(".parcel-desc").val() || "",
                            ref: $(this).find(".parcel-ref").val() || "",
                            length: parseFloat(
                                $(this).find(".parcel-length").val() || 0
                            ), // No conversion needed
                            width: parseFloat(
                                $(this).find(".parcel-width").val() || 0
                            ), // No conversion needed
                            height: parseFloat(
                                $(this).find(".parcel-height").val() || 0
                            ), // No conversion needed
                            weight: parseFloat(
                                $(this).find(".parcel-weight").val() || 0
                            ),
                        };

                        // FOR CARTER AND FLEET
                        if (
                            temp.weight &&
                            temp.length &&
                            temp.height &&
                            temp.width
                        ) {
                            parcelArr.push(temp);

                            totWeight += temp.weight;
                            totVolume += temp.length * temp.width * temp.height;
                        }

                        // FOR SHIPMENTS
                        if (
                            shipmentTemp.weight &&
                            shipmentTemp.length &&
                            shipmentTemp.height &&
                            shipmentTemp.width
                        ) {
                            shipmentParcelArr.push(shipmentTemp);
                        }
                    }
                );

                // Store both parcel types in the dropoff array
                dropoff[k] = {
                    ...dropoff[k],
                    parcels: parcelArr, // For Carter and Fleet
                    shipmentParcels: shipmentParcelArr, // For Shipments
                };

                if (parcelArr.length > 0) {
                    parcelAddedDropoffCounter++;
                }

                totalParcels += parcelArr.length;
            });
            if (totalParcels >= 1) {
                $("#noParcel").hide();
            } else {
                $("#rates_body_content #carriers-list-wrapper").fadeIn(
                    100,
                    () => {
                        $(document)
                            .find("#rates_body_content .carrier-loader")
                            .addClass("display-none");
                    }
                );
                $("#yangoRate").html();
                $("#dpdRate").html("");
                $("#fastwayRate").html("");
                $("#noParcel").show();

                // $(document).find('#rates_body_content #carriers-list-wrapper .yango-rates-loader').hide();
                //$(document).find('#rates_body_content #carriers-list-wrapper .dpd-rates-loader').hide();
            }
            deliveryObj.dropoffs = dropoff;
            newDeliveryRoutePath = [];
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: pickLatLng,
                    destination: lastDropLatLng,
                    waypoints: extraDropLatLng,
                    optimizeWaypoints: false,
                    provideRouteAlternatives: false,
                    travelMode: "DRIVING",
                },
                async function (response, status) { 
                    $(document).find("#card_refresh").addClass("btn-disabled");
                    if (status == "ZERO_RESULTS") {
                        //noDataHtml = '<div id="carrier-rates" class="flex-col"> <div class="rates-label">Carriers <span class="new-label">NEW</span><a href="https://carterhq.notion.site/How-carriers-work-16c5f6839f014117848cf0c51731efcc" target="_blank" class="span-link a-right">How carriers work?</a></div><div class="card-banner"> <img src="' + SITE_URL + '/images/banner-grey-icon.svg" loading="eager" width="15" alt="" class="banner-icon mr-12"> <div class="flex-col"> <div class="text-m mb-4">Add parcel weight and dimensions</div> <div class="text-sm-grey">Please add your parcel weight and dimensions to see the available carrier rates.</div> </div> </div></div>';
                        $("#rates_body_content #carriers-list-wrapper").fadeIn(
                            100,
                            () => {
                                $(document)
                                    .find("#rates_body_content .carrier-loader")
                                    .addClass("display-none");
                            }
                        );
                        $("#noParcel").show();
                        $("#yangoRate").html();
                        $("#dpdRate").html("");
                        $("#fastwayRate").html("");
                        //$(document).find("#rates_body_content").removeClass('display-none');
                        //$(document).find('#rates_body_content').html(noDataHtml);
                        ratesScrollPrompt();
                    } else if (status === "OK") {
                        var totMeter = 0;
                        var totSecond = 0;

                        for (
                            var i = 0;
                            i < response.routes[0].legs.length;
                            i++
                        ) {
                            totMeter += parseFloat(
                                response.routes[0].legs[i].distance.value
                            );
                            totSecond +=
                                response.routes[0].legs[i].duration.value +
                                defaultStopDuration * 60;
                            etaData[i] =
                                response.routes[0].legs[i].duration.value;

                            if (i == 0) {
                                dropoff[i].totMeter = parseFloat(
                                    response.routes[0].legs[i].distance.value
                                );
                            }
                        }

                        if (dropoff.length > 1) {
                            await Promise.all(
                                dropoff.map(async (obj, i) => {
                                    if (i != 0) {
                                        await directionsService.route(
                                            {
                                                origin: pickLatLng,
                                                destination:
                                                    parseFloat(obj.lat) +
                                                    "," +
                                                    parseFloat(obj.long),
                                                waypoints: [],
                                                optimizeWaypoints: false,
                                                provideRouteAlternatives: false,
                                                travelMode: "DRIVING",
                                            },
                                            function (dirResponse, status) {
                                                if (status === "OK") {
                                                    dropoff[i].totMeter =
                                                        parseFloat(
                                                            dirResponse
                                                                .routes[0]
                                                                .legs[0]
                                                                .distance.value
                                                        );
                                                }
                                            }
                                        );
                                    }
                                })
                            );
                        }

                        // DRAW MAP LINE
                        response.routes[0].overview_path.forEach((element) => {
                            newDeliveryRoutePath.push({
                                lat: element.lat(),
                                lng: element.lng(),
                            });
                        });

                        deliveryObj.totMeter = totMeter || 0;
                        deliveryObj.totSecond = totSecond || 0;

                        localStorage.setItem(
                            "dropoff",
                            JSON.stringify(dropoff)
                        );

                        var form_data = new FormData();

                        form_data.append("pickup", JSON.stringify(pickup));
                        form_data.append("dropoff", JSON.stringify(dropoff));
                        form_data.append("totMeter", totMeter);
                        form_data.append("totSecond", totSecond);
                        form_data.append(
                            "parcelAddedDropoffCounter",
                            parcelAddedDropoffCounter
                        );
                        form_data.append("totWeight", totWeight);
                        form_data.append("totVolume", totVolume);
                        form_data.append("totParcels", totalParcels);

                        $.ajaxSetup({
                            headers: {
                                "X-CSRF-TOKEN": $(
                                    'meta[name="csrf-token"]'
                                ).attr("content"),
                            },
                        });

                        // FOR CARTER AND FLEET RATES
                        if (
                            deliveryObj.carter_delivery_order_permission ==
                            "yes"
                        ) {
                            var request = $.ajax({
                                dataType: "json",
                                cache: false,
                                async: true,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: "post",
                                url: SITE_URL + "/new-request/get-rates",
                                success: function (obj) {
                                    var carterListHtml = "";
                                    var fleetListHtml = "";
                                    var rates_container_class = "";
                                    var vehicle_rate = "";
                                    var selected_vehicle_rate = "";
                                    if (obj.code == 1) {
                                        refershRates = false;
                                        driversObj = obj.drivers;
                                        vehiclesObj = obj.vehicles;
                                        deliveryObj.totDropoffs =
                                            obj.totDropoffs;
                                        deliveryObj.totParcels = obj.totParcels;

                                        var carterListHtml = "";
                                        var fleetListHtml = "";
                                        var rates_container_class = "";
                                        var vehicle_rate = "";
                                        var selected_vehicle_rate = "";

                                        if (
                                            obj.vehicles &&
                                            Object.keys(obj.vehicles).length > 0
                                        ) {
                                            carterListHtml =
                                                '<div id="carter-rates" class="flex-col mb-18 vehicle-listing rates-result-col"> <div class="rates-label w-clearfix">Carter</div>';

                                            for (const key in obj.vehicles) {
                                                var vehicle = obj.vehicles[key];

                                                var time = moment()
                                                    .add(
                                                        vehicle.deliveryTimeMins,
                                                        "minutes"
                                                    )
                                                    .tz("Africa/Johannesburg")
                                                    .format("hh:mm A");

                                                if (
                                                    deliveryObj.rateId == key &&
                                                    deliveryObj.rateType ==
                                                        "vehicle"
                                                ) {
                                                    selected_vehicle_rate =
                                                        vehicle.className;
                                                }

                                                if (
                                                    vehicle.serviceAvailable ==
                                                    1
                                                ) {
                                                    rates_container_class =
                                                        "rates-container";
                                                    vehicle_rate =
                                                        "R " + vehicle.rate;
                                                    is_disabled = "";
                                                } else {
                                                    rates_container_class =
                                                        "rates-container-disabled";
                                                    vehicle_rate =
                                                        "Unavailable";
                                                    is_disabled = "disabled";
                                                }

                                                carterListHtml +=
                                                    '<div class="rates-li" data-mins="' +
                                                    vehicle.deliveryTimeMins +
                                                    '" data-zone-mins="' +
                                                    vehicle.time +
                                                    '"> <input type="radio" id="vehicle-' +
                                                    key +
                                                    '" value="' +
                                                    key +
                                                    '" name="fleet-driver" data-type="vehicle" ' +
                                                    (deliveryObj.rateId ==
                                                        key &&
                                                    deliveryObj.rateType ==
                                                        "vehicle"
                                                        ? "checked"
                                                        : "") +
                                                    " " +
                                                    is_disabled +
                                                    '/> <label for="vehicle-' +
                                                    key +
                                                    '" class="' +
                                                    rates_container_class +
                                                    '"> <img src="' +
                                                    SITE_URL +
                                                    "/images/" +
                                                    vehicle.className +
                                                    "-icon.svg" +
                                                    '" loading="eager" alt="" class="rates-icon" /> <div class="rates-desc"> <div class="text-m">' +
                                                    vehicle.className +
                                                    '</div> <div class="rates-sla">' +
                                                    vehicle.serviceName +
                                                    '</div> </div> <div class="rates-desc a-right"> <div class="text-m text-align-right">' +
                                                    vehicle_rate +
                                                    "</div>";

                                                if (
                                                    vehicle.serviceAvailable ==
                                                    1
                                                ) {
                                                    if (
                                                        deliveryObj.currentlyUnavailable
                                                    ) {
                                                        carterListHtml +=
                                                            '<div class="rates-sla-mask"> <div class="rates-eta schedule-later"> Schedule for later </div> </div>';
                                                    } else {
                                                        carterListHtml +=
                                                            '<div class="rates-sla-mask"> <div class="rates-eta">' +
                                                            vehicle.time +
                                                            ' mins away</div> <div class="rates-eta-1">Deliver by ' +
                                                            time +
                                                            "</div> </div>";
                                                    }
                                                } else {
                                                    carterListHtml +=
                                                        '<div class="rates-sla-mask"> <div class="rates-eta">' +
                                                        vehicle.reasonNotAvailable +
                                                        "</div></div>";
                                                }
                                                carterListHtml +=
                                                    "</div> </label> </div>";
                                            }

                                            carterListHtml += "</div></div>";
                                        }

                                        // APPEND CODE AFTER CARTER DATA IS LOADED
                                        $(document)
                                            .find(
                                                "#rates_body_content #carter-vehicle-list-wrapper"
                                            )
                                            .append(carterListHtml);
                                        //$(document).find('#rates_body_content #carter-vehicle-list-wrapper').html(carterListHtml);

                                        $(
                                            "#rates_body_content #carter-vehicle-list-wrapper"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content .carter-loader"
                                                )
                                                .addClass("display-none");
                                        });

                                        if (
                                            obj.drivers &&
                                            Object.keys(obj.drivers).length > 0
                                        ) {
                                            var selectedDriver =
                                                deliveryObj.rateType == "fleet"
                                                    ? deliveryObj.rateId
                                                    : "";

                                            var html = "";

                                            if (selectedDriver) {
                                                var driver = driversObj.find(
                                                    function (element) {
                                                        return (
                                                            element.id ==
                                                            selectedDriver
                                                        );
                                                    }
                                                );

                                                if (driver) {
                                                    if (
                                                        deliveryObj.rateType ==
                                                        "fleet"
                                                    ) {
                                                        selected_vehicle_rate =
                                                            driver.name;
                                                    }

                                                    fleetListHtml +=
                                                        '<div id="carter-rates" class="flex-col mb-18 rates-result-col "> <div class="rates-label">Fleet</div> <div class="rates-li"> <div id="fleet_btn" class="rates-container pos-relative"> <img src="' +
                                                        SITE_URL +
                                                        "/images/" +
                                                        driver.className +
                                                        '-icon.svg" loading="eager" alt="" class="rates-icon"><div class="rates-desc"><div class="text-m">' +
                                                        driver.name +
                                                        '</div><div class="rates-sla">' +
                                                        driver.className +
                                                        '</div></div><img src="' +
                                                        SITE_URL +
                                                        '/images/forward-btn-icon.svg" loading="eager" alt="" class="a-right"><img src="' +
                                                        driver.profilePhoto +
                                                        '" loading="eager" alt="" class="rates-driver-profile"></img> </div> </div></div> </div>';
                                                } else {
                                                    fleetListHtml +=
                                                        '<div id="carter-rates" class="flex-col mb-18 rates-result-col"> <div class="rates-label">Fleet</div> <div class="rates-li"> <div id="fleet_btn" class="rates-container pos-relative"><div class="fleet-icon-wrapper"><img src="' +
                                                        SITE_URL +
                                                        '/images/fleet-icon.png" loading="eager" alt="" class="rates-icon" />' +
                                                        '</div><div class="rates-desc"> <div class="text-m">Fleet</div> <div class="rates-sla">Assign your own driver</div> </div><img src="' +
                                                        SITE_URL +
                                                        '/images/forward-btn-icon.svg" loading="eager" alt="" class="a-right" /> </div></div></div> </div>';
                                                }
                                            } else {
                                                /* for (const key in obj.drivers) {

                                                var driver = obj.drivers[key];

                                                if (key < 3) {
                                                    html += '<img src="' + driver.profilePhoto + '" loading="eager" alt="" class="rates-icon" />';
                                                }
                                                else {
                                                    break;
                                                }
                                            } */

                                                fleetListHtml +=
                                                    '<div id="carter-rates" class="flex-col mb-18 rates-result-col"> <div class="rates-label">Fleet</div> <div class="rates-li"> <div id="fleet_btn" class="rates-container pos-relative"><div class="fleet-icon-wrapper"><img src="' +
                                                    SITE_URL +
                                                    '/images/fleet-icon.png" loading="eager" alt="" class="rates-icon" />' +
                                                    '</div><div class="rates-desc"> <div class="text-m">Fleet</div> <div class="rates-sla">Assign your own driver</div> </div><img src="' +
                                                    SITE_URL +
                                                    '/images/forward-btn-icon.svg" loading="eager" alt="" class="a-right" /> </div></div></div> </div>';
                                            }

                                            $(document)
                                                .find(
                                                    "#fleet_center_modal .center-modal-body"
                                                )
                                                .html(
                                                    getFleetDriverHtml(
                                                        obj.drivers
                                                    )
                                                );

                                            if (selectedDriver != "") {
                                                $(document)
                                                    .find(
                                                        "#fleet_center_modal #assign_fleet_driver"
                                                    )
                                                    .removeClass(
                                                        "btn-disabled"
                                                    );
                                            } else {
                                                $(document)
                                                    .find(
                                                        "#fleet_center_modal #assign_fleet_driver"
                                                    )
                                                    .addClass("btn-disabled");
                                            }
                                        }

                                        // APPEND CODE AFTER FLEET DATA IS LOADED
                                        $(document)
                                            .find(
                                                "#rates_body_content #fleet-vehicle-list-wrapper"
                                            )
                                            .append(fleetListHtml);
                                        //$(document).find('#rates_body_content #fleet-vehicle-list-wrapper').html(fleetListHtml);
                                        $(
                                            "#rates_body_content #fleet-vehicle-list-wrapper"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content #fleet-vehicle-list-wrapper"
                                                )
                                                .removeClass("display-none");
                                        });

                                        ratesScrollPrompt();
                                        if (
                                            deliveryObj.rateType &&
                                            deliveryObj.rateId
                                        ) {
                                            if (selected_vehicle_rate != "") {
                                                var text = "";
                                                text = selected_vehicle_rate;
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .prop("disabled", false);
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .html(
                                                        ' <div class="primary-btn-text">Select ' +
                                                            text +
                                                            "</div>"
                                                    )
                                                    .attr(
                                                        "data-type",
                                                        deliveryObj.rateType
                                                    )
                                                    .attr(
                                                        "data-id",
                                                        deliveryObj.rateId
                                                    )
                                                    .removeClass("unavailable");
                                            }
                                        }
                                    }
                                },
                            });
                        }

                        if (totalParcels <= 0) {
                            $(
                                "#rates_body_content #carriers-list-wrapper"
                            ).fadeIn(100, () => {
                                $(document)
                                    .find("#rates_body_content .carrier-loader")
                                    .addClass("display-none");
                            });
                            $("#noParcel").show();
                            $("#dpdRate").html("");
                            $("#yangoRate").html("");
                            $("#fastwayRate").html("");
                            var carrierListHtml = "";
                            //carrierListHtml += '<div id="carrier-rates" class="flex-col rates-result-col"> <div class="rates-label">Carriers <span class="new-label">NEW</span><a href="https://carterhq.notion.site/How-carriers-work-16c5f6839f014117848cf0c51731efcc" target="_blank" class="span-link a-right">How carriers work?</a></div>';

                            //carrierListHtml += '<div class="card-banner"> <img src="' + SITE_URL + '/images/banner-grey-icon.svg" loading="eager" width="15" alt="" class="banner-icon mr-12"> <div class="flex-col"> <div class="text-m mb-4">Add parcel weight and dimensions</div> <div class="text-sm-grey">Please add your parcel weight and dimensions to see the available carrier rates.</div> </div> </div>';

                            //carrierListHtml += "</div>";

                            // APPEND CODE AFTER CARRIER DATA IS LOADED
                            //$(document).find('#rates_body_content #carriers-list-wrapper').append(carrierListHtml);
                        } else {
                            $("#noParcel").hide();
                            carriersObj = [];
                            // FOR YANGO CARRIER RATES
                            var request1 = $.ajax({
                                dataType: "json",
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: "post",
                                url:
                                    SITE_URL +
                                    "/new-request/get-yango-carrier-rates",
                                success: function (obj) {
                                    if (obj.code == 1) {
                                        refershRates = false;

                                        // Remove old response results of request1 from carriersObj
                                        carriersObj = carriersObj.filter(
                                            (item) => item.carrier !== "yango"
                                        );
                                        if (obj.carriers) {
                                            carriersObj = carriersObj.concat(
                                                obj.carriers
                                            );
                                        }

                                        deliveryObj.totDropoffs =
                                            obj.totDropoffs;
                                        deliveryObj.totParcels = obj.totParcels;
                                        var selected_yango_carrier_rate = "";
                                        var carrierListHtml = "";
                                        if (totalParcels > 0) {
                                            if (
                                                obj.carriers &&
                                                Object.keys(obj.carriers)
                                                    .length > 0
                                            ) {
                                                //carrierListHtml += '<div id="carrier-rates" class="flex-col rates-result-col"> <div class="rates-label">Carriers <span class="new-label">NEW</span><a href="https://carterhq.notion.site/How-carriers-work-16c5f6839f014117848cf0c51731efcc" target="_blank" class="span-link a-right">How carriers work?</a></div>';
                                                for (const key in obj.carriers) {
                                                    var carrier =
                                                        obj.carriers[key];
                                                    if (
                                                        deliveryObj.rateId ==
                                                            carrier.service_id &&
                                                        deliveryObj.rateType ==
                                                            "carrier"
                                                    ) {
                                                        selected_yango_carrier_rate =
                                                            carrier.carrier_name +
                                                            " " +
                                                            carrier.service_name;
                                                    }
                                                    carrierListHtml +=
                                                        '<div class="rates-li"> <input type="radio" id="carrier-' +
                                                        carrier.service_id +
                                                        '" value="' +
                                                        carrier.service_id +
                                                        '" name="fleet-driver" data-type="carrier" ' +
                                                        (deliveryObj.rateId ==
                                                            carrier.service_id &&
                                                        deliveryObj.rateType ==
                                                            "carrier"
                                                            ? "checked"
                                                            : "") +
                                                        '/>  <label for="carrier-' +
                                                        carrier.service_id +
                                                        '" class="rates-container">  <img src="' +
                                                        carrier.rates_url +
                                                        '" loading="eager" alt="" class="rates-icon"> <div class="rates-desc"> <div class="text-m">' +
                                                        carrier.carrier_name +
                                                        '</div> <div class="rates-sla">' +
                                                        carrier.service_name +
                                                        '</div> </div> <div class="rates-desc a-right"> <div class="text-m text-align-right">R ' +
                                                        Number(
                                                            totalParcels *
                                                                carrier.service_cost
                                                        ).toLocaleString("en", {
                                                            minimumFractionDigits: 2,
                                                        }) +
                                                        '</div> <div class="rates-sla-mask"> <div class="rates-eta">' +
                                                        carrier.sla_text +
                                                        '</div> <div class="rates-eta-1">' +
                                                        carrier.latest_deliver_time +
                                                        "</div> </div> </div> </label> </div>";
                                                }
                                                carrierListHtml += "</div>";
                                            }
                                        }

                                        // APPEND CODE AFTER CARRIER DATA IS LOADED
                                        //$(document).find('#rates_body_content #carriers-list-wrapper .yango-rates-loader').after(carrierListHtml);
                                        $("#yangoRate").html(carrierListHtml);
                                        $(
                                            "#rates_body_content #carriers-list-wrapper .yango-rates-loader"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content .yango-rates-loader"
                                                )
                                                .addClass("display-none");
                                        });

                                        if (
                                            deliveryObj.rateType &&
                                            deliveryObj.rateId
                                        ) {
                                            if (
                                                selected_yango_carrier_rate !=
                                                ""
                                            ) {
                                                var text = "";
                                                text =
                                                    selected_yango_carrier_rate;
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .prop("disabled", false);
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .html(
                                                        ' <div class="primary-btn-text">Select ' +
                                                            text +
                                                            "</div>"
                                                    )
                                                    .attr(
                                                        "data-type",
                                                        deliveryObj.rateType
                                                    )
                                                    .attr(
                                                        "data-id",
                                                        deliveryObj.rateId
                                                    )
                                                    .removeClass("unavailable");
                                            }
                                        }
                                    } else {
                                        $(
                                            "#rates_body_content #carriers-list-wrapper .yango-rates-loader"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content .yango-rates-loader"
                                                )
                                                .addClass("display-none");
                                        });
                                    }
                                },
                            });

                            // FOR DPD CARRIER RATES
                            var request2 = $.ajax({
                                dataType: "json",
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: "post",
                                url:
                                    SITE_URL +
                                    "/new-request/get-dpd-carrier-rates",
                                success: function (obj) {
                                    var carrierListHtml = "";
                                    if (obj.code == 1) {
                                        refershRates = false;

                                        carriersObj = carriersObj.filter(
                                            (item) => item.carrier !== "dpd"
                                        );
                                        if (obj.carriers) {
                                            carriersObj = carriersObj.concat(
                                                obj.carriers
                                            );
                                        }

                                        deliveryObj.totDropoffs =
                                            obj.totDropoffs;
                                        deliveryObj.totParcels = obj.totParcels;
                                        var selected_dpd_carrier_rate = "";
                                        var carrierListHtml = "";

                                        if (totalParcels > 0) {
                                            if (
                                                obj.carriers &&
                                                Object.keys(obj.carriers)
                                                    .length > 0
                                            ) {
                                                carrierListHtml +=
                                                    '<div id="carrier-rates" class="flex-col rates-result-col">';
                                                for (const key in obj.carriers) {
                                                    var carrier =
                                                        obj.carriers[key];

                                                    if (
                                                        deliveryObj.rateId ==
                                                            carrier.service_id &&
                                                        deliveryObj.rateType ==
                                                            "carrier"
                                                    ) {
                                                        selected_dpd_carrier_rate =
                                                            carrier.carrier_name +
                                                            " " +
                                                            carrier.service_name;
                                                    }
                                                    const rateExVat = carrier.service_cost_details['service_cost_ex_vat'];
                                                    carrierListHtml +=
                                                        '<div class="rates-li"> <input type="radio" id="carrier-' +
                                                        carrier.service_id +
                                                        '" value="' +
                                                        carrier.service_id +
                                                        '" name="fleet-driver" data-type="carrier" ' +
                                                        (deliveryObj.rateId ==
                                                            carrier.service_id &&
                                                        deliveryObj.rateType ==
                                                            "carrier"
                                                            ? "checked"
                                                            : "") +
                                                        '/>  <label for="carrier-' +
                                                        carrier.service_id +
                                                        '" class="rates-container">  <img src="' +
                                                        carrier.rates_url +
                                                        '" loading="eager" alt="" class="rates-icon"> <div class="rates-desc"> <div class="text-m">' +
                                                        carrier.carrier_name +
                                                        '</div> <div class="rates-sla">' +
                                                        carrier.service_name +
                                                        '</div> </div> <div class="rates-desc a-right"> <div class="text-m text-align-right">R ' +
                                                        rateExVat.toFixed(2) +
                                                        '</div> <div class="rates-sla-mask"> <div class="rates-eta">' +
                                                        carrier.sla_text +
                                                        '</div> <div class="rates-eta-1">' +
                                                        carrier.latest_deliver_time +
                                                        "</div> </div> </div> </label> </div>";
                                                }
                                                carrierListHtml += "</div>";
                                            }
                                        }

                                        // APPEND CODE AFTER CARRIER DATA IS LOADED
                                        $("#dpdRate").html(carrierListHtml);
                                        $(
                                            "#rates_body_content #carriers-list-wrapper .dpd-rates-loader"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content .dpd-rates-loader"
                                                )
                                                .addClass("display-none");
                                        });

                                        if (
                                            deliveryObj.rateType &&
                                            deliveryObj.rateId
                                        ) {
                                            if (
                                                selected_dpd_carrier_rate != ""
                                            ) {
                                                var text = "";
                                                text =
                                                    selected_dpd_carrier_rate;
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .prop("disabled", false);
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .html(
                                                        ' <div class="primary-btn-text">Select ' +
                                                            text +
                                                            "</div>"
                                                    )
                                                    .attr(
                                                        "data-type",
                                                        deliveryObj.rateType
                                                    )
                                                    .attr(
                                                        "data-id",
                                                        deliveryObj.rateId
                                                    )
                                                    .removeClass("unavailable");
                                            }
                                        }
                                    } else {
                                        $(
                                            "#rates_body_content #carriers-list-wrapper .dpd-rates-loader"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content .dpd-rates-loader"
                                                )
                                                .addClass("display-none");
                                        });
                                    }
                                },
                            });

                            var request3 = $.ajax({
                                dataType: "json",
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form_data,
                                type: "post",
                                url:
                                    SITE_URL +
                                    "/new-request/get-fastway-carrier-rates",
                                success: function (obj) {
                                    var carrierListHtml = "";
                                    if (obj.code == 1) {
                                        refershRates = false;

                                        carriersObj = carriersObj.filter(
                                            (item) => item.carrier !== "fastway"
                                        );
                                        if (obj.carriers) {
                                            carriersObj = carriersObj.concat(
                                                obj.carriers
                                            );
                                        }

                                        deliveryObj.totDropoffs =
                                            obj.totDropoffs;
                                        deliveryObj.totParcels = obj.totParcels;
                                        var selected_dpd_carrier_rate = "";
                                        var carrierListHtml = "";

                                        if (totalParcels > 0) {
                                            if (
                                                obj.carriers &&
                                                Object.keys(obj.carriers)
                                                    .length > 0
                                            ) {
                                                carrierListHtml +=
                                                    '<div id="carrier-rates" class="flex-col rates-result-col">';
                                                for (const key in obj.carriers) {
                                                    var carrier =
                                                        obj.carriers[key];

                                                    if (
                                                        deliveryObj.rateId ==
                                                            carrier.service_id &&
                                                        deliveryObj.rateType ==
                                                            "carrier"
                                                    ) {
                                                        selected_dpd_carrier_rate =
                                                            carrier.carrier_name +
                                                            " " +
                                                            carrier.service_name;
                                                    }
                                                    const rateExVat = carrier.service_cost_details['service_cost_ex_vat'];
                                                    carrierListHtml +=
                                                        '<div class="rates-li"> <input type="radio" id="carrier-' +
                                                        carrier.service_id +
                                                        '" value="' +
                                                        carrier.service_id +
                                                        '" name="fleet-driver" data-type="carrier" ' +
                                                        (deliveryObj.rateId ==
                                                            carrier.service_id &&
                                                        deliveryObj.rateType ==
                                                            "carrier"
                                                            ? "checked"
                                                            : "") +
                                                        '/>  <label for="carrier-' +
                                                        carrier.service_id +
                                                        '" class="rates-container">  <img src="' +
                                                        carrier.rates_url +
                                                        '" loading="eager" alt="" class="rates-icon"> <div class="rates-desc"> <div class="text-m">' +
                                                        carrier.carrier_name +
                                                        '</div> <div class="rates-sla">' +
                                                        carrier.service_name +
                                                        '</div> </div> <div class="rates-desc a-right"> <div class="text-m text-align-right">R ' +
                                                        rateExVat.toFixed(2) +
                                                        '</div> <div class="rates-sla-mask"> <div class="rates-eta">' +
                                                        carrier.sla_text +
                                                        '</div> <div class="rates-eta-1">' +
                                                        carrier.latest_deliver_time +
                                                        "</div> </div> </div> </label> </div>";
                                                }
                                                carrierListHtml += "</div>";
                                            }
                                        }
                                        // APPEND CODE AFTER CARRIER DATA IS LOADED
                                        $("#fastwayRate").html(carrierListHtml);
                                        $(
                                            "#rates_body_content #carriers-list-wrapper .fastway-rates-loader"
                                        ).fadeIn(100, () => {
                                            $(document)
                                                .find(
                                                    "#rates_body_content .fastway-rates-loader"
                                                )
                                                .addClass("display-none");
                                        });

                                        if (
                                            deliveryObj.rateType &&
                                            deliveryObj.rateId
                                        ) {
                                            if (
                                                selected_dpd_carrier_rate != ""
                                            ) {
                                                var text = "";
                                                text =
                                                    selected_dpd_carrier_rate;
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .prop("disabled", false);
                                                $(document)
                                                    .find("#finalise-rate-btn")
                                                    .html(
                                                        ' <div class="primary-btn-text">Select ' +
                                                            text +
                                                            "</div>"
                                                    )
                                                    .attr(
                                                        "data-type",
                                                        deliveryObj.rateType
                                                    )
                                                    .attr(
                                                        "data-id",
                                                        deliveryObj.rateId
                                                    )
                                                    .removeClass("unavailable");
                                            }
                                        }
                                    } else { 
                                        if(!obj.carrier_disable_for_account){
                                            carrierListHtml +=
                                                '<div class="card-banner card-banner-critical"> <img src="' +
                                                SITE_URL +
                                                '/images/Missed-Drop-Delivery-Timeline.svg" loading="eager" width="15" alt="" class="banner-icon mr-12"> <div class="flex-col"> <div class="text-m mb-4">Fastway: No rates found</div> <div class="text-sm-grey">'+obj.error+'</div> </div></div>';

                                            carrierListHtml += "</div>";
                                            $("#noRateFound").html(carrierListHtml);
                                        }
                                        $(
                                            "#rates_body_content #carriers-list-wrapper .fastway-rates-loader"
                                            ).fadeIn(100, () => {
                                                $(document)
                                                    .find(
                                                        "#rates_body_content .fastway-rates-loader"
                                                    )
                                                    .addClass("display-none");
                                        }); 
                                    }
                                },
                            });
                            
                            // Run both requests simultaneously and handle the responses
                            $.when(request1, request2, request3).done(function (
                                response1,
                                response2,
                                response3
                            ) { 
                                $yango_obj = response1[0].carriers;
                                $dpd_obj = response2[0].carriers;
                                $fastway_obj = response3[0].carriers;
                                var carrierListHtml = "";
                               
                                if(response3[0].carrier_disable_for_account && response2[0].carrier_disable_for_account){
                                    
                                    carrierListHtml +=
                                        '<div class="card-banner card-banner-critical"> <img src="' +
                                        SITE_URL +
                                        '/images/Missed-Drop-Delivery-Timeline.svg" loading="eager" width="15" alt="" class="banner-icon mr-12"> <div class="flex-col"> <div class="text-m mb-4">No rates found</div> <div class="text-sm-grey">Carriers disabled for this account!</div> </div></div>';
                                    carrierListHtml += "</div>";
                                    $("#noRateFound").html(carrierListHtml);
                                    
                                    $("#rates_body_content #carriers-list-wrapper").fadeIn(100, () => {
                                        $(document).find(
                                                "#rates_body_content .carrier-loader" )
                                            .addClass("display-none");
                                    });
                                }else if(
                                    (($dpd_obj !== undefined &&
                                    $dpd_obj !== null &&
                                    $.isEmptyObject($dpd_obj) &&
                                    Object.keys($dpd_obj).length == 0) && ($fastway_obj !== undefined &&
                                    $fastway_obj !== null &&
                                    $.isEmptyObject($fastway_obj) &&
                                    Object.keys($fastway_obj).length == 0))
                                ) { 
                                    carrierListHtml +=
                                        '<div class="card-banner card-banner-critical"> <img src="' +
                                        SITE_URL +
                                        '/images/Missed-Drop-Delivery-Timeline.svg" loading="eager" width="15" alt="" class="banner-icon mr-12"> <div class="flex-col"> <div class="text-m mb-4">No rates found</div> <div class="text-sm-grey">Please review your pick up, drop off, parcel dimensions and weight before refreshing.</div> </div></div>';

                                    carrierListHtml += "</div>";
                                    $("#noRateFound").html(carrierListHtml);
                                    
                                    $("#rates_body_content #carriers-list-wrapper").fadeIn(100, () => {
                                        $(document).find(
                                                "#rates_body_content .carrier-loader" )
                                            .addClass("display-none");
                                    });
                                }
                            });
                        }
                    }

                    $.when(request, request1, request2, request3).done(function (
                        response,
                        response1,
                        response2
                    ) {
                        $(document)
                            .find("#card_refresh")
                            .removeClass("btn-disabled");
                    });
                }
            );
        }
    }

    function getFleetDriverHtml(arr) {
        var popupHtml = "";

        if (arr.length == 0) {
            popupHtml +=
                '<div class="rates-li"><div class="card-banner"><img src="' +
                SITE_URL +
                '/images/banner-grey-icon.svg" loading="eager" alt="" class="banner-icon mr-12"> <div> <div class="text-m mb-4">No driver found</div> <div class="text-sm-grey">We couldn&#x27;t find a driver under that name, please check your search for any typos and try again.</div> </div> </div></div>';
        } else {
            for (const key in arr) {
                var driver = arr[key];

                popupHtml +=
                    '<div class="rates-li">  <input type="radio" id="rates-driver-' +
                    driver.id +
                    '" value="' +
                    driver.id +
                    '" name="fleet-driver-popup" ' +
                    (deliveryObj.rateId == driver.id &&
                    deliveryObj.rateType == "fleet"
                        ? "checked"
                        : "") +
                    '  data-type="fleet" />  <label for="rates-driver-' +
                    driver.id +
                    '" class="rates-container"><img src="' +
                    SITE_URL +
                    "/images/" +
                    driver.className +
                    '-icon.svg" loading="eager" alt="" class="rates-icon"><img src="' +
                    driver.profilePhoto +
                    '" loading="eager" alt="" class="rates-driver-profile"> <div class="rates-desc"> <div class="text-m">' +
                    driver.name +
                    '</div> <div class="rates-sla">' +
                    driver.className +
                    '</div> </div> <div class="rates-desc a-right justify-center"> <div class="text-m text-align-right"> R ' +
                    driver.rate +
                    "</div> </div> </label> </div>";
            }
        }

        return popupHtml;
    }

    function setRefreshRates() {
        $("#rates_body_content").fadeOut(100, () => {
            $(document).find("#rates_body #s_card").css("display", "flex");
            $(document).find(".refresh-rates").addClass("active");
        });

        localStorage.removeItem("rateType");
        localStorage.removeItem("rateId");

        deliveryObj.rateId = "";
        deliveryObj.rateType = "";
        $(document).find("#finalise-rate-btn").prop("disabled", true);
        $(document)
            .find("#finalise-rate-btn")
            .html(' <div class="primary-btn-text">Please select a rate</div>')
            .attr("data-type", "")
            .attr("data-id", "")
            .addClass("unavailable");
    }

    // INITIALISE MAP
    function initMap(lat, lang) {
        map = new google.maps.Map(
            document.getElementById("googleMapNewDelivery"),
            {
                center: new google.maps.LatLng(lat, lang),
                zoom: 17,
                clickableIcons: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false,
                mapId: cloudMapId,
            }
        );

        map.addListener("drag", () => {
            if (markerArr) {
                $(document).find(".map-reset-bounds").show();
            }
        });

        // LOAD DATA ON PAGE RELOAD
        loadData();
    }

    // ADJUST MAP VIEW AFTER SETTING BOUNDS
    function afterMapFitBounds() {
        // console.log("afterMapFitBounds" + "::::::" + $(window).width() + "::::::::" + map.getZoom());

        if (map.getZoom() > 17) {
            map.setZoom(17);
        }

        if ($(window).width() >= 768) {
            // console.log(768);
            map.panBy(-Math.floor(map.getDiv().offsetWidth / 8), 0);
        } else {
            // console.log(7680);
            map.panBy(0, Math.floor(map.getDiv().offsetWidth / 4));
        }
    }

    function round(date, duration, method) {
        return moment(Math[method](+date / +duration) * +duration);
    }

    function setCollectionTimes(date, day) {
        var operatingTime = deliveryObj.dayWiseOperatingTimes[day];
        collectionTimes = [];

        //CHECK IF DATE IS TODAY
        if (
            moment(moment().format("YYYY-MM-DD")).isSame(date) &&
            moment() >= moment(date + " " + operatingTime.startTime)
        ) {
            var startTime = moment().add(selectedRatesObj.time, "minutes");
            startTime = round(
                startTime,
                moment.duration(15, "minutes"),
                "ceil"
            );
        } else {
            var startTime = moment(date + " " + operatingTime.startTime);
        }

        var html = "";
        var i = 0;

        if (
            selectedRateType == "vehicle" &&
            moment().isBetween(
                moment(date + " " + operatingTime.startTime),
                moment(date + " " + operatingTime.endTime)
            )
        ) {
            var temp = {
                fromMoment: "",
                toMoment: "",
                from: "",
                to: "",
                deliveryTime: moment()
                    .add(
                        parseFloat(selectedRatesObj.deliveryTimeMins) +
                            parseFloat(selectedRatesObj.time),
                        "minutes"
                    )
                    .format("hh:mm A"),
            };

            html =
                '<div class="context-menu-modal-li ship-time" data-id="' +
                i +
                '"> <div>As soon as possible</div> <div class="a-right">' +
                temp.deliveryTime +
                "</div> </div>";

            collectionTimes.push(temp);
            i++;
        }

        while (startTime < moment(date + " " + operatingTime.endTime)) {
            var endTime = startTime.clone().add(30, "minutes");

            var temp = {
                from: startTime.format("YYYY-MM-DD HH:mm"),
                to: endTime.format("YYYY-MM-DD HH:mm"),
                deliveryTime: endTime
                    .add(selectedRatesObj.deliveryTimeMins, "minutes")
                    .format("hh:mm A"),
            };

            html +=
                '<div class="context-menu-modal-li ship-time"  data-id="' +
                i +
                '"> <div>' +
                moment(temp.from).format("hh:mm") +
                " - " +
                moment(temp.to).format("hh:mm A") +
                '</div> <div class="a-right">' +
                temp.deliveryTime +
                "</div> </div>";

            collectionTimes.push(temp);
            i++;
            startTime.add(15, "minutes");
        }

        $(document).find("#collection-time-items").html(html);

        var text = "";

        if (moment(moment().format("YYYY-MM-DD")).isSame(date)) {
            text = "Today, ";
        } else if (
            moment(moment().add("1", "day").format("YYYY-MM-DD")).isSame(date)
        ) {
            text = "Tomorrow, ";
        } else {
            text = moment(date).format("dddd") + ", ";
        }

        text += moment(date).format("DD MMM");

        if (collectionTimes[0]) {
            $(document)
                .find("#ship_collect_date")
                .html(
                    text +
                        " · " +
                        (collectionTimes[0].from
                            ? moment(collectionTimes[0].from).format("hh:mm") +
                              (collectionTimes[0].to
                                  ? " - " +
                                    moment(collectionTimes[0].to).format(
                                        "hh:mm A"
                                    )
                                  : "")
                            : "As soon as possible")
                );

            $(document)
                .find("#collection-time-lbl")
                .attr("data-time", collectionTimes[0].from)
                .attr("data-id", 0)
                .html(
                    collectionTimes[0].from
                        ? moment(collectionTimes[0].from).format("hh:mm") +
                              (collectionTimes[0].to
                                  ? " - " +
                                    moment(collectionTimes[0].to).format(
                                        "hh:mm A"
                                    )
                                  : "")
                        : "As soon as possible"
                );
        }

        $(document)
            .find("#collection-date-lbl")
            .attr("data-date", date)
            .html(text);
    }

    function displayBtnLoader(obj) {
        obj.addClass("btn-p-loading").prop("disabled", true);
        obj.find(".btn-p-loader").addClass("btn-p-loader-active");
    }

    function hideBtnLoader(obj) {
        obj.removeClass("btn-p-loading").prop("disabled", false);
        obj.find(".btn-p-loader").removeClass("btn-p-loader-active");
    }

    function updateClearDataButton() {
        var formContainer = $(document).find(".new-delivery-form-container");
        var flag = false;

        $.each(
            formContainer.find("input[type=text], textarea"),
            (k, element) => {
                if ($(element).val() != "") {
                    flag = true;
                    return false;
                }
            }
        );

        if (
            !flag &&
            (formContainer.find(".address_type:checked").val() != "house" ||
                formContainer.find("#signature_proof").val() == "1" ||
                formContainer.find("#picture_proof").val() == "1" ||
                formContainer.find("#leave_authority").val() == "1")
        ) {
            flag = true;
        }

        if (flag) {
            $(document).find("#clear-dropoff").show();
        } else {
            $(document).find("#clear-dropoff").hide();
        }
    }

    function setCollectionTimesDPD(date, obj) {
        collectionTimes = [];
        var isToday = moment(moment().format("YYYY-MM-DD")).isSame(date);
        obj = obj.closest(".dpd-dropdown");

        var startTime = "00:00";
        var html = "";

        if (isToday) {
            startTime = moment().format("HH:mm");
        }

        dpdLaserIntervals.forEach((time, k) => {
            if (
                moment(date + " " + startTime) <=
                    moment(date + " " + time.start_time) ||
                k == 0
            ) {
                collectionTimes.push(time);
                html +=
                    '<div class="context-menu-modal-li ship-time no-bg"  data-id="' +
                    k +
                    '"> <div> ' +
                    time.name +
                    ' </div><div class="a-right">' +
                    moment(date + " " + time.start_time).format("hh:mm A") +
                    " - " +
                    moment(date + " " + time.end_time).format("hh:mm A") +
                    "</div> </div>";
            }
        });

        obj.find("#collection-time-items").html(html);

        var text =
            moment(date).format("dddd") + ", " + moment(date).format("DD MMM");

        obj.find("#collection-date-lbl").attr("data-date", date).html(text);

        if (collectionTimes[0]) {
            var sameDates = [];

            $.each(
                $(document).find(".dpd-dropdown #collection-date-lbl"),
                (key, element) => {
                    if (
                        $.inArray($(element).attr("data-date"), sameDates) == -1
                    ) {
                        sameDates.push($(element).attr("data-date"));
                    }
                }
            );

            if (sameDates.length == 1) {
                obj.closest(".ship-label")
                    .find("#ship_collect_date")
                    .html(
                        moment(date).format("ddd") +
                            " · " +
                            moment(date).format("DD MMM YYYY")
                    );
            } else {
                obj.closest(".ship-label")
                    .find("#ship_collect_date")
                    .html("Mixed Dates");
            }

            obj.find("#collection-time-lbl")
                .attr("data-time", collectionTimes[0].start_time)
                .attr("data-id", 0)
                .html(
                    moment(date + " " + collectionTimes[0].start_time).format(
                        "hh:mm A"
                    ) +
                        (collectionTimes[0].end_time
                            ? " - " +
                              moment(
                                  date + " " + collectionTimes[0].end_time
                              ).format("hh:mm A")
                            : "")
                );

            mainPurchaseObj["slots"] = {
                from: collectionTimes[0].start_time,
                to: collectionTimes[0].end_time,
            };
            mainPurchaseObj["date"] = date;
        }
    }

    function setCollectionTimesFastway(date, obj) {
        collectionTimes = [];
        var isToday = moment(moment().format("YYYY-MM-DD")).isSame(date);
        obj = obj.closest(".fastway-dropdown");

        var startTime = "00:00";
        var html = "";

        if (isToday) {
            startTime = moment().format("HH:mm");
        }

        fastwayIntervals.forEach((time, k) => {
                if (
                    moment(date + " " + startTime) <=
                        moment(date + " " + time.start_time) ||
                    k == 0
                ) {
                    collectionTimes.push(time);
                    html +=
                        '<div class="context-menu-modal-li ship-time no-bg"  data-id="' +
                        k +
                        '"> <div> ' +
                        time.name +
                        ' </div><div class="a-right">' +
                        moment(date + " " + time.start_time).format("hh:mm A") +
                        " - " +
                        moment(date + " " + time.end_time).format("hh:mm A") +
                        "</div> </div>";
                }
        });

        obj.find("#collection-time-items").html(html);

        var text =
            moment(date).format("dddd") + ", " + moment(date).format("DD MMM");

        obj.find("#collection-date-lbl").attr("data-date", date).html(text);

        if (collectionTimes[0]) {
            var sameDates = [];

            $.each(
                $(document).find(".fastway-dropdown #collection-date-lbl"),
                (key, element) => {
                    if (
                        $.inArray($(element).attr("data-date"), sameDates) == -1
                    ) {
                        sameDates.push($(element).attr("data-date"));
                    }
                }
            );

            if (sameDates.length == 1) {
                obj.closest(".ship-label")
                    .find("#ship_collect_date")
                    .html(
                        moment(date).format("ddd") +
                            " · " +
                            moment(date).format("DD MMM YYYY")
                    );
            } else {
                obj.closest(".ship-label")
                    .find("#ship_collect_date")
                    .html("Mixed Dates");
            }

            obj.find("#collection-time-lbl")
                .attr("data-time", collectionTimes[0].start_time)
                .attr("data-id", 0)
                .html(
                    moment(date + " " + collectionTimes[0].start_time).format(
                        "hh:mm A"
                    ) +
                        (collectionTimes[0].end_time
                            ? " - " +
                              moment(
                                  date + " " + collectionTimes[0].end_time
                              ).format("hh:mm A")
                            : "")
                );

            mainPurchaseObj["slots"] = {
                from: collectionTimes[0].start_time,
                to: collectionTimes[0].end_time,
            };
            mainPurchaseObj["date"] = date;
        }
    }
    // -----------------FUNCTIONS END-----------------

    //FOR MAP PROCESS
    if ($("#googleMapNewDelivery").length >= 1) {
        var map;
        var mapLat = js_default_lat;
        var mapLong = js_default_long;
        google.maps.event.addDomListener(
            window,
            "load",
            initMap(mapLat, mapLong)
        );
    }

    // SELECT FROM SHORTCUTS
    // FOR PICKUP AND DROP OFF
    $(document).on(
        "focus input",
        ".new_delivery_google_suggestion",
        function () {
            var that = $(this);
            var shortcutSuggestions = $(".shortcut-suggestions");

            if (that.val().trim() == "") {
                shortcutSuggestions.css("display", "block");
                setTimeout(() => {
                    shortcutSuggestions.addClass("active");
                }, 1);
            } else {
                shortcutSuggestions.css("display", "none");
                setTimeout(() => {
                    shortcutSuggestions.removeClass("active");
                }, 1);
            }
        }
    );

    // PREFILL FORM ON SELECTING SHORTCUT
    $(document).on("click", ".js-shortcut-select", async function () {
        var that = $(this);
        var type = that.closest(".new-delivery-form-container");
        var id = parseFloat(that.attr("data-id"));
        var refIndex = "";

        customerShortcutsNewDelivery.forEach(function (v, k) {
            if (v.id == id) {
                refIndex = k;
            }
        });

        if (refIndex >= 0) {
            var shortcut = customerShortcutsNewDelivery[refIndex];

            if (type.attr("id") == "pick-up") {
                var containerDiv = $(document).find(
                    ".new-delivery-form-container"
                );
                dropMarker(
                    parseFloat(shortcut.latitude),
                    parseFloat(shortcut.longitude),
                    "pickupAddress"
                );
            } else {
                var containerDiv = that
                    .closest(".main-card-content")
                    .find(".new-delivery-form-container");
                dropMarker(
                    parseFloat(shortcut.latitude),
                    parseFloat(shortcut.longitude),
                    "dropoff"
                );
            }
            var address_input_id = containerDiv
                .find(".new_delivery_google_suggestion")
                .attr("id");
            var new_delivery_form = containerDiv.closest("form");
            $("#" + address_input_id)
                .closest(".flex-col")
                .removeClass("has-error");
            $("#" + address_input_id)
                .closest(".flex-col")
                .find(".form-error-message-container")
                .remove();

            if (
                shortcut.postal_code === "" ||
                shortcut.postal_code === null ||
                (typeof shortcut.postal_code === "object" &&
                    Object.keys(shortcut.postal_code).length === 0)
            ) {
                containerDiv
                    .find(".form-address-input")
                    .val(shortcut.short_address);
                new_delivery_form.find("#address_postal_code").val("");
                $("#" + id)
                    .closest(".flex-col")
                    .addClass("has-error");
                var error_block =
                    '<div class="form-error-message-container help-block"><img src="' +
                    SITE_URL +
                    '/images/Mismatch-Icon.svg" loading="lazy" alt="" class="error-message-img"><div class="form-error-message-text">Please enter an accurate address that includes a street name and number or place name</div></div>';
                $("#" + address_input_id)
                    .closest(".flex-col")
                    .append(error_block);
                new_delivery_form.find(".submit-step").addClass("disabled");
                new_delivery_form.find(".submit-step").off("click");
            } else {
                $("#" + address_input_id)
                    .closest(".flex-col")
                    .removeClass("has-error");
                $("#" + address_input_id)
                    .closest(".flex-col")
                    .find(".form-error-message-container")
                    .remove();
                new_delivery_form.find(".submit-step").removeClass("disabled");
                new_delivery_form.find(".submit-step").on("click");

                containerDiv.find(".auto_additional").val("selected");
                containerDiv.find("#address_lat").val(shortcut.latitude);
                containerDiv.find("#address_lang").val(shortcut.longitude);
                containerDiv.find("#address").val(shortcut.address);
                containerDiv
                    .find("#address_short_address")
                    .val(shortcut.short_address);
                containerDiv
                    .find(".form-address-input")
                    .val(shortcut.short_address);
                containerDiv
                    .find("#address_postal_code")
                    .val(shortcut.postal_code);
                containerDiv
                    .find("#fullname")
                    .val(shortcut.first_name + " " + shortcut.last_name);
                containerDiv
                    .find("#contactno")
                    .val($.trim(formateMobileNumber(shortcut.mobile_number)));
                containerDiv.find("#notes").val(shortcut.note);
                containerDiv.find("#email").val(shortcut.email);
                containerDiv.find("#address_suburb").val(shortcut.province);
                containerDiv.find("#address_sublocality").val(shortcut.sublocality);
                containerDiv.find("#address_province").val(shortcut.province);
                containerDiv.find("#address_city").val(shortcut.city);

                // FOR FASTWAY ZONE
               /*  var fastway_sublocality = fastway_postal_code = '';
                try {
                    var fastwayZoneData = await getFastwayZoneMethod(shortcut.latitude, shortcut.longitude);
                    console.log("fastwayZoneData:", fastwayZoneData);
                    fastway_sublocality = fastwayZoneData.zoneSuburb;
                    fastway_postal_code = fastwayZoneData.zonePostcode;
                } catch (error) {
                    console.error("Error getting fastway zone data:", error);
                }
                containerDiv.find("#address_fastway_sublocality").val(fastway_sublocality);
                containerDiv.find("#address_fastway_postal_code").val(fastway_postal_code); */

                var addressType =
                    shortcut.address_type +
                    "-" +
                    containerDiv
                        .find(".address-type-field-container")
                        .attr("data-input-id");

                containerDiv
                    .find("#address-type-" + addressType)
                    .prop("checked", true);
                containerDiv
                    .find("label.address-type-btn")
                    .removeClass("address-type-selected");
                containerDiv
                    .find('label[for="address-type-' + addressType + '"]')
                    .addClass("address-type-selected");

                containerDiv
                    .find(".address-form-type")
                    .removeClass("display-block")
                    .addClass("display-none");
                containerDiv
                    .find("#form-type-" + shortcut.address_type)
                    .removeClass("display-none")
                    .addClass("display-block");

                $.each(
                    containerDiv.find(
                        ".address-type-field-container input.form-input[type=text]"
                    ),
                    function () {
                        $(this).val("");
                    }
                );

                containerDiv
                    .find(
                        'input[name="' +
                            shortcut.address_type +
                            '_address_type_detail"]'
                    )
                    .val(shortcut.address_type_detail);
                containerDiv
                    .find(
                        'input[name="' +
                            shortcut.address_type +
                            '_address_type_detail_1"]'
                    )
                    .val(shortcut.address_type_detail_1);
                containerDiv
                    .find(
                        'input[name="' +
                            shortcut.address_type +
                            '_address_type_detail_2"]'
                    )
                    .val(shortcut.address_type_detail_2);

                containerDiv.find(".form-error-message-container").remove();
                updateClearDataButton();
            }
        }

        $(this).closest(".shortcut-suggestions").removeClass("active").hide();
    });

    $(document).on(
        "click",
        ".close-modal-btn, .center-modal-container",
        hideAllCenterModal
    );

    //GOOGLE SUGGESTION
    if ($(".new_delivery_google_suggestion").length >= 1) {
        $(document)
            .find(".new_delivery_google_suggestion")
            .each(function () {
                newDeliveryGoogleSuggestion($(this).attr("id"));
            });
    }

    $(document).on("focusout", ".new_delivery_google_suggestion", function () {
        return false;
    });

    $(document).on("change", ".new_delivery_google_suggestion", function (e) {
        $(this).closest(".form-row-container").find(".auto_additional").val("");
    });

    $(document)
        .find(".new_delivery_google_suggestion")
        .on("input", function () {
            $(this).closest(".flex-col").find(".auto_additional").val("");
        });
    // TO RECENTER
    $(document).find(".map-reset-bounds").hide();

    // RECENTER BUTTON WORKING
    $(document).on("click", ".map-reset-bounds", function () {
        if (markerArr) {
            $(document).find(".map-reset-bounds").hide();
            var bounds = new google.maps.LatLngBounds();
            bounds.extend({
                lat: markerArr.position.lat(),
                lng: markerArr.position.lng(),
            });

            map.fitBounds(bounds);
            afterMapFitBounds();
        }
    });

    // TO ZOOM IN
    $(document).on("click", ".map-zoom-in-btn", function () {
        mapZoomIn();
    });

    // TO ZOOM OUT
    $(document).on("click", ".map-zoom-out-btn", function () {
        mapZoomOut();
    });

    // CLICK ON PROOF OF DELIVERY OPTION
    $(document).on("click", "#add_pod_btn", function () {
        var type = $(this).attr("data-type");
        $("#add_pod_modal_container").css("display", "flex");
        $("#confirm-poc-pod").attr("data-type", type);

        var podType = "delivery";
        var podUserType = "receiver";

        if (type == "pickup") {
            podType = "collection";
            podUserType = "sender";
        }

        $(document).find(".pod-type").text(podType);
        $(document).find(".pod-user-type").text(podUserType);

        if ($(this).find("#signature_proof").val() == 1)
            $(document)
                .find("#add_pod_modal_container #signature-proof")
                .addClass("add-pod-item-selected");
        else
            $(document)
                .find("#add_pod_modal_container #signature-proof")
                .removeClass("add-pod-item-selected");

        if ($(this).find("#picture_proof").val() == 1)
            $(document)
                .find("#add_pod_modal_container #picture-proof")
                .addClass("add-pod-item-selected");
        else
            $(document)
                .find("#add_pod_modal_container #picture-proof")
                .removeClass("add-pod-item-selected");

        setTimeout(() => {
            $("#add_pod_modal_container").addClass(
                "center-modal-container-active"
            );
            $("#add_pod_center_modal").addClass("center-modal-active");
        }, 1);
    });

    // CLICK ON PROOF OF DELIVERY OPTION
    $(document).on("click", "#add_pod_center_modal .add-pod-item", function () {
        $(this).toggleClass("add-pod-item-selected");
    });

    // CLICK ON AUTHORITY TO LEAVE
    $(document).on(
        "click",
        "#add_authority_center_modal .add-pod-item",
        function () {
            $(document)
                .find("#add_authority_center_modal .add-pod-item")
                .not(this)
                .removeClass("add-pod-item-selected");
            $(this).toggleClass("add-pod-item-selected");
        }
    );

    // CONFIRM BUTTON WORKING MODAL
    $(document).on("click", "#confirm-poc-pod", function () {
        var type = $(this).attr("data-type");
        var text = [];
        var containerDiv = $(document).find(
            '#add_pod_btn[data-type="' + type + '"]'
        );

        if (
            $(document)
                .find("#add_pod_modal_container #picture-proof")
                .hasClass("add-pod-item-selected")
        ) {
            text.push("Picture");
            containerDiv.find("#picture_proof").val(1);
        } else containerDiv.find("#picture_proof").val(0);

        if (
            $(document)
                .find("#add_pod_modal_container #signature-proof")
                .hasClass("add-pod-item-selected")
        ) {
            text.push("Signature");
            containerDiv.find("#signature_proof").val(1);
        } else containerDiv.find("#signature_proof").val(0);

        if (text.length == 0) text.push("No");

        containerDiv.find("#add_pod_btn_txt span:first").text(text.join(" & "));
        updateClearDataButton();

        $("#add_pod_modal_container").removeClass(
            "center-modal-container-active"
        );
        $("#add_pod_center_modal").removeClass("center-modal-active");
        setTimeout(() => {
            $("#add_pod_modal_container").css("display", "none");
        }, 120);
    });

    // CONFIRM BUTTON WORKING MODAL
    $(document).on("click", "#confirm-authority-leave", function () {
        var selected = $(document)
            .find("#add_authority_center_modal .add-pod-item-selected")
            .attr("id");

        var text = "No authority to leave";
        var selectedVal = 0;

        if (selected == "authority-reception") {
            text = "Authority to leave at the reception or security";
            selectedVal = 1;
        } else if (selected == "authority-door") {
            text = "Authority to leave at the door";
            selectedVal = 2;
        }

        $(document).find("#add_authority_btn_txt").text(text);
        $(document).find("#leave_authority").val(selectedVal);
        updateClearDataButton();
        $("#add_authority_modal_container").removeClass(
            "center-modal-container-active"
        );
        $("#add_authority_center_modal").removeClass("center-modal-active");
        setTimeout(() => {
            $("#add_authority_modal_container").css("display", "none");
        }, 120);
    });

    // ON CONFIRM STAGE
    $(document).on("click", ".submit-step:not(.disabled)", function () {
        var that = $(this);
        if (that.closest("form").valid()) {
            var containerDiv = that.closest(".main-card-content");

            var addressTypeId = containerDiv.find(".address_type").attr("name");
            var addressType = containerDiv
                .find("input[name=" + addressTypeId + "]:checked")
                .val();
            var mobileNumber = containerDiv
                .find("input[name=contactno]")
                .val()
                .replaceAll(" ", "");

            var obj = {
                address: containerDiv.find("input[name=address]").val(),
                lat: containerDiv.find("input[name=address_lat]").val(),
                long: containerDiv.find("input[name=address_lang]").val(),
                shortAdress: containerDiv
                    .find("input[name=address_short_address]")
                    .val(),
                postalCode: containerDiv
                    .find("input[name=address_postal_code]")
                    .val(),
                province: containerDiv
                    .find("input[name=address_province]")
                    .val(),
                suburb: containerDiv.find("input[name=address_suburb]").val(),
                sublocality: containerDiv.find("input[name=address_sublocality]").val(),
                /* fastwaySublocality: containerDiv.find("input[name=address_fastway_sublocality]").val(),
                fastwayPostcode: containerDiv.find("input[name=address_fastway_postal_code]").val(), */
                city: containerDiv.find("input[name=address_city]").val(),
                addressType: addressType,
                addressTypeDetail: containerDiv
                    .find("input[name=" + addressType + "_address_type_detail]")
                    .val(),
                addressTypeDetail1: containerDiv
                    .find(
                        "input[name=" + addressType + "_address_type_detail_1]"
                    )
                    .val(),
                addressTypeDetail2: containerDiv
                    .find(
                        "input[name=" + addressType + "_address_type_detail_2]"
                    )
                    .val(),
                fullName: containerDiv.find("input[name=fullname]").val(),
                mobileNumber: mobileNumber,
                email: containerDiv.find("input[name=email]").val(),
                notes: containerDiv.find("textarea[name=notes]").val(),
                isSignatureProof: containerDiv
                    .find("input[name=signature_proof]")
                    .val(),
                isPictureProof: containerDiv
                    .find("input[name=picture_proof]")
                    .val(),
                leaveAuthority: containerDiv
                    .find("input[name=leave_authority]")
                    .val(),
            };

            // STORE PICKUP OBJECT INTO LOCAL STORAGE
            if (that.attr("id") == "confirm-pickup") {
                step =
                    that.attr("data-edit") == "true"
                        ? "confirm-delivery"
                        : "drop-off";
                localStorage.setItem("pickup", JSON.stringify(obj));
                loadData();
            } else {
                var dropoff = JSON.parse(localStorage.getItem("dropoff"));
                var currentDropoffIndex = parseInt(
                    containerDiv.find(".dropoff-container").attr("data-id")
                );

                if (!dropoff) dropoff = [];
                else
                    obj.parcels = dropoff[currentDropoffIndex]
                        ? dropoff[currentDropoffIndex].parcels
                        : [];

                dropoff[currentDropoffIndex] = obj;

                localStorage.setItem("dropoff", JSON.stringify(dropoff));

                if (that.attr("id") == "confirm-dropoff-additional") {
                    step =
                        "additional-drop-off-" +
                        (parseInt(
                            containerDiv
                                .find(".dropoff-container")
                                .attr("data-id")
                        ) +
                            1);
                    loadData();
                } else {
                    getDeliveryInfo();
                }
            }
        }
    });

    // PREVIOUS BUTTON WORKING
    $(document).on("click", "#prev-step", function () {
        if (originalForm == $(document).find("form").serialize()) {
            $(document).find("#prev-step-final").trigger("click");
        } else {
            $("#alert_modal_container").css("display", "flex");

            setTimeout(() => {
                $("#alert_modal_container").addClass(
                    "center-modal-container-active"
                );
                $("#alert_center_modal").addClass("center-modal-active");
            }, 1);
        }
    });

    $(document).on("click", "#prev-step-final", function () {
        $("#alert_modal_container").removeClass(
            "center-modal-container-active"
        );
        $("#alert_center_modal").removeClass("center-modal-active");
        setTimeout(() => {
            $("#alert_modal_container").css("display", "none");
        }, 120);

        var current = 0;

        if (step == "drop-off") {
            step = "pick-up";
        } else {
            var current = step.replace("additional-drop-off-", "");
            if (parseInt(current) - 1 == 0) step = "drop-off";
            else step = "additional-drop-off-" + (parseInt(current) - 1);
        }

        var dropoffs = localStorage.getItem("dropoff")
            ? JSON.parse(localStorage.getItem("dropoff"))
            : [];

        dropoffs.splice(current, 1);

        localStorage.setItem("dropoff", JSON.stringify(dropoffs));

        loadData();
    });

    // add authority modal
    $("#add_authority_btn").on("click", function () {
        var selectedVal = $(document).find("#leave_authority").val();

        $(document)
            .find("#add_authority_center_modal .add-pod-item")
            .removeClass("add-pod-item-selected");

        if (selectedVal == 1) {
            $(document)
                .find("#authority-reception")
                .addClass("add-pod-item-selected");
        } else if (selectedVal == 2) {
            $(document)
                .find("#authority-door")
                .addClass("add-pod-item-selected");
        }

        $("#add_authority_modal_container").css("display", "flex");
        setTimeout(() => {
            $("#add_authority_modal_container").addClass(
                "center-modal-container-active"
            );
            $("#add_authority_center_modal").addClass("center-modal-active");
        }, 1);
    });

    // show timeline loader
    $(document).on("click", "#card_refresh", function () {
        getDeliveryRates();
    });

    // control
    /* $("#save_draft").on("click", (e) => {
        e.stopPropagation();
        payBtnLoader();
    }); */

    function payBtnLoader() {
        $(".btn-p").addClass("btn-p-loading");
        $(".btn-p-loader").addClass("btn-p-loader-active");
        $(".btn-p").siblings(".relative").addClass("hidden");
    }

    // purple context menu
    $(document).on("click", ".context-menu-btn-p", function (e) {
        if (e.target.closest(".context-menu-btn-p")) {
            var modalTop = $(this).next(".context-menu-modal-top");
            if (modalTop.hasClass("active")) {
                modalTop.removeClass("active");
                $(this).find(".btn-icon").css("transform", "rotate(0deg)");
                setTimeout(() => {
                    modalTop.css("display", "none");
                }, 150);
            } else {
                $(".context-menu-modal-top").removeClass("active");
                modalTop.css("display", "block");
                setTimeout(() => {
                    modalTop.addClass("active");
                    $(this)
                        .find(".btn-icon")
                        .css("transform", "rotate(180deg)");
                }, 1);
            }
        }
    });

    $(document).on("click", ".context-menu-btn", function (e) {
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
            }
        }
    });

    $(document).on("click", function (e) {
        if (!e.target.closest(".context-menu-btn")) {
            $(".context-menu-modal").removeClass("active");
            setTimeout(() => {
                $(".context-menu-modal").css("display", "none");
            }, 150);
        }

        if (!e.target.closest(".collection-date-btn")) {
            $(".collection-context-menu").removeClass("active");
            setTimeout(() => {
                $(".collection-context-menu").css("display", "none");
            }, 150);
        }
    });

    $(document).on("click", ".collection-date-btn", function (e) {
        if (e.target.closest(".collection-date-btn")) {
            if ($(this).next(".collection-context-menu").hasClass("active")) {
                $(this).next(".collection-context-menu").removeClass("active");
                setTimeout(() => {
                    $(this)
                        .next(".collection-context-menu")
                        .css("display", "none");
                }, 150);
            } else {
                $(".collection-context-menu").removeClass("active");
                $(this)
                    .next(".collection-context-menu")
                    .css("display", "block");
                $(this).next(".collection-context-menu").scrollTop(0);
                setTimeout(() => {
                    $(this).next(".collection-context-menu").addClass("active");
                }, 1);
            }
        }
    });

    document.addEventListener(
        "scroll",
        function (event) {
            if (event.target.id === "rates_body") {
                var scroll = $("#rates_body").scrollTop();
                if (scroll > 0) {
                    $(document)
                        .find(".card-sticky-header")
                        .addClass("card-sticky-header-active");
                } else {
                    $(document)
                        .find(".card-sticky-header")
                        .removeClass("card-sticky-header-active");
                }
            }
        },
        true
    );

    // key shortcuts
    $(document).keydown(function (e) {
        if ($(":input").is(":focus")) {
            return; //abort key shortcuts
        } else if (e.key && e.key.toLowerCase() == "d") {
            addDropOff();
        } else if (e.key && e.key.toLowerCase() == "/") {
            showAddTitleCenterModal();
        } else if (e.key && e.key.toLowerCase() == "t") {
            showTypeCenterModal();
        } else if (
            e.key &&
            e.key.toLowerCase() == "r" &&
            window.location.origin != "http://127.0.0.1:8000"
        ) {
            getDeliveryRates();
        }else if (e.key && e.key.toLowerCase() == "s") {
            if($(document).find("#purchase_center_modal").hasClass("center-modal-active")){
                if ($(document).find("#save_draft").length) {
                    $("#save_draft").click();
                }
            }
        }
    });

    // operating times center modal
    $(document).on(
        "click",
        "#operating_times_btn_1, #operating_times_btn_2",
        function () {
            $("#operating_times_modal_container").css("display", "flex");
            setTimeout(() => {
                $("#operating_times_modal_container").addClass(
                    "center-modal-container-active"
                );
                $("#operating_times_center_modal").addClass(
                    "center-modal-active"
                );
            }, 1);
        }
    );

    // save route center modal
    $(document).on("click", "#save_route_btn", function () {
        var rateType = deliveryObj.rateType;
        var rateId = deliveryObj.rateId;

        if (rateType && rateId) {
            if (rateType == "carrier") {
                $("#save_route_modal_container").removeClass(
                    "center-modal-container-active"
                );
                $("#save_route_center_modal").removeClass(
                    "center-modal-active"
                );
                setTimeout(() => {
                    $("#save_route_modal_container").css("display", "none");
                }, 120);

                var modal = $("#save_route_error_modal_container");

                modal.find("#no-rates-selected").addClass("hidden");
                modal.find("#carrier-rates-selected").removeClass("hidden");

                modal.css("display", "flex");
                setTimeout(() => {
                    modal.addClass("center-modal-container-active");
                    $("#save_route_error_center_modal").addClass(
                        "center-modal-active"
                    );
                }, 1);
            } else {
                $(document).find("#route_name").val("");
                $(document).find("#save_route").addClass("btn-disabled");

                $("#save_route_modal_container").css("display", "flex");
                setTimeout(() => {
                    $("#save_route_modal_container").addClass(
                        "center-modal-container-active"
                    );
                    $("#save_route_center_modal").addClass(
                        "center-modal-active"
                    );
                }, 1);
            }
        } else {
            $("#save_route_modal_container").removeClass(
                "center-modal-container-active"
            );
            $("#save_route_center_modal").removeClass("center-modal-active");
            setTimeout(() => {
                $("#save_route_modal_container").css("display", "none");
            }, 120);

            var modal = $("#save_route_error_modal_container");

            modal.find("#no-rates-selected").removeClass("hidden");
            modal.find("#carrier-rates-selected").addClass("hidden");

            modal.css("display", "flex");
            setTimeout(() => {
                modal.addClass("center-modal-container-active");
                $("#save_route_error_center_modal").addClass(
                    "center-modal-active"
                );
            }, 1);
        }
    });

    $(document).on(
        "keydown change",
        "#save_route_center_modal #route_name",
        function () {
            if ($(this).val() == "") {
                $(document).find("#save_route").addClass("btn-disabled");
            } else {
                $(document).find("#save_route").removeClass("btn-disabled");
            }
        }
    );

    // assign fleet driver center modal
    $(document).on("click", "#fleet_btn", function () {
        if (searchInput) {
            $("#fleet_center_modal .center-modal-body").html(
                getFleetDriverHtml(driversObj)
            );
            $("#fleet_center_modal #search-driver").val("");
        }

        $("#fleet_center_modal .center-modal-body").animate({ scrollTop: 0 });

        $("#fleet_modal_container").css("display", "flex");

        $(document)
            .find("input[name=fleet-driver-popup]")
            .attr("checked", false);

        if (deliveryObj.rateType == "fleet") {
            $(document)
                .find("input#rates-driver-" + deliveryObj.rateId)
                .prop("checked", true);
        }

        setTimeout(() => {
            $("#fleet_modal_container").addClass(
                "center-modal-container-active"
            );
            $("#fleet_center_modal").addClass("center-modal-active");
        }, 1);
    });

    // trigger modals
    $(document).on("click", "#add_title_btn", showAddTitleCenterModal);
    $(document).on("click", "#type_btn", showTypeCenterModal);
    $(document).on("click", "#finalise-rate-btn", showPurchaseCenterModal);
    $(document).on(
        "click",
        ".close-modal-btn, .center-modal-container",
        hideAllCenterModal
    );

    // select delivery type on click
    $(document).on("click", "#type_center_modal .add-pod-item", function () {
        $("#type_center_modal .add-pod-item .pod-item-tick").css(
            "display",
            "none"
        );
        $("#type_center_modal .add-pod-item").removeClass("checked");
        $(this).addClass("checked");
        $(this).find(".pod-item-tick").css("display", "block");
        $("#type_modal_container").addClass("type-selected");
        if ($("#type_modal_container").hasClass("type-selected")) {
            $("#type_modal_container #save-delivery-type").removeClass(
                "btn-disabled"
            );
        } else {
            $("#type_modal_container #save-delivery-type").addClass(
                "btn-disabled"
            );
        }
    });

    $(document).on(
        "keydown change",
        "#add_title_center_modal #title-delivery",
        function () {
            if ($(this).val() == "") {
                $(document).find("#save-title").addClass("btn-disabled");
            } else {
                $(document).find("#save-title").removeClass("btn-disabled");
            }
        }
    );

    $(document).on("click", "#add_title_center_modal #save-title", function () {
        var text = $(document).find("#title-delivery").val();

        localStorage.setItem("title", text);
        deliveryObj.title = text;

        $(document)
            .find("#title-text")
            .text(text || "Add a title");

        $("#add_title_modal_container").removeClass(
            "center-modal-container-active"
        );
        $("#add_title_center_modal").removeClass("center-modal-active");
        setTimeout(() => {
            $("#add_title_modal_container").css("display", "none");
        }, 120);
    });

    // confirm delivery type
    $(document).on("click", "#save-delivery-type", function () {
        var delivery_type = $(document)
            .find("#type_modal_container .add-pod-item.checked")
            .attr("data-value");

        localStorage.setItem("delivery_type", delivery_type);
        deliveryObj.delivery_type = delivery_type;

        $(document)
            .find("#type_btn .type-text")
            .text(delivery_type || "Outbound");
        $(document).find("#type_btn .btn-icon-left").removeAttr("id");
        $(document).find("#type_btn .btn-icon-left").attr("id", delivery_type);

        $("#type_modal_container").removeClass("center-modal-container-active");
        $("#type_center_modal").removeClass("center-modal-active");
        setTimeout(() => {
            $("#type_modal_container").css("display", "none");
        }, 120);
    });

    $(document).on("click", "#add-drop-off", function () {
        addDropOff();
    });

    $(document).on("click", "#back-button", function () {
        var totalDropoff = deliveryObj.dropoffs.length;
        step =
            totalDropoff == 1
                ? "drop-off"
                : "additional-drop-off-" + (totalDropoff - 1);
        loadData();
    });

    $(document).on("click", ".edit-btn", function () {
        step = $(this).closest(".card").attr("data-slug");
        loadData(true);
    });

    $(document).on("click", "#add-parcel", function () {
        var html = $(document).find("#parcel-form").html();
        var key =
            $(this).closest(".card").attr("data-key") +
            "_" +
            $(this).closest(".card").find(".parcel-form").length;

        html = html.replace(/ROW/g, key);

        $(html).insertAfter(
            $(this).closest(".add-parcel-wrapper").prev(".parcel-form")
        );

        var cardObj = $(this).closest(".card");

        if (cardObj.find(".parcel-form:not(.parcel-labels)").length >= 2) {
            $.each(cardObj.find(".parcel-form"), function () {
                $(this)
                    .find(".context-menu-modal-divider, .delete-parcel")
                    .show();
            });
        }
    });

    $(document).on("click", ".delete-parcel", function () {
        var cardObj = $(this).closest(".card");

        $(this).closest(".parcel-form").remove();

        $.each(cardObj.find(".parcel-form"), function (index) {
            if (cardObj.find(".parcel-form:not(.parcel-labels)").length == 1) {
                $(this)
                    .find(".context-menu-modal-divider, .delete-parcel")
                    .hide();
            }

            $.each($(this).find("input"), function () {
                var key = $(this)
                    .attr("data-slug")
                    .replace("SLUG", cardObj.attr("data-key") + "_" + index);
                $(this).attr({ name: key, id: key });
            });
        });

        if (!refershRates) {
            setRefreshRates();
        }
        refershRates = true;
    });

    $(document).on("click", ".reset-parcel", function () {
        $.each($(this).closest(".parcel-form").find("input"), function () {
            $(this).val("");
        });
        if (!refershRates) {
            setRefreshRates();
        }
        refershRates = true;
    });

    $(document).on("keyup change", "#search-driver", function () {
        if (searchInput != $.trim($(this).val())) {
            searchInput = $.trim($(this).val());

            const items = driversObj.filter((item) => {
                return item.name.toLowerCase().startsWith(searchInput);
            });

            $(document)
                .find("#fleet_center_modal .center-modal-body")
                .html(getFleetDriverHtml(items));
        }
    });

    $(document).on("change", "input[name=fleet-driver]", function () {
        var type = $(this).attr("data-type");
        var selectedVal = $(this).val();

        // if (type == 'fleet') {
        //     $(document).find('#fleet_center_modal #assign_fleet_driver').removeClass('btn-disabled');
        // }
        // else {
        $(document)
            .find("#fleet_center_modal #assign_fleet_driver")
            .addClass("btn-disabled");

        var text = "";

        if (type == "vehicle") {
            var vehicle = vehiclesObj[selectedVal];

            text = vehicle.className;
        } else {
            var carrier = carriersObj.find(function (element) {
                return element.service_id == selectedVal;
            });

            text = carrier.carrier_name + " " + carrier.service_name;
        }
        $(document).find("#finalise-rate-btn").prop("disabled", false);
        $(document)
            .find("#finalise-rate-btn")
            .html('<div class="primary-btn-text">Select ' + text + "</div>")
            .attr("data-type", type)
            .attr("data-id", selectedVal)
            .removeClass("unavailable");

        var driverHtml =
            '<div class="fleet-icon-wrapper"><img src="' +
            SITE_URL +
            '/images/fleet-icon.png" loading="eager" alt="" class="rates-icon" />';

        // driversObj.map((obj, k) => {
        //     if (k < 3) {
        //         driverHtml += '<img src="' + obj.profilePhoto + '" loading="eager" alt="" class="rates-icon" />';
        //     }
        //     else {
        //         return false;
        //     }
        // });

        driverHtml +=
            '</div> <div class="rates-desc"> <div class="text-m">Fleet</div> <div class="rates-sla">Assign your own driver</div> </div> <img src="' +
            SITE_URL +
            '/images/forward-btn-icon.svg" loading="eager" alt="" class="a-right">';

        $(document).find("#fleet_btn").html(driverHtml);
        // }

        localStorage.setItem("rateType", type);
        localStorage.setItem("rateId", selectedVal);
        deliveryObj.rateType = type;
        deliveryObj.rateId = selectedVal;
    });

    $(document).on("change", "input[name=fleet-driver-popup]", function () {
        $(document)
            .find("#fleet_center_modal #assign_fleet_driver")
            .removeClass("btn-disabled");
    });

    $(document).on("click", "#assign_fleet_driver", function () {
        $(document).find("input[name=fleet-driver]").attr("checked", false);

        var selectedDriver = $("input[name=fleet-driver-popup]:checked").val();

        var driver = driversObj.find(function (element) {
            return element.id == selectedDriver;
        });

        var html =
            '<img src="' +
            SITE_URL +
            "/images/" +
            driver.className +
            '-icon.svg" loading="eager" alt="" class="rates-icon"><div class="rates-desc"><div class="text-m">' +
            driver.name +
            '</div><div class="rates-sla">' +
            driver.className +
            '</div></div><img src="' +
            SITE_URL +
            '/images/forward-btn-icon.svg" loading="eager" alt="" class="a-right"><img src="' +
            driver.profilePhoto +
            '" loading="eager" alt="" class="rates-driver-profile">';

        $(document).find("#fleet_btn").html(html);
        // disable button if rates not selected
        $(document).find("#finalise-rate-btn").prop("disabled", false);
        $(document)
            .find("#finalise-rate-btn")
            .html(
                ' <div class="primary-btn-text">Select ' +
                    driver.name +
                    "</div>"
            )
            .attr("data-type", "fleet")
            .attr("data-id", selectedDriver)
            .removeClass("unavailable");

        localStorage.setItem("rateType", "fleet");
        localStorage.setItem("rateId", selectedDriver);
        deliveryObj.rateType = "fleet";
        deliveryObj.rateId = selectedDriver;

        $("#fleet_modal_container").removeClass(
            "center-modal-container-active"
        );
        $("#fleet_center_modal").removeClass("center-modal-active");
        setTimeout(() => {
            $("#fleet_modal_container").css("display", "none");
        }, 120);
    });

    $(document).on(
        "mouseover",
        ".vehicle-listing .rates-container",
        function () {
            var mins = $(this).closest(".rates-li").attr("data-mins");
            var zoneMins = $(this).closest(".rates-li").attr("data-zone-mins");

            $(this)
                .find(".rates-eta-1")
                .text(
                    "Deliver by " +
                        moment()
                            .add(
                                parseFloat(mins) + parseFloat(zoneMins),
                                "minutes"
                            )
                            .tz("Africa/Johannesburg")
                            .format("hh:mm A")
                );
        }
    );

    $(document).on("change", ".parcel-change", function () {
        if (!refershRates) {
            setRefreshRates();
        }

        refershRates = true;
    });

    //CHANGE PAYMENT CARD
    $(document).on("change", "#payment-card", function (e) {
        $(document)
            .find(".purchase-modal-card-icon")
            .removeAttr("class")
            .addClass("purchase-modal-card-icon " + paymentCards[this.value]);
    });

    //CHANGE DATE ON SELECTION OF COLLECTION DATE
    $(document).on("click", ".context-menu-modal-li.ship-date", function (e) {
        var date = $(this).attr("data-date");

        if ($(".dpd-dropdown").length > 0) {
            setCollectionTimesDPD($(this).attr("data-date"), $(this));
        }else if ($(".fastway-dropdown").length > 0) {
            setCollectionTimesFastway($(this).attr("data-date"), $(this));
        } else {
            var text =
                moment(date).format("dddd, DD MMMM YYYY") +
                " after " +
                moment(date + " " + $(this).attr("data-start")).format(
                    "hh:mm A"
                );
            $(this)
                .closest(".relative")
                .find(".collection-date-btn div")
                .text(text);

            var shipLabelDate =
                moment(date).format("ddd") +
                " · " +
                moment(date).format("DD MMM YYYY");

            mainPurchaseObj["slots"] = {
                from: $(this).attr("data-start"),
                to: $(this).attr("data-end"),
            };
            mainPurchaseObj["date"] = date;

            $("#ship_collect_date").text(shipLabelDate);
        }
    });

    //CHANGE DATE ON SELECTION OF COLLECTION DATE
    $(document).on("click", ".context-menu-modal-li.vehicle-li", function (e) {
        setCollectionTimes($(this).attr("data-date"), $(this).attr("data-day"));
    });

    $(document).on("click", ".context-menu-modal-li.ship-time", function (e) {
        var shipCollectDate = $(document)
            .find("#ship_collect_date")
            .text()
            .split("·");

        if ($(".dpd-dropdown").length == 0) {
            var text = $(this).find("div").first().text();
            $(document)
                .find("#ship_collect_date")
                .text(shipCollectDate[0] + "· " + text);
        } else if ($(".fastway-dropdown").length == 0) {
            var text = $(this).find("div").first().text();
            $(document)
                .find("#ship_collect_date")
                .text(shipCollectDate[0] + "· " + text);
        } else {
            var text = $(this).find("div").last().text();

            var times = collectionTimes[$(this).attr("data-id")];
            mainPurchaseObj["slots"] = {
                from: times.start_time,
                to: times.end_time,
            };
        }

        $(this)
            .closest(".relative")
            .find("#collection-time-lbl")
            .attr("data-id", $(this).attr("data-id"))
            .text(text);
    });

    $(document).on("click", "#submit_new_request, #save_draft, #save_shipment_btn", function (e) {
        var that = $(this);
        //displayBtnLoader(that);
        var rateType = deliveryObj.rateType;
        var isSaveShipment = false;
        if(that.attr("id") == 'save_shipment_btn'){
            isSaveShipment = true;
            if ((rateType != null && rateType.length > 0) && (deliveryObj.rateType == "vehicle" || deliveryObj.rateType == "fleet")) {
                openShipmentErrorModel();
                e.preventDefault();
                return false;
            }
        }else{
            payBtnLoader();
        }
        
        if (selectedRateType == "carrier" || isSaveShipment) {
            if(isSaveShipment){
                var dropoff = localStorage.getItem("dropoff") || undefined;
                dropoff = JSON.parse(dropoff);
                    
                dropoff.forEach((v, k) => {
                    var cardObj = $(document).find(".card[data-key=" + k + "]");
                    var parcelArr = [];
                    var shipmentParcelArr = [];
                    $.each(
                        cardObj.find(".parcel-form:not(.parcel-labels)"),
                        function () {
                            // FOR SHIPMENTS IN CM
                            var shipmentTemp = {
                                desc: $(this).find(".parcel-desc").val() || "",
                                ref: $(this).find(".parcel-ref").val() || "",
                                length: parseFloat(
                                    $(this).find(".parcel-length").val() || 0
                                ), // No conversion needed
                                width: parseFloat(
                                    $(this).find(".parcel-width").val() || 0
                                ), // No conversion needed
                                height: parseFloat(
                                    $(this).find(".parcel-height").val() || 0
                                ), // No conversion needed
                                weight: parseFloat(
                                    $(this).find(".parcel-weight").val() || 0
                                ),
                            };
                            
                            // FOR SHIPMENTS
                            if (
                                shipmentTemp.weight &&
                                shipmentTemp.length &&
                                shipmentTemp.height &&
                                shipmentTemp.width
                            ) {
                                shipmentParcelArr.push(shipmentTemp);
                            }
                        }
                    );

                    // Store both parcel types in the dropoff array
                    dropoff[k] = {
                        ...dropoff[k],
                        shipmentParcels: shipmentParcelArr, // For Shipments
                    };
                });
                deliveryObj.dropoffs = dropoff;
            }else{
                $(document).find("#details-div #error-block").remove();
                $(document).find(".fixed-overlay").show();
            }
            
            var form_data = new FormData();
            form_data.append("deliveryObj", JSON.stringify(deliveryObj));
            form_data.append("selectedDate", JSON.stringify(mainPurchaseObj));
            form_data.append("total", selectedRatesObj ? selectedRatesObj.service_cost : 0);
            form_data.append("action", that.attr("data-action"));
            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
            });

            $.ajax({
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: "post",
                url: SITE_URL + "/new-request/submit-shipment",
                success: function (obj) {
                    $(document).find(".fixed-overlay").hide();
                    if (obj.code == 3) {
                        localStorage.clear();
                        localStorage.setItem("response", JSON.stringify(obj));
                        window.location.href = SITE_URL + "/shipments";
                    }else if(obj.code == 4){
                        window.location.href = SITE_URL + "/shipments";
                    } else {
                        hideBtnLoader(that);
                        var html =
                            '<div class="card-banner card-banner-critical" id="error-block"> <img src="' +
                            SITE_URL +
                            '/images/Missed-Drop-Delivery-Timeline.svg" loading="eager" width="15" alt="" class="banner-icon mr-12"> <div class="flex-col"> <div class="text-m mb-4">Error(s)</div> <div class="text-sm-grey" id="error-text"> ' +
                            obj.errors;

                        if (obj.errArr.length > 0) {
                            html += "<ul>";

                            obj.errArr.map((error) => {
                                html += "<li>" + error + "</li>";
                            });

                            html += "</ul>";
                        }

                        html += " </div> </div> </div>";

                        $(html).insertBefore(
                            $(document).find("#details-div #carrier")
                        );
                    }
                },
            });
        } else {
            $(document).find(".fixed-overlay").show();
            var pickupData = deliveryObj.pickup;
            var etaArr = [etaData["pickup"] || 0];
            var stopDurationArr = [0];
            var selectedTime = $("#collection-time-lbl").attr("data-id");
            var selectedCollectionTime = collectionTimes[selectedTime];

            if (selectedCollectionTime && selectedCollectionTime.from) {
                selectedTime = selectedCollectionTime.from;
            } else {
                selectedTime = moment().format("YYYY-MM-DD HH:mm");
            }

            var requestTime = moment(selectedTime).valueOf();

            var dropOffEta = requestTime;
            var parcelArray = [];
            var selectedCardId = $(document).find("#payment-card").val();

            var pickup = {
                addressType: pickupData.addressType,
                addressTypeDetail: pickupData.addressTypeDetail || "",
                addressTypeDetail1: pickupData.addressTypeDetail1 || "",
                addressTypeDetail2: pickupData.addressTypeDetail2 || "",
                deliverToReception: parseInt(pickupData.leaveAuthority || 0),
                address: pickupData.address,
                hash: "testtest",
                importedAddress: pickupData.address,
                shortAddress: pickupData.shortAdress,
                name: pickupData.fullName,
                location: new firebase.firestore.GeoPoint(
                    parseFloat(pickupData.lat),
                    parseFloat(pickupData.long)
                ),
                mobileNumber: pickupData.mobileNumber,
                note: pickupData.notes,
                order: parseInt(0),
                orderId: "",
                plannedEta: requestTime
                    ? moment(requestTime).tz("Africa/Johannesburg").valueOf()
                    : "",
                postalCode: pickupData.postalCode,
                email: pickupData.email || "",
                stopDuration: parseInt(defaultStopDuration),
                eta: parseInt(0),
                isValid: "valid",
                type: "pickup",
                arrivalTime: parseInt(0),
                arrivedTime: parseInt(0),
                status: "pending",
                skipReason: parseInt(0),
                otherAttemptedReason: "",
                completedBy: "",
                completedTime: parseInt(0),
                podPictureRequired: parseInt(pickupData.isSignatureProof || 0),
                podSignRequired: parseInt(pickupData.isPictureProof || 0),
                podPersonType: "",
                podPersonName: "",
                podPersonRelation: "",
                podPersonContactNo: "",
                driverComment: "",
                pictureProofFiles: "",
                signatureProofFiles: "",
                dropoffId: 0,
            };

            var deliveryPoints = [pickup];

            deliveryObj.dropoffs.map((dropoff, k) => {
                etaArr.push(etaData[k] || 0);
                stopDurationArr.push(defaultStopDuration);

                dropOffEta = dropOffEta
                    ? moment(dropOffEta)
                          .add(
                              etaArr[k + 1] + stopDurationArr[k] * 60,
                              "seconds"
                          )
                          .tz("Africa/Johannesburg")
                    : 0;

                var tempArr = {
                    addressType: dropoff.addressType,
                    addressTypeDetail: dropoff.addressTypeDetail || "",
                    addressTypeDetail1: dropoff.addressTypeDetail1 || "",
                    addressTypeDetail2: dropoff.addressTypeDetail2 || "",
                    deliverToReception: parseInt(dropoff.leaveAuthority || 0),
                    address: dropoff.address,
                    hash: "testtest",
                    importedAddress: dropoff.address,
                    shortAddress: dropoff.shortAdress,
                    name: dropoff.fullName,
                    location: new firebase.firestore.GeoPoint(
                        parseFloat(dropoff.lat),
                        parseFloat(dropoff.long)
                    ),
                    mobileNumber: dropoff.mobileNumber,
                    note: dropoff.notes,
                    order: parseInt(k),
                    orderId: "",
                    plannedEta: parseInt(dropOffEta.valueOf()),
                    postalCode: dropoff.postalCode || "",
                    email: dropoff.email || "",
                    eta: parseInt(etaData[k] || 0),
                    isValid: "valid",
                    type: "dropoff",
                    arrivalTime: parseInt(0),
                    arrivedTime: parseInt(0),
                    status: "pending",
                    skipReason: parseInt(0),
                    otherAttemptedReason: "",
                    completedBy: "",
                    completedTime: parseInt(0),
                    stopDuration: defaultStopDuration,
                    podPictureRequired: parseInt(dropoff.isSignatureProof || 0),
                    podSignRequired: parseInt(dropoff.isPictureProof || 0),
                    podPersonType: "",
                    podPersonName: "",
                    podPersonRelation: "",
                    podPersonContactNo: "",
                    driverComment: "",
                    pictureProofFiles: "",
                    signatureProofFiles: "",
                };

                deliveryPoints.push(tempArr);

                parcelArray.push(dropoff.parcels);
            });

            var rideObj = {
                noOfHelper: 0,
                estimatedPrice:
                    selectedRateType == "fleet"
                        ? parseFloat(selectedRatesObj.estimatedPrice)
                        : parseFloat(selectedRatesObj.rate || 0),
                finalHelperAmount: parseFloat(0),
                passengerFireStoreId: passengerFirestoreId,
                passengerId: parseInt(passengerId),
                requestFrom: "web",
                requestTime: parseFloat(requestTime),
                requestTimeEnd: parseFloat(0),
                rideDistance: parseInt(deliveryObj.totMeter),
                rideDuration: parseInt(deliveryObj.totSecond),
                rideStatus:
                    selectedRateType == "fleet" ? "assigned" : "scheduled",
                reqDriverFireStoreId:
                    selectedRateType == "fleet"
                        ? selectedRatesObj.firebaseId
                        : "",
                driverFireStoreId: "",
                rideId: "",
                acceptedTime: parseInt(0),
                driverPaidPayment: parseFloat(0),
                isReturnRoute: parseInt(0),
                lockLast: parseInt(0),
                paidAmount: parseFloat(0),
                totalNoOfDeliveryPoint: deliveryPoints.length - 1,
                onGoingDeliveryPointId: "",
                cancelledTime: parseInt(0),
                cancelledBy: "",
                cancelledReason: parseInt(0),
                cancelledLocation: "",
                cancelledHash: "",
            };

            var updatedRideObj;

            db.collection("ride")
                .add(rideObj)
                .then(async (docRef) => {
                    generatedRide = docRef.id;

                    var firestoreIds = {};
                    await Promise.all(
                        deliveryPoints.map(async (v, k) => {
                            await db
                                .collection("ride")
                                .doc(generatedRide)
                                .collection("deliveryPoints")
                                .add(v)
                                .then((doc) => {
                                    firestoreIds[k] = doc.id;
                                });
                        })
                    );

                    deliveryPoints.forEach((v, k) => {
                        v.fireStoreId = firestoreIds[k];
                        if (v.type == "dropoff") {
                            v.parcels = parcelArray[v.order];
                        }
                    });

                    var tripPath =
                        google.maps.geometry.encoding.encodePath(
                            newDeliveryRoutePath
                        );

                    updatedRideObj = jQuery.extend(
                        true,
                        {},
                        {
                            ...rideObj,
                            dropOffLocations: [...deliveryPoints],
                            routePath: tripPath,
                        }
                    );

                    var form_data = new FormData();

                    form_data.append("generatedRide", generatedRide);
                    form_data.append(
                        "driver_id",
                        selectedRateType == "fleet" ? selectedRatesObj.id : ""
                    );
                    form_data.append(
                        "vehicle_class",
                        selectedRateType == "fleet"
                            ? selectedRatesObj.class
                            : selectedRatesObj.class
                    );
                    form_data.append("rideObj", JSON.stringify(updatedRideObj));
                    form_data.append("card_id", selectedCardId);

                    $.ajaxSetup({
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                    });
                    $.ajax({
                        dataType: "json",
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: form_data,
                        type: "post",
                        url: SITE_URL + "/new-request/schedule-request",
                        success: function (obj) {
                            hideBtnLoader($(this));
                            $(document).find(".fixed-overlay").hide();
                            if (obj.code == 1) {
                                localStorage.clear();
                                location.href = SITE_URL + "/scheduled/";
                            } else {
                                $("#purchase_modal_container").removeClass(
                                    "center-modal-container-active"
                                );
                                $("#purchase_center_modal").removeClass(
                                    "center-modal-active"
                                );
                                setTimeout(() => {
                                    $("#purchase_modal_container").css(
                                        "display",
                                        "none"
                                    );
                                }, 120);
                            }
                        },
                    });
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                    // that.text('Submit');
                    $(document).find("#btn-request").empty();
                    $(document).find("#btn-request").append(currentButtonHTML);
                    that.prop("disabled", false);
                });
        }
    });

    $(document).on(
        "click",
        "#save_route_center_modal #save_route",
        function () {
            var rateType = deliveryObj.rateType;
            var rateId = deliveryObj.rateId;
            var routeName = $(this).closest('#save_route_center_modal').find("#route_name").val();
            if (rateType && rateId) {
                displayBtnLoader($(this));

                var pickupData = deliveryObj.pickup;

                if (deliveryObj.rateType == "vehicle") {
                    rateObj = vehiclesObj[deliveryObj.rateId];
                } else if (deliveryObj.rateType == "fleet") {
                    rateObj = driversObj.find(function (element) {
                        return element.id == deliveryObj.rateId;
                    });
                }

                var pickupData = deliveryObj.pickup;

                var pickup = {
                    addressType: pickupData.addressType,
                    addressTypeDetail: pickupData.addressTypeDetail || "",
                    addressTypeDetail1: pickupData.addressTypeDetail1 || "",
                    addressTypeDetail2: pickupData.addressTypeDetail2 || "",
                    deliverToReception: parseInt(pickupData.leaveAuthority),
                    address: pickupData.address,
                    hash: "testtest",
                    importedAddress: pickupData.address,
                    shortAddress: pickupData.shortAdress,
                    name: pickupData.fullName,
                    location: new firebase.firestore.GeoPoint(
                        parseFloat(pickupData.lat),
                        parseFloat(pickupData.long)
                    ),
                    mobileNumber: pickupData.mobileNumber,
                    note: pickupData.notes,
                    order: parseInt(0),
                    orderId: "",
                    plannedEta: "",
                    postalCode: pickupData.postalCode,
                    email: pickupData.email || "",
                    stopDuration: parseInt(defaultStopDuration),
                    eta: parseInt(0),
                    isValid: "valid",
                    type: "pickup",
                    arrivalTime: parseInt(0),
                    arrivedTime: parseInt(0),
                    status: "pending",
                    skipReason: parseInt(0),
                    otherAttemptedReason: "",
                    completedBy: "",
                    completedTime: parseInt(0),
                    podPictureRequired: parseInt(
                        pickupData.isSignatureProof || 0
                    ),
                    podSignRequired: parseInt(pickupData.isPictureProof || 0),
                    podPersonType: "",
                    podPersonName: "",
                    podPersonRelation: "",
                    podPersonContactNo: "",
                    driverComment: "",
                    pictureProofFiles: "",
                    signatureProofFiles: "",
                    dropoffId: 0,
                };

                var deliveryPoints = [pickup];

                deliveryObj.dropoffs.map((dropoff, k) => {
                    var tempArr = {
                        addressType: dropoff.addressType || 'house',
                        addressTypeDetail: dropoff.addressTypeDetail || "",
                        addressTypeDetail1: dropoff.addressTypeDetail1 || "",
                        addressTypeDetail2: dropoff.addressTypeDetail2 || "",
                        deliverToReception: parseInt(
                            dropoff.leaveAuthority || 0
                        ),
                        address: dropoff.address,
                        hash: "testtest",
                        importedAddress: dropoff.address,
                        shortAddress: dropoff.shortAdress,
                        name: dropoff.fullName,
                        location: new firebase.firestore.GeoPoint(
                            parseFloat(dropoff.lat),
                            parseFloat(dropoff.long)
                        ),
                        mobileNumber: dropoff.mobileNumber,
                        note: dropoff.notes,
                        order: parseInt(k),
                        orderId: "",
                        plannedEta: "",
                        postalCode: dropoff.postalCode || "",
                        email: dropoff.email || "",
                        eta: parseInt(etaData[k] || 0),
                        isValid: "valid",
                        type: "dropoff",
                        arrivalTime: parseInt(0),
                        arrivedTime: parseInt(0),
                        status: "pending",
                        skipReason: parseInt(0),
                        otherAttemptedReason: "",
                        completedBy: "",
                        completedTime: parseInt(0),
                        stopDuration: defaultStopDuration,
                        podPictureRequired: parseInt(
                            dropoff.isSignatureProof || 0
                        ),
                        podSignRequired: parseInt(dropoff.isPictureProof || 0),
                        podPersonType: "",
                        podPersonName: "",
                        podPersonRelation: "",
                        podPersonContactNo: "",
                        driverComment: "",
                        pictureProofFiles: "",
                        signatureProofFiles: "",
                    };

                    deliveryPoints.push(tempArr);
                });

                var rideObj = {
                    tripName : routeName || '',
                    noOfHelper: 0,
                    estimatedPrice: parseFloat(rateObj.estimatedPrice || 0),
                    finalHelperAmount: parseFloat(0),
                    passengerFireStoreId: passengerFirestoreId,
                    passengerId: parseInt(passengerId),
                    requestFrom: "web",
                    requestTime: parseFloat(0),
                    requestTimeEnd: parseFloat(0),
                    rideDistance: parseInt(deliveryObj.totMeter),
                    rideDuration: parseInt(deliveryObj.totSecond),
                    /* rideStatus: rateType == "fleet" ? "assigned" : "scheduled", */
                    rideStatus: "saved",
                    reqDriverFireStoreId:
                        rateType == "fleet" ? rateObj.firebaseId : "",
                    driverFireStoreId: "",
                    rideId: "",
                    acceptedTime: parseInt(0),
                    driverPaidPayment: parseFloat(0),
                    isReturnRoute: parseInt(0),
                    lockLast: parseInt(0),
                    paidAmount: parseFloat(0),
                    totalNoOfDeliveryPoint: deliveryPoints.length - 1,
                    onGoingDeliveryPointId: "",
                    cancelledTime: parseInt(0),
                    cancelledBy: "",
                    cancelledReason: parseInt(0),
                    cancelledLocation: "",
                    cancelledHash: "",
                };

                var updatedRideObj;

                db.collection("ride")
                    .add(rideObj)
                    .then(async (docRef) => {
                        generatedRide = docRef.id;

                        var firestoreIds = {};
                        await Promise.all(
                            deliveryPoints.map(async (v, k) => {
                                await db
                                    .collection("ride")
                                    .doc(generatedRide)
                                    .collection("deliveryPoints")
                                    .add(v)
                                    .then((doc) => {
                                        firestoreIds[k] = doc.id;
                                    });
                            })
                        );

                        deliveryPoints.forEach((v, k) => {
                            v.fireStoreId = firestoreIds[k];
                        });

                        var tripPath =
                            google.maps.geometry.encoding.encodePath(
                                newDeliveryRoutePath
                            );

                        updatedRideObj = jQuery.extend(
                            true,
                            {},
                            {
                                ...rideObj,
                                dropOffLocations: [...deliveryPoints],
                                routePath: tripPath,
                            }
                        );

                        var form_data = new FormData();

                        form_data.append("generatedRide", generatedRide);
                        form_data.append(
                            "driver_id",
                            rateType == "fleet" ? rateObj.id : ""
                        );
                        form_data.append(
                            "vehicle_class",
                            rateType == "fleet" ? rateObj.class : rateObj.class
                        );
                        form_data.append(
                            "rideObj",
                            JSON.stringify(updatedRideObj)
                        );
                        $.ajaxSetup({
                            headers: {
                                "X-CSRF-TOKEN": $(
                                    'meta[name="csrf-token"]'
                                ).attr("content"),
                            },
                        });
                        $.ajax({
                            dataType: "json",
                            cache: false,
                            contentType: false,
                            processData: false,
                            data: form_data,
                            type: "post",
                            url: SITE_URL + "/new-request/save-request",
                            success: function (obj) {
                                hideBtnLoader($(this));
                                if (obj.code == 1) {
                                    localStorage.clear();
                                    location.href = SITE_URL + "/saved/";
                                } else {
                                    $(
                                        "#save_route_modal_container"
                                    ).removeClass(
                                        "center-modal-container-active"
                                    );
                                    $("#save_route_center_modal").removeClass(
                                        "center-modal-active"
                                    );
                                    setTimeout(() => {
                                        $("#save_route_modal_container").css(
                                            "display",
                                            "none"
                                        );
                                    }, 120);
                                }
                            },
                        });
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                        // that.text('Submit');
                        $(document).find("#btn-request").empty();
                        $(document)
                            .find("#btn-request")
                            .append(currentButtonHTML);
                        that.prop("disabled", false);
                    });
            }
        }
    );

    $(document).on("click", "#clear-dropoff", function () {
        var formContainer = $(this).closest(".new-delivery-form-container");

        $.each(
            formContainer.find("input[type=text], textarea"),
            (k, element) => {
                $(element).val("");
            }
        );

        $.each(
            formContainer.find("input[type=radio], input[type=checked]"),
            (k, element) => {
                $(element).attr("checked", false);
            }
        );

        formContainer
            .find(
                "input[name=auto_additional], input[name=address_lat], input[name=address_lang], input[name=address], input[name=address_short_address], input[name=address_postal_code], input[name=address_province], input[name=address_suburb],input[name=address_sublocality], input[name=address_fastway_sublocality],input[name=address_fastway_postal_code],input[name=address_city], input[name=signature_proof], input[name=picture_proof], input[name=leave_authority]"
            )
            .val("");

        formContainer
            .find(".address-type-btn")
            .removeClass("address-type-selected");
        formContainer
            .find(".address-type-btn[data-type=house]")
            .addClass("address-type-selected");
        formContainer
            .find(".address-form-type")
            .addClass("display-none")
            .removeClass("display-block");

        formContainer
            .find("#add_pod_btn #add_pod_btn_txt span:not(.change-span)")
            .text("No");
        formContainer.find(".address_type[value=house]").prop("checked", true);
        formContainer
            .find("#add_authority_btn_txt")
            .text("No authority to leave");
        formContainer.find(".form-error-message-container").remove();

        $(document).find("#clear-dropoff").hide();

        if (!jQuery.isEmptyObject(markerArr)) {
            markerArr.setMap(null);
        }

        map.setCenter({
            lat: parseFloat(js_default_lat),
            lng: parseFloat(js_default_long),
        });
        map.setZoom(13);
    });

    window.onpopstate = function () {
        var url = location.pathname;
        var slug = url.substring(url.lastIndexOf("/") + 1);
        step = slug;

        loadData(false, true);
    };

    $(document).on(
        "input change",
        ".new-delivery-form-container input[type=text], .new-delivery-form-container textarea",
        function () {
            updateClearDataButton();
        }
    );

    $(document).on("change", "input.address-radio-btn", function () {
        updateClearDataButton();
    });
    let cardFooterHeight =
        document.querySelector(".main-card-footer").offsetHeight;
    $(".main-card-content").css(
        "height",
        "calc(100% - " + cardFooterHeight + "px)"
    );
});
async function getFastwayZoneMethod(addLatitude, addLongtitude) {
    // Get fastway zone postal code and sublocality
    async function getFastwayZone() {
        try {
            const response = await callGetFastwayZone(addLatitude, addLongtitude); 
            return response; 
        } catch (error) {
            console.error(error);
        }
    }

    try {
        var zoneData = await getFastwayZone(); // wait for getFastwayZone to complete
        return zoneData; // <--- Add this return statement
    } catch (error) {
        console.error(error);
    }
    
}

function openShipmentErrorModel(){
    var modal = $("#save_shipment_error_modal_container");
    modal.css("display", "flex");
    setTimeout(() => {
        modal.addClass("center-modal-container-active");
        $("#save_shipment_error_center_modal").addClass(
            "center-modal-active"
        );
    }, 1);
}
