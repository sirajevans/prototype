function initMaps() {
    var location = {
        lat: -33.937473,
        lng: 18.433243
    };
    // Initialize collection map
    var collectionMap = new google.maps.Map(document.getElementById("collect-map"), {
        zoom: 13,
        center: {
            lat: location.lat,
            lng: location.lng
        },
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: "2f3a9c93fc40c85d",
    });
    var collectionIcon = {
        url: "https://uploads-ssl.webflow.com/5fda6f586fdb5a2f2cc5696a/6441bf0b713a6c2d670bb132_collection-map-marker.svg",
        size: new google.maps.Size(129, 57),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(64.5, 57),
    };
    var collectionMarker = new google.maps.Marker({
        position: {
            lat: -33.937473,
            lng: 18.433243
        },
        map: collectionMap,
        icon: collectionIcon,
    });
    // Initialize delivery map
    var deliveryMap = new google.maps.Map(document.getElementById("delivery-map"), {
        zoom: 13,
        center: {
            lat: location.lat + 0.002,
            lng: location.lng
        },
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: "2f3a9c93fc40c85d",
    });
    var deliveryIcon = {
        url: "https://uploads-ssl.webflow.com/5fda6f586fdb5a2f2cc5696a/6441bf0be71df4b02a66e5e4_delivery-map-marker.svg",
        size: new google.maps.Size(119, 57),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(59.5, 57),
    };
    var deliveryMarker = new google.maps.Marker({
        position: {
            lat: -33.937473,
            lng: 18.433243
        },
        map: deliveryMap,
        icon: deliveryIcon,
    });
}