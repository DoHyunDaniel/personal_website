/*글자수 초과시 메세지 출력 */

const limit = document.getElementById("input");
const message = document.getElementById("message");

limit.addEventListener("limit", function () {
  if (limit.value.length > parseInt(limit.getAttribute("maxlength"))) {
    message.textContent = "제목은 50자까지만 가능합니다.";
  } else {
    message.textContent = "";
  }
});

/*타이틀 css 애니메이션*/

const input = document.querySelector("#input");

const handleChange = (event) => {
  input.classList.toggle("has-value", event.target.value);
};

/*타이틀 css 애니메이션*/

const input2 = document.querySelector("#input2");

const handleChange2 = (event) => {
  input2.classList.toggle("has-value", event.target.value);
};
