$(window).on('load', function () {
  setTimeout(removeLoader, 800);
});
function removeLoader() {
  $("#s_container").fadeOut(100, function () {
    $("s_container").remove();
  });
}

$(document).ready(function() {
  var gradient = new Gradient();
  gradient.initializeGradient('#gradient-canvas');

  $('.copy-icon').on('click', displayCopyToast);
  
  function displayCopyToast() {
    var copyWaybill = $('#waybill-number').attr('waybill');
    navigator.clipboard.writeText(copyWaybill).then(() => {
      $('.copy-toast').addClass('active');
      setTimeout(function() {
        $('.copy-toast').removeClass('active');
      }, 2000);
    });
  }

  $('.help-modal-btn').on('click', displayHelpModal);
  $('.notify-btn').on('click', displayNotifyModal);
  $('.shipment-btn').on('click', displayShipmentModal);
  $('.modal-overlay, .help-modal-overlay').on('click', closeModal);

  function displayHelpModal() {
    $('.help-modal').addClass('active');
    $('.help-modal-overlay').css('display', 'block');
    setTimeout(function() {
      $('.help-modal-overlay').addClass('active');
    }, 10);
  }

  function displayNotifyModal() {
    $('body').css('overflow', 'hidden');
    $('#notify-modal').addClass('active');
    $('.modal-overlay').css('display', 'block');
    setTimeout(function() {
      $('.modal-overlay').addClass('active');
    }, 10);
  }

  function displayShipmentModal() {
    $('body').css('overflow', 'hidden');
    $('#shipment-modal').addClass('active');
    $('.modal-overlay').css('display', 'block');
    setTimeout(function() {
      $('.modal-overlay').addClass('active');
    }, 10);
  }

  function closeModal() {
    $('body').css('overflow', 'visible');
    $('.help-modal, #notify-modal, #shipment-modal').removeClass('active');
    $('.modal-overlay, .help-modal-overlay').removeClass('active');
    setTimeout(function() {
      $('.modal-overlay, .help-modal-overlay').css('display', 'none');
    }, 210);
  }
});


var swiper = new Swiper(".swiper-container", {
  pagination: ".swiper-pagination",
  slidesPerView: 1,
  paginationClickable: true,
  loop: false,
  autoHeight: true,
  paginationBulletRender: function (index, className) {
    var tabsName = ["Delivery status", "Shipment details"];
    var tabsIcon = ["delivery-status-icon", "shipment-details-icon"];
    if (index === tabsName.length - 1) {
      return (
        '<span class="' + className + '">' + '<span class="' + tabsIcon[index] + '">' + "</span>" + tabsName[index] + "</span>" + '<div class="active-mark "></div>'
      );
    }
    return '<span class="' + className + '">' + '<span class="' + tabsIcon[index] + '">' + "</span>" + tabsName[index] + "</span>";
  }
});

const shareButton = document.querySelector('.share-link-btn');
shareButton.addEventListener('click', event => {
  if (navigator.share) {
    navigator.share({
      url: 'https://status.usecarter.com'
    })
  } else { }
});