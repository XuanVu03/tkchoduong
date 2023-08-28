let quesContentItems = document.getElementsByClassName('ques_content__item');
let quesToggleBtns = document.getElementsByClassName('ques__item__title');

for(let i = 0; i < quesToggleBtns.length; i++){
  quesToggleBtns[i].addEventListener("click", () => {
    let currentClassName = quesContentItems[i].className;
    if(currentClassName.includes('active')){
      quesContentItems[i].classList.remove("active")
    } else {
      quesContentItems[i].classList.add('active')
    }
  })
}
