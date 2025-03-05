// open + close side-menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const mainContent = document.querySelector(".main-content");
  const initialServerState = @json(Cache::get('sideMenuClosed', false));
  const elementsToToggle = document.querySelectorAll(
    ".side-menu, .main-content, .menu-company-name, .menu-item-text, .side-menu-category"
  );
  const tooltips = document.querySelectorAll(".menu-item-tooltip");

  // Function to apply sidebar state
  function applySidebarState(state) {
    requestAnimationFrame(() => {
      elementsToToggle.forEach(element => {
        if (state === "closed") {
          element.classList.add("side-menu-closed");
          if (menuToggle) menuToggle.classList.add("closed");
          
          // Show tooltips when menu is closed
          tooltips.forEach(tooltip => {
            tooltip.style.display = "flex";
          });
        } else {
          element.classList.remove("side-menu-closed");
          if (menuToggle) menuToggle.classList.remove("closed");
          
          // Hide tooltips when menu is open
          tooltips.forEach(tooltip => {
            tooltip.style.display = "";  // Reset to default (or you can use "none")
          });
        }
      });
    });
  }

  // Check multiple storage locations in order of precedence
  function getSidebarState() {
    const sessionState = sessionStorage.getItem("sideMenuClosed");
    const localState = localStorage.getItem("sideMenuClosed");
    
    // First check session storage
    if (sessionState !== null) {
      return sessionState;
    }
    // Then check local storage
    if (localState !== null) {
      return localState;
    }
    // Finally use server-side state
    return initialServerState ? "closed" : "open";
  }

  // Save state to all storage locations
  function saveSidebarState(state) {
    sessionStorage.setItem("sideMenuClosed", state);
    localStorage.setItem("sideMenuClosed", state);
    if (typeof Livewire !== 'undefined') {
      Livewire.emit("toggleSidebar"); // This will update Laravel's cache
    }
  }

  // Initialize sidebar state
  const savedState = getSidebarState();
  document.documentElement.style.setProperty('--initial-sidebar-state', savedState === "closed" ? "closed" : "open");
  applySidebarState(savedState);

  // Show menu after state is applied
  requestAnimationFrame(() => {
    sideMenu.classList.add("initialized");
    // Remove initial state class after everything is set
    document.documentElement.classList.remove("side-menu-initial-closed");
  });

  // Menu toggle functionality
  function handleSidebarToggle() {
    const isClosed = sideMenu.classList.contains("side-menu-closed");
    const newState = isClosed ? "open" : "closed";
    
    applySidebarState(newState);
    saveSidebarState(newState);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", handleSidebarToggle);
  }

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
      applySidebarState("closed");
      saveSidebarState("closed");
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
          applySidebarState("open");
          saveSidebarState("open");
        }
      }, 250);
    },
    { passive: true }
  );

  // Listen for Livewire event
  window.addEventListener("menuToggled", function (event) {
    const newState = event.detail.state ? "closed" : "open";
    applySidebarState(newState);
    saveSidebarState(newState);
  });

  // Handle Turbo.js navigation
  document.addEventListener("turbo:load", function () {
    const currentState = getSidebarState();
    applySidebarState(currentState);
  });

  // Ensure consistent state after all resources are loaded
  window.addEventListener("load", function() {
    const finalState = getSidebarState();
    applySidebarState(finalState);
  });

  // Listen for Livewire page updates
  if (typeof Livewire !== 'undefined') {
    document.addEventListener("livewire:load", function () {
      Livewire.on("menuToggled", (event) => {
        const newState = event.state ? "closed" : "open";
        applySidebarState(newState);
        saveSidebarState(newState);
      });
    });
  }
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
  const menuContainer = document.querySelector('.side-menu-body');
  if (menuContainer) {
    menuContainer.addEventListener('click', function(e) {
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
