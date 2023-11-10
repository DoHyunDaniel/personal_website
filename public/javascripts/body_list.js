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

/*로그아웃*/
$(".logout").click(function () {
  // get 요청을 보내고 응답을 처리
  $.get("/users/logout", function (data) {
    // 서버로부터 받은 JSON 응답에서 메시지를 추출
    const Message = data.message;
    const modal2 = $('<div class="modal2" style="left:40vw;"><div>');
    modal2.text(Message);
    // 확인 버튼을 추가
    const closeButton = $("<button>OK</button></div></div>");
    closeButton.click(function () {
      modal2.remove(); // 모달 창 닫기
      window.location.replace("/");
      $("#login").prop("disabled", false);
    });
    modal2.append(closeButton);

    // 모달 창을 body에 추가
    $("html").append(modal2);
  });
});

$("#profile").click(function () {
  // POST 요청을 보내고 응답을 처리
  $.get("/profile", function (data) {
    // 서버로부터 받은 JSON 응답에서 메시지를 추출
    const login = data.login;
    const Message = data.message;
    if (login === false) {
      const modal2 = $('<div class="modal2" style="left:39vw;"><div>');
      modal2.text(Message);
      // 확인 버튼을 추가
      const closeButton = $("<button>OK</button></div></div>");
      closeButton.click(function () {
        modal2.remove(); // 모달 창 닫기
        window.location.replace("/");
      });
      modal2.append(closeButton);

      // 모달 창을 body에 추가
      $("html").append(modal2);
    } else {
      window.location.replace("/profile");
    }
  });
});
