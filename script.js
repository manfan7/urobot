$(".wr1").click(function () {
  $(this).toggleClass("open2");
  $(".op1").toggleClass("dropdownoptionop");
});
$(".wr2").click(function () {
  $(this).toggleClass("open2");
  $(".op2").toggleClass("dropdownoptionop2");
});

$(".item__li-select-wrapper").click(function () {
  $(this).toggleClass("open1");
  $(".item__li-dropdownoption__li").toggleClass(
    "item__li-dropdownoptionop__li"
  );
});
$(".tarif-enterpice-ch").click(function () {
  $(".tarif-enterpice-ch1").toggleClass("opening");
});
$(".item__li-select-wrapper1").click(function () {
  $(this).toggleClass("open1");
  $(".item__li-dropdownoption__li1").toggleClass(
    "item__li-dropdownoptionop__li1"
  );
});
let option1 = document.querySelectorAll(".option1");
let option2 = document.querySelectorAll(".option2");

document.querySelector(".li1").addEventListener("click", function (event) {
  option1.forEach((item) => item.classList.toggle("optionopen"));
  event.target.classList.toggle("openli");
});
document.querySelector(".li2").addEventListener("click", function (event) {
  option2.forEach((item) => item.classList.toggle("optionopen"));
  event.target.classList.toggle("openli");
});
let skewtext = document.querySelector(".skewtext");
let skewtextsec = document.querySelector(".skewtext-sec");
let yearArticle = document.querySelector(".year__article");

let saleSum;

let dropdownoption = document.querySelectorAll(".dropdownoption");
dropdownoption.forEach((item) => {
  item.addEventListener("click", function (event) {
    let saleText = event.target.innerHTML;
    saleSum = +event.target.dataset.sale;
    alert(saleSum);
    // const content = element.innerHTML;
  });
});
