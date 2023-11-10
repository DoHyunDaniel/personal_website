/*로그아웃*/
$(".modify_buttons").click(function () {
  // get 요청을 보내고 응답을 처리
  $.get("/api/getSessionUser", function (data) {
    // 서버로부터 받은 JSON 응답에서 메시지를 추출
    const user = data.user;
    if (user !== "admin") {
      var Message = "You're not allowed to write in this page.";
      const modal2 = $('<div class="modal2" style="left:40vw;"><div>');
      modal2.text(Message);
      // 확인 버튼을 추가
      const closeButton = $("<button>OK</button></div></div>");
      closeButton.click(function () {
        modal2.remove(); // 모달 창 닫기
      });
      modal2.append(closeButton);

      // 모달 창을 body에 추가
      $("html").append(modal2);
    }
  });
});

$("#footer_button_1st").click(function () {
    // get 요청을 보내고 응답을 처리
    $.get("/api/getSessionUser", function (data) {
      // 서버로부터 받은 JSON 응답에서 메시지를 추출
      const user = data.user;
      if (user !== "admin") {
        var Message = "You're not allowed to write in this page.";
        const modal2 = $('<div class="modal2" style="left:40vw;"><div>');
        modal2.text(Message);
        // 확인 버튼을 추가
        const closeButton = $("<button>OK</button></div></div>");
        closeButton.click(function () {
          modal2.remove(); // 모달 창 닫기
        });
        modal2.append(closeButton);
  
        // 모달 창을 body에 추가
        $("html").append(modal2);
      }
    });
  });
  
