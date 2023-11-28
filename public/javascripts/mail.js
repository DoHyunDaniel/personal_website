let mailForm = document.getElementById('mail_form');
let username = document.querySelector('.username');
let email = document.querySelector('.email');
let subject = document.querySelector('.subject');
let message = document.querySelector('.message');
let submit = document.querySelector('.submit');
let status_space = document.querySelector('.status_space');

mailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = {
    name: username.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
  };
  status_space.value = '메세지 보내는중....';

  let xhr = new XMLHttpRequest();

  //메일 작성 을 위한 Post 메소드, 
  //두번쨰는 url주소
  xhr.open('POST', '/');

  // 문자열이 json형식이므로 content-type 헤더를 application/json
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onload = () => {
    console.log('성공여부', xhr.responseText);

    //서버에서 응답한 (res.send())결과가 일치하면 input value초기화
    if (xhr.responseText === 'success') {
      username.value = '';
      email.value = '';
      subject.value = '';
      message.value = '';
      status_space.value = '메일이 정상적으로 전송완료';

      setTimeout(() => {
        status_space.value = '메일 전송 현 상태....';
      }, 3000);
    } else {
      status_space.value = '뭔가 오류로 메세지 전송 실패';
    }
  };

  xhr.send(JSON.stringify(formData));
});