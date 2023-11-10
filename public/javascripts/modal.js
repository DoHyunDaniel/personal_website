/*모달창 열리는 js*/
$(".button").click(function () {
  var buttonId = $(this).attr("id");
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("body").addClass("modal-active");
});

$("#modal-container").click(function () {
  if ($(event.target).closest(".login-page").length > 0) {
    return;
  }
  $(this).addClass("out");
  $("body").removeClass("modal-active");
});

/* 모달창 */
$(".message a").click(function () {
  $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
});

$("#createAccount").click(function () {
  //아이디 입력 체크
  if (!document.querySelector(".register-form input[name='username']").value) {
    alert("Your ID value is missing.");
    document.querySelector(".register-form input[name='username']").focus();
    return false;
    //비밀번호 입력 체크
  } else if (
    !document.querySelector(".register-form input[name='password']").value
  ) {
    alert("Your pwd value is missing.");
    document.querySelector(".register-form input[name='password']").focus();
    return false;
  } else if (
    !document.querySelector(".register-form input[name='email']").value
  ) {
    alert("Your email value is missing.");
    document.querySelector(".register-form input[name='email']").focus();
    return false;
  }

  // 버튼을 비활성화하여 중복 클릭 방지
  $("#createAccount").prop("disabled", true);

  // POST 요청을 보내고 응답을 처리
  $.post(
    "/users/register_process",
    {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val(),
      email: $('input[name="email"]').val(),
    },
    function (data) {
      // 서버로부터 받은 JSON 응답에서 메시지를 추출
      const login = data.login;
      const Message = data.message;
      if (login === false) {
        const modal2 = $('<div class="modal2"><div>');
        modal2.text(Message);
        // 확인 버튼을 추가
        const closeButton = $("<button>OK</button></div></div>");
        closeButton.click(function () {
          modal2.remove(); // 모달 창 닫기
          $("#createAccount").prop("disabled", false);
        });
        modal2.append(closeButton);

        // 모달 창을 body에 추가
        $("html").append(modal2);
      } else if (login === true) {
        // 모달 창을 만들어 메시지를 표시
        const modal2 = $('<div class="modal2" style="left:41vw;"><div>');
        modal2.text(Message);
        // 확인 버튼을 추가
        const closeButton = $("<button>OK</button></div></div>");
        closeButton.click(function () {
          modal2.remove(); // 모달 창 닫기
          window.location.reload();
          $("#createAccount").prop("disabled", false);
        });
        modal2.append(closeButton);

        // 모달 창을 body에 추가
        $("html").append(modal2);
      } else {
        alert("im so baaddd at coding");
        alert(login);
        alert(Message);
      }
    }
  );
});

/* 로그인 함수 */
$("#login").click(function () {
  //아이디 입력 체크
  if (!document.querySelector(".login-form input[name='username']").value) {
    alert("Your ID value is missing.");
    document.querySelector(".login-form input[name='username']").focus();
    return false;
    //비밀번호 입력 체크
  } else if (
    !document.querySelector(".login-form input[name='password']").value
  ) {
    alert("Your pwd value is missing.");
    document.querySelector(".login-form input[name='password']").focus();
    return false;
  }

  // 버튼을 비활성화하여 중복 클릭 방지
  $("#login").prop("disabled", true);

  // POST 요청을 보내고 응답을 처리
  $.post(
    "/users/login_process",
    {
      username: $('.login-form input[name="username"]').val(),
      password: $('.login-form input[name="password"]').val(),
    },
    function (data) {
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
          $("#login").prop("disabled", false);
        });
        modal2.append(closeButton);

        // 모달 창을 body에 추가
        $("html").append(modal2);
      } else if (login === true) {
        // 모달 창을 만들어 메시지를 표시
        const modal2 = $('<div class="modal2" style="left:43vw;"><div>');
        modal2.text(Message);
        // 확인 버튼을 추가
        const closeButton = $("<button>OK</button></div></div>");
        closeButton.click(function () {
          modal2.remove(); // 모달 창 닫기
          window.location.reload();
          $("#createAccount").prop("disabled", false);
        });
        modal2.append(closeButton);

        // 모달 창을 body에 추가
        $("html").append(modal2);
      } else {
        alert("im so baaddd at coding");
        alert(login);
        alert(Message);
      }
    }
  );
});
