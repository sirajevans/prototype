// open + close side-menu
document.addEventListener("DOMContentLoaded", () => {
  // Mark as initialized to prevent double initialization
  window.sidebarInitialized = true;
  
  const menuToggle = document.querySelector(".menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const elementsToToggle = document.querySelectorAll(
    ".side-menu, .main-content, .menu-company-name, .menu-item-text, .side-menu-category"
  );

  // Check stored state (prioritize sessionStorage for more recent state)
  const sessionState = sessionStorage.getItem("sideMenuClosed");
  const localState = localStorage.getItem("sideMenuClosed");
  
  let isMenuClosed;
  
  if (sessionState !== null) {
    isMenuClosed = sessionState === "closed";
  } else if (localState !== null) {
    isMenuClosed = localState === "true";
  } else {
    isMenuClosed = false; // Default state
  }

  // Apply stored state
  if (isMenuClosed) {
    menuToggle.classList.add("closed");
    elementsToToggle.forEach((element) => {
      element.classList.add("side-menu-closed");
    });
  } else {
    menuToggle.classList.remove("closed");
    elementsToToggle.forEach((element) => {
      element.classList.remove("side-menu-closed");
    });
  }

  // Show menu after state is applied
  requestAnimationFrame(() => {
    sideMenu.classList.add("initialized");
    // Remove initial state class after everything is set
    document.documentElement.classList.remove("side-menu-initial-closed");
  });

  // Menu toggle functionality with client-first, server-later approach
  menuToggle.addEventListener("click", () => {
    // 1. Update UI immediately
    menuToggle.classList.toggle("closed");
    
    elementsToToggle.forEach((element) => {
      element.classList.toggle("side-menu-closed");
    });
    
    // 2. Store state in local storage
    const isClosed = menuToggle.classList.contains("closed");
    localStorage.setItem("sideMenuClosed", isClosed);
    sessionStorage.setItem("sideMenuClosed", isClosed ? "closed" : "open");
    
    // 3. Notify Livewire component (if Livewire is available)
    if (window.Livewire) {
      // This will happen asynchronously after UI is updated
      window.Livewire.emit("setSidebarState", isClosed);
    }
  });

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
          localStorage.setItem("sideMenuClosed", "false");
          sessionStorage.setItem("sideMenuClosed", "open");
          
          // Notify Livewire
          if (window.Livewire) {
            window.Livewire.emit("setSidebarState", false);
          }
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

// Add a single event listener to the parent menu container
const sideMenuBody = document.querySelector('.side-menu-body');
if (sideMenuBody) {
    sideMenuBody.addEventListener('click', function (e) {
        // Check if a menu item was clicked
        const menuItem = e.target.closest('.menu-item');
        if (menuItem && !menuItem.classList.contains('w-current')) {
            // Remove w-current class from all menu items
            document.querySelectorAll('.menu-item.w-current').forEach(activeItem => {
                activeItem.classList.remove('w-current');
            });
            // Add w-current class to the clicked item
            menuItem.classList.add('w-current');
        }
    });
}
