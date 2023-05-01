export const clickOutside = {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (
        !(el == event.target || el.contains(event.target)) &&
        !event.target.classList.contains(binding.arg)
      ) {
        binding.value();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent, true);
  },
  unmounted: (el) => {
    document.removeEventListener("click", el.clickOutsideEvent, true);
  },
};
var i = 0;
export const trapFocus = {
  beforeMount: (el) => {
    el.trapFocus = (event) => {
      // here I check that click was outside the el and his children
      const focusables = [
        ...el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ];
      focusables.sort((a, b) => a.tabIndex - b.tabIndex);

      if (
        focusables.findIndex((item) => item === document.activeElement) != -1
      ) {
        i = focusables.findIndex((item) => item === document.activeElement) + 1;
      }

      if (event.key === "Tab") {
        if (
          document.activeElement === focusables[focusables.length - 1] &&
          i != 0
        ) {
          focusables[0].focus();
          i = 1;
        } else {
          focusables[i].focus();
          i++;
        }

        event.preventDefault();
      }
    };
    document.addEventListener("keydown", el.trapFocus, true);
  },

  unmounted: (el) => {
    document.removeEventListener("keydown", el.trapFocus, true);
  },
};

export const focusOutDropDown = {
  beforeMount: (el, binding) => {
    el.focusOutDropDown = (event) => {
      if (document.activeElement === el) {
        if (event.key == "Tab") {
          binding.value();
        }
      }
    };
    document.addEventListener("keydown", el.focusOutDropDown, true);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.focusOutDropDown, true);
  },
};

export const actionOnKeyPress = {
  beforeMount: (el, binding) => {
    el.actionOnKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey == false) {
        if (
          binding.value.isCtrl &&
          binding.value.isShift == false &&
          binding.value.key === event.keyCode
        ) {
          event.preventDefault();
          binding.value.fn();
          return;
        }
      }

      if (event.shiftKey && event.ctrlKey) {
        if (
          binding.value.isShift &&
          binding.value.isCtrl &&
          binding.value.key === event.keyCode
        ) {
          event.preventDefault();
          binding.value.fn();
          return;
        }
      }

      if (!binding.value.isCtrl && !binding.value.isShift) {
        if (event.keyCode === binding.value.key) {
          binding.value.fn();
          return;
        }
      }
    };
    document.addEventListener("keydown", el.actionOnKeyPress, true);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.actionOnKeyPress, true);
  },
};

export const showTooltip = {
  beforeMount: (el, binding) => {
    el.showTooltip = (event) => {
      if (
        (el == event.target || el.contains(event.target)) &&
        event.target.classList.contains("tooltip-container") &&
        binding.value
      ) {
        const tooltip = document.querySelector(".tooltip");
        tooltip.innerHTML = `${binding.value}`;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = 1;
        tooltip.style.top = event.y + 10 + "px";
        tooltip.style.left = event.x + 10 + "px";
      }
    };
    el.hideTooltip = (event) => {
      if (
        !(el == event.target || el.contains(event.target)) ||
        !event.target.classList?.contains("tooltip-container")
      ) {
        const tooltip = document.querySelector(".tooltip");
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;
      }
    };
    document.addEventListener("mouseover", el.showTooltip, true);
    document.addEventListener("mousemove", el.showTooltip, true);
    document.addEventListener("mouseleave", el.hideTooltip, true);
  },
  unmounted: (el) => {
    document.removeEventListener("mouseover", el.showTooltip, true);
    document.addEventListener("mousemove", el.showTooltip, true);
    document.removeEventListener("mouseleave", el.hideTooltip, true);
  },
};

let current = -1;
export const handleDropdownMenu = {
  created(el, binding) {
    current = -1;
    current =
      binding.value.list
        ?.map((item) => item[binding.value.name])
        .findIndex(
          (arrayItem) =>
            arrayItem == binding.value.selectedValue ||
            arrayItem == binding.value.hoverItem?.[binding.value.name]
        ) >= 0
        ? binding.value.list
            ?.map((item) => item[binding.value.name])
            .findIndex(
              (arrayItem) =>
                arrayItem == binding.value.selectedValue ||
                arrayItem == binding.value.hoverItem?.[binding.value.name]
            )
        : current;
  },
  beforeMount: (el, binding) => {
    el.handleDropdownMenu = (event) => {
      if (event.key == "ArrowDown" && current < binding.value.list.length - 1) {
        current += 1;
        binding.value.fn(binding.value.list[current]);
      }
      if (event.key == "ArrowUp" && current > 0) {
        current -= 1;
        binding.value.fn(binding.value.list[current]);
      }
      if (event.key == "Enter") {
        if (current >= 0) {
          i = i + 1;
          binding.value.selectOption(binding.value.list[current]);
        }
      }
    };
    document.addEventListener("keydown", el.handleDropdownMenu, true);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.handleDropdownMenu, true);
  },
};
