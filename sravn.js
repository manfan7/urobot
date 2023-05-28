let control = document.querySelectorAll(".control_class");
let arrowVozm = document.querySelector(".arrow__vozm");

control.forEach((item) =>
  item.addEventListener("click", function () {
    let toggleItem = document.querySelector("#" + item.dataset.toggle);
    toggleItem.classList.toggle("hidden_class");

    arrowVozm.classList.toggle("transform_class");
  })
);
