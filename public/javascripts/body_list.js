const subNavs = document.querySelectorAll(`.subnav`);
const buttons = document.querySelectorAll(`.sidebar button`);

const resetSidebar = () => {
  subNavs.forEach((nav) => {
    nav.style.height = 0;
  });

  buttons.forEach((b) => {
    b.classList.remove("active");
  });
};

const handleHeaderClicked = (subNav) => {
  resetSidebar();

  const subNavOuter = document.querySelector(`#${subNav}`),
    subNavInner = document.querySelector(`#${subNav} .subnav-inner`),
    button = subNavOuter.previousElementSibling;

  if (subNavOuter.clientHeight > 0) {
    subNavOuter.style.height = 0;
    button.classList.remove("active");
    return;
  }

  button.classList.toggle("active");
  const newHeight = `${subNavInner.clientHeight}px`;
  subNavOuter.style.height = newHeight;
};

$(document).ready(function () {
  // 드롭다운 토글
  $(".dropdown-toggle").click(function () {
    $(this).parent().toggleClass("dropdown-open");
  });
});

/* resize 함수 */
const resizable = document.getElementById("resizable");

let isResizing = false;
let originalMouseX;
let originalWidth;

resizable.addEventListener("mousedown", function (e) {
  isResizing = true;
  originalMouseX = e.clientX;
  originalWidth = getComputedStyle(resizable, null).getPropertyValue("width");
  resizable.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function (e) {
  resizable.style.cursor = "grabbing";
  if (!isResizing) return;
  const width = parseInt(originalWidth) + (e.clientX - originalMouseX);

  // 최대 크기를 설정하려면 아래 조건을 적절하게 변경하세요
  if (width > 400) {
    resizable.style.width = "800px"; // 최대 크기
  } else if (width < 100) {
    resizable.style.width = "60px"; // 최소 크기
  } else {
    resizable.style.width = width + "px";
  }
});

document.addEventListener("mouseup", function (e) {
  isResizing = false;
  resizable.style.cursor = "pointer";
});
