var headerToggled = true;

$(window).on("load", function () {
  $("#load_div").fadeOut("slow");
  $("#content").fadeIn("slow");
  $(".slider").hide(0);
  $(".slider").children().hide(0);
  $("#short_header_div").show(0);
});
/*로그아웃*/

$("#logout").click(function () {
  // 버튼을 비활성화하여 중복 클릭 방지
  $("#login").prop("disabled", true);

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

/* 세션 정보에 따른 div 숨김 처리 */
document.addEventListener("DOMContentLoaded", function () {
  $.get("/api/getSessionUser", function (data) {
    if (data.user && data.user === "admin") {
      // 세션 정보가 있는 경우
      const user = data.user;
      const welcomeMessage = document.getElementById("welcome-message");
      welcomeMessage.textContent = `Welcome, ${user}`;
      welcomeMessage.style =
        "background-color:#252830; z-index:100; padding-right:10px; position:fixed;";

      const writeButtons = document.getElementById("buttons_container");
      writeButtons.style.display = "flex";
    } else if (data.user && data.user !== "admin") {
      const user = data.user;
      const welcomeMessage = document.getElementById("welcome-message");
      welcomeMessage.textContent = `Welcome, ${user}`;
      welcomeMessage.style =
        "background-color:#252830; z-index:100; padding-right:10px; position:fixed;";

      const writeButtons = document.getElementById("buttons_container");
      writeButtons.style.display = "none";
    } else {
      // 세션 정보가 없는 경우 (비로그인 상태)
      const welcomeMessage = document.getElementById("welcome-message");
      welcomeMessage.textContent = `Please login`;
      welcomeMessage.style =
        "background-color:#252830; z-index:100; padding-right:10px; position:fixed;";

      const writeButtons = document.getElementById("buttons_container");
      writeButtons.style.display = "none";
    }
  });
});

var mouse = {
    X: 0,
    Y: 0,
    CX: 0,
    CY: 0,
  },
  block = {
    X: mouse.X,
    Y: mouse.Y,
    CX: mouse.CX,
    CY: mouse.CY,
  },
  imags = [
    "images/profile.jpg",
    "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
    "images/nodejs_thumbnail.png",
    "images/clipboard.jpg",
  ];
bgimag = "images/header-bgimg.jpg";
$(".block").on("mousemove", function (e) {
  mouse.X = e.pageX - $(this).offset().left - $(".block").width() / 2;
  mouse.Y = e.pageY - $(this).offset().top - $(".block").height() / 2;
});

$(".block").on("mouseleave", function (e) {
  mouse.X = mouse.CX;
  mouse.Y = mouse.CY;
});

setInterval(function () {
  block.CY += (mouse.Y - block.CY) / 12;
  block.CX += (mouse.X - block.CX) / 12;

  $(".block .circleLight").css(
    "background",
    "radial-gradient(circle at " +
      mouse.X +
      "px " +
      mouse.Y +
      "px, #fff, transparent)"
  );
  $(".block").css({
    transform:
      "scale(1.03) translate(" +
      block.CX * 0.05 +
      "px, " +
      block.CY * 0.05 +
      "px) rotateX(" +
      block.CY * 0.05 +
      "deg) rotateY(" +
      block.CX * 0.05 +
      "deg)",
  });
}, 20);

$(".slider .item").each(function (i) {
  if (i == 0) {
    $(this).addClass("active");
    $(this).next().addClass("next");
    $(this).prev().addClass("prev");
  }

  $(this).attr("id", "slide-" + i);

  $(this).prepend(
    $("<div>", {
      class: "blur",
      style: "background-image: url(" + imags[i] + ");",
    }),
    $("<div>", {
      class: "bg",
      style: "background-image: url(" + bgimag + ");",
    })
  );

  $(this)
    .find(".block")
    .css("background-image", "url(" + imags[i] + ")");

  $(".navigations .dots").append(
    $("<li>", { class: i == 0 ? "active" : "", id: i }).on(
      "click",
      function () {
        var cSlide = $(".slider #slide-" + $(this).attr("id"));

        $(".navigations .dots li").removeClass("active");
        $(this).addClass("active");

        $(".slider .item").removeClass("active prev next");
        cSlide.addClass("active");
        cSlide.next().addClass("next");
        cSlide.prev().addClass("prev");
      }
    )
  );
});

$("#resize_header").click(function () {
  if (!headerToggled) {
    $(".slider").slideToggle(400);
    $(".slider").children().slideToggle(400);
    $("#short_header_div").slideDown(600);
    headerToggled = true;
  }
});
$("#resize_header_2nd").click(function () {
  if (headerToggled) {
    $("#short_header_div").hide(400);
    $(".slider").slideToggle(600);
    $(".slider").children().slideToggle(600);
    headerToggled = false;
  }
});
