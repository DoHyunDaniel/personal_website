/*로그아웃*/
$('#logout').click(function () {

        // 버튼을 비활성화하여 중복 클릭 방지
        $('#login').prop('disabled', true);

        // get 요청을 보내고 응답을 처리
        $.get("/users/logout", function (data) {
            // 서버로부터 받은 JSON 응답에서 메시지를 추출
            const Message = data.message;
            const modal2 = $('<div class="modal2" style="left:40vw;"><div>');
            modal2.text(Message);
            // 확인 버튼을 추가
            const closeButton = $('<button>OK</button></div></div>');
            closeButton.click(function () {
                modal2.remove(); // 모달 창 닫기
                window.location.replace("/");
                $('#login').prop('disabled', false);
            });
            modal2.append(closeButton);

            // 모달 창을 body에 추가
            $('html').append(modal2);

        });

    });

/* 세션 정보에 따른 div 숨김 처리 */
    document.addEventListener("DOMContentLoaded", function () {
        $.get("/api/getSessionUser", function (data) {
            if (data.user && data.user === "admin") {
                // 세션 정보가 있는 경우
                const user = data.user;
                const welcomeMessage = document.getElementById('welcome-message');
                welcomeMessage.textContent = `Welcome, ${user}`;
                welcomeMessage.style = "background-color:#243052; z-index:100; padding-right:10px; position:fixed;"

                const writeButtons = document.getElementById('buttons_container');
                writeButtons.style.display = "flex";
            } else if (data.user && data.user !== "admin") {
                const user = data.user;
                const welcomeMessage = document.getElementById('welcome-message');
                welcomeMessage.textContent = `Welcome, ${user}`;
                welcomeMessage.style = "background-color:#243052; z-index:100; padding-right:10px; position:fixed;"
                
                const writeButtons = document.getElementById('buttons_container');
                writeButtons.style.display = "none";
            } else {
                // 세션 정보가 없는 경우 (비로그인 상태)
                const welcomeMessage = document.getElementById('welcome-message');
                welcomeMessage.textContent = `Please login`;
                welcomeMessage.style = "background-color:#243052; z-index:100; padding-right:10px; position:fixed;"

                const writeButtons = document.getElementById('buttons_container');
                writeButtons.style.display = "none";
            }
        })
    })