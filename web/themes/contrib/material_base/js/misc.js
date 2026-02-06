((Drupal, once) => {
  'use strict';

  Drupal.behaviors.materialBaseFunctions = {
    attach: (context, settings) => {

      // Header background image and navbar effects.
      const header = document.getElementById('header');
      const headerHeight = header.offsetHeight;
      const headerBg = document.querySelector('.navbar-fixed #header-bg');
      const headerContent = document.querySelector('.navbar-fixed #header-content');
      const navbar = document.querySelector('.navbar-fixed #navbar');
      const headerBgHeight = headerHeight - 192;

      const handleScroll = () => {
        const scrollPercent = (headerBgHeight - window.scrollY) / headerBgHeight;
        if (scrollPercent >= 0) {
          headerBg.style.opacity = scrollPercent;
          headerContent.style.opacity = scrollPercent;
        }

        if (window.scrollY > headerHeight - 128) {
          navbar.classList.add('navbar-bg');
        } else {
          navbar.classList.remove('navbar-bg');
        }

        if (window.scrollY > headerHeight - 64) {
          navbar.classList.add('navbar-shadow');
        } else {
          navbar.classList.remove('navbar-shadow');
        }
      }

      // Drawer.
      const handleDrawerOpen = (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.body.classList.add('drawer-open');
      }

      const handleDrawerClose = (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.body.classList.remove('drawer-open');
      }

      let touchstartX = 0;
      let touchendX = 0;

      const handleTouchStart = (event) => {
        touchstartX = event.changedTouches[0].screenX;
      }

      const handleTouchEnd = (event) => {
        touchendX = event.changedTouches[0].screenX;
        if (touchendX < touchstartX && touchendX - touchstartX < -50) {
          handleDrawerClose(event);
        }
      }

      // Smooth scroll for anchor links.
      const getTopOffset = () => {
        let fixedHeight = 24;
        const bodyClasses = document.body.classList;

        if (bodyClasses.contains('navbar-fixed')) {
          fixedHeight += 64;
        }

        if (bodyClasses.contains('toolbar-vertical')) {
          fixedHeight += 40;
        }

        if (bodyClasses.contains('toolbar-horizontal')) {
          fixedHeight += 40;

          if (bodyClasses.contains('toolbar-tray-open')) {
            fixedHeight += 40;
          }
        }

        return fixedHeight;
      };

      const handleSmoothScroll = (targetId, e = null) => {
        if (e) {
          e.preventDefault();
        }

        const target = document.querySelector(targetId);
        if (!target) {
          return;
        }

        const targetOffsetTop = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetOffsetTop - getTopOffset(),
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      };

      // Collapsible panels.
      const handleCollapsiblePanel = (toggle) => {
        const target = document.querySelector(`#${toggle.dataset.target}`);
        if (!target) {
          return;
        }

        // Updating classes explicitly instead of toggle to reduce wrong usage.
        if (window.getComputedStyle(target).display === 'none') {
          slideDown(target, 200);
          target.classList.add('expanded');
          toggle.classList.add('expanded');
        }
        else {
          slideUp(target, 200);
          target.classList.remove('expanded');
          toggle.classList.remove('expanded');
        }
      };

      // Dropdown menus.
      const handleMenuDropdown = (e, toggle) => {
        e.stopPropagation();
        e.preventDefault();
        toggle.classList.remove('tooltip-expanded');
        const tooltip = toggle.querySelector('.tooltip');
        if (tooltip) {
          tooltip.classList.remove('tooltip-expanded');
        }
        const targetId = `#${toggle.dataset.target}`;
        const target = document.querySelector(targetId);
        document.querySelectorAll(`.menu-dropdown:not(${targetId})`).forEach(dropdown => {
          slideUp(dropdown, 200);
          dropdown.classList.remove('expanded');
        });
        document.querySelectorAll(`.menu-dropdown-toggle:not([data-target="${toggle.dataset.target}"])`).forEach(toggle => {
          toggle.classList.remove('dropdown-expanded');
        });
        if (!target) {
          return;
        }
        if (window.getComputedStyle(target).display === 'none') {
          slideDown(target, 200);
          target.classList.add('expanded');
          toggle.classList.add('dropdown-expanded');
        }
        else {
          slideUp(target, 200);
          target.classList.remove('expanded');
          toggle.classList.remove('dropdown-expanded');
        }
      }

      // Handling boxed textarea filled state.
      const handleBoxedTextareaFilledState = (element, textarea) => {
        if (textarea.value !== '') {
          element.classList.add('filled');
        }
        else {
          element.classList.remove('filled');
        }
      }

      // Handling filled state for boxed textarea with CodeMirror editor.
      const handleBoxedTextareaCodemirrorFilledState = (element, editor) => {
        if (editor.getValue().trim()) {
          element.classList.add('filled');
        } else {
          element.classList.remove('filled');
        }
      };

      // Global behaviors of the page.
      once('materialBaseFunctions', 'html').forEach((element) => {

        // Header background image and navbar effects.
        handleScroll();
        document.addEventListener('scroll', handleScroll);

        // Drawer.
        const drawer = document.getElementById('drawer');
        const drawerOverlay = document.getElementById('drawer-overlay');
        const navbarMenuToggle = document.getElementById('navbar-menu-toggle');
        const drawerMenuClose = document.getElementById('drawer-menu-close');

        navbarMenuToggle.addEventListener('click', handleDrawerOpen);

        drawerOverlay.addEventListener('click', handleDrawerClose);

        drawerMenuClose.addEventListener('click', handleDrawerClose);

        drawer.addEventListener('touchstart', handleTouchStart);
        drawer.addEventListener('touchend', handleTouchEnd);

        drawerOverlay.addEventListener('touchstart', handleTouchStart);
        drawerOverlay.addEventListener('touchend', handleTouchEnd);

        // Smooth scroll for anchor links on page load.
        if (window.location.hash) {
          // Small timeout needs for applying body classes.
          setTimeout(() => handleSmoothScroll(window.location.hash), 100);
        }

        // Collapsing dropdowns on page click.
        const menuDropdownToggles = document.querySelectorAll('.menu-dropdown-toggle');
        const menuDropdowns = document.querySelectorAll('.menu-dropdown');

        document.addEventListener('click', () => {
          menuDropdowns.forEach(dropdown => {
            slideUp(dropdown, 200);
            dropdown.classList.remove('expanded');
          });
          menuDropdownToggles.forEach(toggle => {
            toggle.classList.remove('dropdown-expanded');
          });
        });

      });

      // Attaching ripple effect to buttons and surfaces.
      once('rippleRipple', '.ripple', context).forEach(element => new Ripple(element));
      once('btnRipple', '.btn', context).forEach(element => new Ripple(element));
      once('fabRipple', '.fab', context).forEach(element => new Ripple(element));

      // Smooth scroll for anchor links.
      once('anchorLinkClick', 'a[href^="#"]:not([href="#"])', context).forEach(element => {
        element.addEventListener('click', e => handleSmoothScroll(element.hash, e));
      });

      once('fullPathWithAnchorLinkClick', `a[href^="${window.location.pathname}#"]`, context).forEach(element => {
        element.addEventListener('click', e => handleSmoothScroll(element.hash, e));
      });

      // Collapsible panels.
      once('collapsiblePanelToggleClick', '.collapsible-toggle', context).forEach(element => {
        element.addEventListener('click', () => handleCollapsiblePanel(element));
      });

      // Tooltips.
      once('tooltipBehavior', '.tooltip', context).forEach(element => {
        element.addEventListener('mouseenter', () => element.classList.add('tooltip-expanded'));
        element.addEventListener('mouseleave', () => element.classList.remove('tooltip-expanded'));
      });

      // Menu Dropdown.
      once('menuDropdownToggleClick', '.menu-dropdown-toggle', context).forEach(element => {
        element.addEventListener('click', e => handleMenuDropdown(e, element));
      });

      // Handling common form item focus state.
      once('formItemFocusState', '.form-item > input', context).forEach(element => {
        element.addEventListener('focus', () => element.parentElement.classList.add('focused'));
        element.addEventListener('blur', () => element.parentElement.classList.remove('focused'));
      });

      // Handling textarea form item focus state.
      once('formItemTextareaFocusState', '.form-item.form-type-textarea', context).forEach(element => {
        const textarea = element.querySelector('textarea');
        textarea.addEventListener('focus', () => element.classList.add('focused'));
        textarea.addEventListener('blur', () => element.classList.remove('focused'));
      });

      // Handling boxed textarea state.
      once('formItemBoxedTextareaState', '.form-item.textarea-boxed', context).forEach(element => {
        // Handling empty/filled state for regular field.
        const textarea = element.querySelector('textarea');
        // Initial state.
        handleBoxedTextareaFilledState(element, textarea);
        // Updating state after input.
        textarea.addEventListener('keyup', () => handleBoxedTextareaFilledState(element, textarea));

        // Handling focused and filled state for boxed textarea with CodeMirror editor.
        let editorElement;
        setTimeout(() => {
          editorElement = element.querySelector('.CodeMirror');
          if (!editorElement) {
            return;
          }

          const editor = editorElement.CodeMirror;
          // Initial state.
          handleBoxedTextareaCodemirrorFilledState(element, editor);
          // Update state on events.
          editor.on('focus', () => element.classList.add('focused'));
          editor.on('blur', () => element.classList.remove('focused'));
          editor.on('change', () => handleBoxedTextareaCodemirrorFilledState(element, editor));
        }, 100);
      });

    }
  };
}) (Drupal, once);
