function initMaps() {
    var location = {
        lat: -33.937473,
        lng: 18.433243
    };
    // Initialize collection map
    var shipAddressMap = new google.maps.Map(document.getElementById("ship-address-map"), {
        zoom: 14,
        center: {
            lat: location.lat + 0.0005,
            lng: location.lng
        },
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        disableDefaultUI: true,
        mapId: "2f3a9c93fc40c85d",
    });
    var collectionIcon = {
        url: "https://uploads-ssl.webflow.com/5fda6f586fdb5a2f2cc5696a/64aaa7c21ccddd56cca1cad6_verified-map-marker.svg",
        size: new google.maps.Size(129, 57),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(64.5, 50),
    };
    var shipAddressMarker = new google.maps.Marker({
        position: {
            lat: -33.937473,
            lng: 18.43324
        },
        map: shipAddressMap,
        icon: collectionIcon,
    });
}