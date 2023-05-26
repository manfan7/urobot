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
$(".wr1").click(function () {
  $(".wr11").toggleClass("open2");
  $(".op1").toggleClass("dropdownoptionop");
});

$(".wr2").click(function () {
  $(".wr22").toggleClass("open2");
  $(".op2").toggleClass("dropdownoptionop2");
});
let option1 = document.querySelectorAll(".option1");
let option2 = document.querySelectorAll(".option2");
let li1 = document.querySelector(".li1");
let li2 = document.querySelector(".li2");
let li22 = document.querySelector(".li22");
let arrow = document.querySelector(".arrow_example_li");

li1.addEventListener("click", function (event) {
  option1.forEach((item) => item.classList.toggle("optionopen"));
  document.querySelector(".arrow_example_li").classList.toggle("openli");
  if (li22.classList.contains("openli")) {
    option2.forEach((item) => item.classList.toggle("optionopen"));
    document.querySelector(".li22").classList.toggle("openli");
  }
});

li2.addEventListener("click", function (event) {
  option2.forEach((item) => item.classList.toggle("optionopen"));
  document.querySelector(".li22").classList.toggle("openli");
  if (arrow.classList.contains("openli")) {
    option1.forEach((item) => item.classList.toggle("optionopen"));
    document.querySelector(".arrow_example_li").classList.toggle("openli");
  }
});
let optionopen = document.querySelectorAll(".optionopen");
let optionopenli = document.querySelectorAll(".openli");
let skewtext1 = document.querySelector(".skewtext1");
let skewtext2 = document.querySelector(".skewtext2");
let skewtextsec = document.querySelectorAll(".skewtext-sec");
let yearArticle1 = document.querySelector(".year__article1");
let yearArticle2 = document.querySelector(".year__article2");
let saleSum1 = 20;
let saleSum2 = 20;
let dolz1 = document.querySelector(".dolz1");
let dolz2 = document.querySelector(".dolz2");
let dolzopt1 = document.querySelectorAll(".dolzopt1");
let dolzopt2 = document.querySelectorAll(".dolzopt2");
let dolzopt3 = document.querySelectorAll(".dolzopt3");
let dolzs1 = document.querySelector("#dolzs1");
let dolzs11 = document.querySelector("#dolzs11");
let datadolz = 12000;
let datadolz2 = 90000;
let datadolz3 = 325000;
let datadolz4 = 650000;
let dolzs2 = document.querySelector("#dolzs2");
let dolzs22 = document.querySelector("#dolzs22");
let dolzs3 = document.querySelector("#dolzs3");
let dolzs33 = document.querySelector("#dolzs33");
let dolzs4 = document.querySelector("#dolzs4");
let dolzs5 = document.querySelector("#dolzs5");
let dolzs44 = document.querySelector("#dolzs44");
let itogSum;
let dropdownoption1 = document.querySelectorAll(".op1");
let dropdownoption2 = document.querySelectorAll(".op2");
let dropdownskew = document.querySelector(".dropdown-skewblock");
let dropdownskewsk2 = document.querySelector(".sk2");
let dropdownskewsec = document.querySelectorAll(".dropdown-skewblock-sec");
dropdownoption1.forEach((item) => {
  item.addEventListener("click", function (event) {
    let saleText = event.target.innerHTML.replace(/\(.*\)*\)/,'');
    saleSum1 = +event.target.dataset.sale;
    dropdownskew.style.display = "flex";
    dropdownskewsec.forEach((item) => (item.style.display = "flex"));
    yearArticle1.innerHTML = saleText;
    skewtext1.innerHTML = saleSum1;
    skewtextsec.forEach((item) => (item.innerHTML = saleSum1));
    dolzs11.innerHTML = datadolz - (datadolz * saleSum1) / 100;
    dolzs2.innerHTML = datadolz2;
    dolzs22.innerHTML = datadolz2 - (datadolz2 * saleSum1) / 100;
    dolzs3.innerHTML = datadolz3;
    dolzs33.innerHTML = datadolz3 - (datadolz3 * saleSum1) / 100;

    if (saleSum1 == 0) {
      dropdownskew.style.display = "none";
      dropdownskewsec.forEach((item) => (item.style.display = "none"));
    }
    // const content = element.innerHTML;
  });
});
dropdownoption2.forEach((item) => {
  item.addEventListener("click", function (event) {
    let saleText = event.target.innerHTML.replace(/\(.*\)*\)/,'');
    saleSum2 = +event.target.dataset.sale;
    dropdownskewsk2.style.display = "flex";
    yearArticle2.innerHTML = saleText;
    skewtext2.innerHTML = saleSum2;
    dolzs4.innerHTML = datadolz4;
    dolzs44.innerHTML = datadolz4 - (datadolz4 * saleSum2) / 100;
    let current = document.querySelector(".selecteditem");
    if (current) {
      let dolzCurrent = current.dataset.dolz5;
      dolzs5.innerHTML =
        dolzCurrent - (dolzCurrent * saleSum2) / 100 + " ₽ / год";
    } else {
      dolzs5.innerHTML = "Индивидуально";
    }
    if (saleSum2 == 0) {
      dropdownskewsk2.style.display = "none";
    }
  });
});

dolzopt1.forEach((item) => {
  item.addEventListener("click", function (event) {
    dolz1.innerHTML = event.target.innerHTML;
    let datadolz = +event.target.dataset.dolz;
    dolzs1.innerHTML = datadolz;
    dolzs11.innerHTML = datadolz - (datadolz * saleSum1) / 100;
    option1.forEach((item) => item.classList.toggle("optionopen"));
    document.querySelector(".arrow_example_li").classList.toggle("openli");
  });
});
dolzopt2.forEach((item) => {
  item.addEventListener("click", function (event) {
    dolz2.innerHTML = event.target.innerHTML;
    let datadolz2 = +event.target.dataset.dolz2;
    dolzs2.innerHTML = datadolz2;
    dolzs22.innerHTML = datadolz2 - (datadolz2 * saleSum1) / 100;
    option2.forEach((item) => item.classList.toggle("optionopen"));
    document.querySelector(".li22").classList.toggle("openli");
  });
});
dolzopt3.forEach((item) => {
  item.addEventListener("click", function (event) {
    dolzopt3.forEach((item) => item.classList.remove("selecteditem"));
    event.target.classList.add("selecteditem");
    let datadolz5 = +event.target.dataset.dolz5;
    dolzs5.innerHTML = datadolz5 - (datadolz5 * saleSum2) / 100 + " ₽ / год";
  });
});
let dolzoptDefault = document.querySelector(".dolzoptdefault");
dolzoptDefault.addEventListener("click", function () {
  dolzopt3.forEach((item) => item.classList.remove("selecteditem"));
  dolzs5.innerHTML = "Индивидуально";
});
