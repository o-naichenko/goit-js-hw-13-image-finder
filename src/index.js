import "./styles.css";
import "./index.html";
import searchFormMarkup from "./tpl/search-form.hbs";
import galleryMarkup from "./tpl/gallery.hbs";
import galleryCardMarkup from "./tpl/gallery-card.hbs";
import ApiService from "./apiService";

const debounce = require("lodash.debounce");
const Handlebars = require("handlebars");
const bodyRef = document.body;
const apiService = new ApiService();

bodyRef.innerHTML = searchFormMarkup();
bodyRef.insertAdjacentHTML("beforeend", galleryMarkup());
const galleryRef = document.querySelector(".gallery");
const searchFormRef = document.getElementById("search-form");
const searchInputRef = document.querySelector(".search-form__input");
galleryRef.addEventListener("click", openLightBox);
const imageRef = document.querySelector(".image");
const loadMoreBtnRef = document.querySelector(".load-more-btn");

searchInputRef.addEventListener("input", debounce(onSearchInput, 500));
loadMoreBtnRef.addEventListener("click", onLoadMoreBtnClick);

function clearGallery() {
  galleryRef.innerHTML = "";
  loadMoreBtnRef.classList.add("hidden");
}

function onSearchInput(e) {
  clearGallery();
  apiService.query = e.target.value;
  if (e.target.value.length >= 1) {
    apiService.fetchImages().then(renderGallery);
  }
}
function onLoadMoreBtnClick(e) {
  apiService.fetchImages().then(renderGallery);
}

function renderGallery(info) {
  const galleryAllCardsMarkup = galleryCardMarkup(info);
  galleryRef.insertAdjacentHTML("beforeend", galleryAllCardsMarkup);
  loadMoreBtnRef.classList.remove("hidden");
}

// function scrollLoad() {
//   bodyRef.scrollHeight - bodyRef.scrollTop === bodyRef.clientHeight
//     ? apiService.fetchImages().then(renderGallery)
//     : null;
// }
// scrollLoad();

// Модалка

function closeLightBox(event) {
  event.preventDefault();
  const { code, target } = event;

  if (
    code === "Escape" ||
    target === closelightBoxBtnRef ||
    target === lightBoxOverlayRef
  ) {
    lightBoxRef.classList.remove("is-open");
    window.removeEventListener("click", closeLightBox);
    window.removeEventListener("keydown", closeLightBox);
    window.removeEventListener("keydown", toggleImages);
  }
}
function openLightBox(event) {
  event.preventDefault();
  console.log("click");
  if (event.target.nodeName !== "IMG") {
    return;
  } else {
    lightBoxImageRef.src = event.target.dataset.source;
    lightBoxRef.classList.add("is-open");
    window.addEventListener("keydown", toggleImages);

    toggleImages(event);
  }
  window.addEventListener("click", closeLightBox);
  window.addEventListener("keydown", closeLightBox);
}
function toggleImages(event) {
  event.preventDefault();
  let thisImageIndex = imagePathAll.indexOf(lightBoxImageRef.src);
  if (event.code === "ArrowLeft" && thisImageIndex > 0) {
    lightBoxImageRef.src = imagePathAll[(thisImageIndex -= 1)];
  } else if (
    event.code === "ArrowRight" &&
    thisImageIndex < imagePathAll.length - 1
  ) {
    lightBoxImageRef.src = imagePathAll[(thisImageIndex += 1)];
  } else {
    return;
  }
}
