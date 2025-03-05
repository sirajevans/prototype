// open + close side-menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const elementsToToggle = document.querySelectorAll(
    ".side-menu, .main-content, .menu-company-name, .menu-item-text, .side-menu-category"
  );
  const tooltips = document.querySelectorAll(".menu-item-tooltip");

  // Function to update tooltips visibility
  function updateTooltips(isClosed) {
    tooltips.forEach(tooltip => {
      tooltip.style.display = isClosed ? "flex" : "";
    });
  }

  // Check stored state
  const isMenuClosed = localStorage.getItem("sideMenuClosed") === "true";

  // Apply stored state
  if (isMenuClosed) {
    menuToggle.classList.add("closed");
    elementsToToggle.forEach((element) => {
      element.classList.add("side-menu-closed");
    });
    updateTooltips(true);
  } else {
    updateTooltips(false);
  }

  // Show menu after state is applied
  requestAnimationFrame(() => {
    sideMenu.classList.add("initialized");
    // Remove initial state class after everything is set
    document.documentElement.classList.remove("side-menu-initial-closed");
  });

  // Menu toggle functionality
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("closed");
    const isClosed = menuToggle.classList.contains("closed");

    elementsToToggle.forEach((element) => {
      element.classList.toggle("side-menu-closed");
    });

    updateTooltips(isClosed);
    localStorage.setItem("sideMenuClosed", isClosed);
  });

  // Close menu when clicking outside (for mobile)
  const closeMenu = (event) => {
    if (window.innerWidth > 760) return;

    const isMenuOpen = !sideMenu.classList.contains("side-menu-closed");
    const target = event.target || (event.touches && event.touches[0]?.target);
    const isClickOutside =
      target &&
      !sideMenu.contains(target) &&
      !target.classList.contains("menu-toggle");

    if (isMenuOpen && isClickOutside) {
      menuToggle.classList.add("closed");
      elementsToToggle.forEach((element) => {
        element.classList.add("side-menu-closed");
      });
      updateTooltips(true);
      localStorage.setItem("sideMenuClosed", "true");
    }
  };

  document.addEventListener("click", closeMenu);
  document.addEventListener("touchend", closeMenu);

  // Handle window resize
  let resizeTimeout;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 760) {
          menuToggle.classList.remove("closed");
          elementsToToggle.forEach((element) => {
            element.classList.remove("side-menu-closed");
          });
          updateTooltips(false);
          localStorage.setItem("sideMenuClosed", "false");
        }
      }, 250);
    },
    { passive: true }
  );
});

// Refresh button
document.addEventListener("DOMContentLoaded", () => {
  const refreshButton = document.querySelector(".nav-refresh");
  const refreshPaths = document.querySelector(".nav-refresh-paths");
  let isRefreshing = false;

  if (refreshButton && refreshPaths) {
    refreshButton.addEventListener("click", () => {
      if (isRefreshing) return;

      isRefreshing = true;
      refreshPaths.classList.toggle("rotated");
      window.location.reload(true);
    });
  }

  // Navigation buttons
  const prevButton = document.querySelector(".nav-prev");
  const nextButton = document.querySelector(".nav-next");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      window.history.forward();
    });
  }
});

// Check if application is native or not
// if (window.todesktop) {
//   document.querySelector(".macos-app-spacer").style.display = "block";
// } else {
//   document.querySelector(".macos-app-spacer").style.display = "none";
// }

// Add a single event listener to the parent menu container
document.addEventListener("DOMContentLoaded", () => {
  const sideMenuBody = document.querySelector('.side-menu-body');
  if (sideMenuBody) {
    sideMenuBody.addEventListener('click', function(e) {
      // Check if a menu item was clicked
      const menuItem = e.target.closest('.menu-item');
      if (menuItem && !menuItem.classList.contains('w--current')) {
        // Remove w--current class from all menu items
        document.querySelectorAll('.menu-item.w--current').forEach(activeItem => {
          activeItem.classList.remove('w--current');
        });
        
        // Add w--current class to the clicked item
        menuItem.classList.add('w--current');
      }
    });
  }
});
