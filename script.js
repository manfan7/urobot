$(".select-wrapper").click(function () {
  $(this).toggleClass("open");
  $(".dropdownoption").toggleClass("dropdownoptionop");
});
$(".item__li-select-wrapper").click(function () {
  $(this).toggleClass("item__li-open");
  $(".item__li-dropdownoption__li").toggleClass(
    "item__li-dropdownoptionop__li"
  );
});
$(".tarif-enterpice-ch").click(function () {
  $(".tarif-enterpice-ch1").toggleClass("opening");
});
