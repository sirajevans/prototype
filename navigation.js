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
  
  // Enhanced menu item highlighting
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    // Only attach to items with onclick handlers (navigation items)
    if (item.hasAttribute('onclick') || item.getAttribute('href')) {
      item.addEventListener('click', function(e) {
        // Don't interfere with external links or special items
        if (item.getAttribute('target') === '_blank' || item.classList.contains('a-bottom')) {
          return;
        }
        
        // Remove w--current class from all menu items
        document.querySelectorAll('.menu-item.w--current').forEach(activeItem => {
          activeItem.classList.remove('w--current');
        });
        
        // Add w--current class to clicked item immediately
        item.classList.add('w--current');
        
        // Store the clicked item URL in sessionStorage to handle page refreshes
        const href = item.getAttribute('href');
        if (href) {
          sessionStorage.setItem('lastActiveMenuItem', href);
        } else if (item.hasAttribute('onclick')) {
          // Extract URL from onclick attribute if present
          const onclickAttr = item.getAttribute('onclick');
          const urlMatch = onclickAttr.match(/window\.location\.href=\'([^\']+)\'/);
          if (urlMatch && urlMatch[1]) {
            sessionStorage.setItem('lastActiveMenuItem', urlMatch[1]);
          }
        }
      });
    }
  });
  
  // Handle active menu item on page load
  const currentPath = window.location.pathname + window.location.search;
  let activeItemFound = false;
  
  // First try to match exact URL
  menuItems.forEach(item => {
    const href = item.getAttribute('href');
    const onclickAttr = item.getAttribute('onclick');
    let itemUrl = null;
    
    if (href) {
      itemUrl = href;
    } else if (onclickAttr) {
      const urlMatch = onclickAttr.match(/window\.location\.href=\'([^\']+)\'/);
      if (urlMatch && urlMatch[1]) {
        itemUrl = urlMatch[1];
      }
    }
    
    if (itemUrl) {
      // Extract path from full URL if needed
      if (itemUrl.includes('://')) {
        const url = new URL(itemUrl);
        itemUrl = url.pathname + url.search;
      }
      
      if (itemUrl === currentPath) {
        // Remove w--current from all items
        document.querySelectorAll('.menu-item.w--current').forEach(activeItem => {
          activeItem.classList.remove('w--current');
        });
        
        // Add to this item
        item.classList.add('w--current');
        activeItemFound = true;
      }
    }
  });
  
  // If no exact match found, try to match by pathname only (ignoring query params)
  if (!activeItemFound) {
    const currentPathOnly = window.location.pathname;
    
    menuItems.forEach(item => {
      const href = item.getAttribute('href');
      const onclickAttr = item.getAttribute('onclick');
      let itemUrl = null;
      
      if (href) {
        itemUrl = href;
      } else if (onclickAttr) {
        const urlMatch = onclickAttr.match(/window\.location\.href=\'([^\']+)\'/);
        if (urlMatch && urlMatch[1]) {
          itemUrl = urlMatch[1];
        }
      }
      
      if (itemUrl) {
        // Extract path from full URL if needed
        let itemPathOnly = itemUrl;
        if (itemUrl.includes('://')) {
          const url = new URL(itemUrl);
          itemPathOnly = url.pathname;
        } else if (itemUrl.includes('?')) {
          itemPathOnly = itemUrl.split('?')[0];
        }
        
        if (itemPathOnly === currentPathOnly) {
          // Remove w--current from all items
          document.querySelectorAll('.menu-item.w--current').forEach(activeItem => {
            activeItem.classList.remove('w--current');
          });
          
          // Add to this item
          item.classList.add('w--current');
          activeItemFound = true;
        }
      }
    });
  }
  
  // If still no match found, check for section parameter in URL
  if (!activeItemFound && window.location.search.includes('section=')) {
    const sectionParam = new URLSearchParams(window.location.search).get('section');
    
    if (sectionParam) {
      menuItems.forEach(item => {
        const href = item.getAttribute('href');
        const onclickAttr = item.getAttribute('onclick');
        let itemUrl = null;
        
        if (href) {
          itemUrl = href;
        } else if (onclickAttr) {
          const urlMatch = onclickAttr.match(/window\.location\.href=\'([^\']+)\'/);
          if (urlMatch && urlMatch[1]) {
            itemUrl = urlMatch[1];
          }
        }
        
        if (itemUrl && itemUrl.includes(`section=${sectionParam}`)) {
          // Remove w--current from all items
          document.querySelectorAll('.menu-item.w--current').forEach(activeItem => {
            activeItem.classList.remove('w--current');
          });
          
          // Add to this item
          item.classList.add('w--current');
        }
      });
    }
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

// Add loading indicator for menu item clicks
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    // Only attach to items with onclick handlers or href attributes (navigation items)
    if (item.hasAttribute('onclick') || item.getAttribute('href')) {
      item.addEventListener('click', function(e) {
        // Don't interfere with external links or special items
        if (item.getAttribute('target') === '_blank' || item.classList.contains('a-bottom')) {
          return;
        }
        
        // Add loading indicator to the body
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'page-loading-indicator';
        loadingIndicator.innerHTML = `
          <div class="loading-spinner">
            <div class="spinner-inner"></div>
          </div>
        `;
        document.body.appendChild(loadingIndicator);
        
        // Add loading class to body
        document.body.classList.add('page-loading');
        
        // For items with onclick handlers, we need to let the original handler execute
        if (!item.getAttribute('href') && item.hasAttribute('onclick')) {
          // The original onclick will navigate away
          return;
        }
      });
    }
  });
});