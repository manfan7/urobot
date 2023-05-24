$(".select-wrapper").click(function () {
  $(this).toggleClass("open2");
  $(".dropdownoption").toggleClass("dropdownoptionop");
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
