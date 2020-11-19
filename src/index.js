import {
  error,
  defaultModules,
} from "../node_modules/@pnotify/core/dist/PNotify.js";
import "../node_modules/@pnotify/core/dist/BrightTheme.css";
const basicLightbox = require("basiclightbox");
// import * as basicLightbox from "basiclightbox";
import searchFormMarkup from "./tpl/search-form.hbs";
import galleryMarkup from "./tpl/gallery.hbs";
import galleryCardMarkup from "./tpl/gallery-card.hbs";
import ApiService from "./apiService";
import "./styles.css";
import "./light-box.scss";
import "./index.html";

const debounce = require("lodash.debounce");
const Handlebars = require("handlebars");
const bodyRef = document.body;
const apiService = new ApiService();

bodyRef.innerHTML = searchFormMarkup();
bodyRef.insertAdjacentHTML("beforeend", galleryMarkup());
const galleryRef = document.querySelector(".gallery");
const searchFormRef = document.getElementById("search-form");
const searchInputRef = document.querySelector(".search-form__input");
const imageRef = document.querySelector(".image");
const loadMoreBtnRef = document.querySelector(".load-more-btn");
const upBtnRef = document.querySelector(".up-btn");
const scrollDownHeight = document.body.scrollHeight;
const scrollUpHeight = document.body.scrollTop;

searchInputRef.addEventListener("input", debounce(onSearchInput, 500));
loadMoreBtnRef.addEventListener("click", debounce(onLoadMoreBtnClick, 500));
upBtnRef.addEventListener("click", onUpBtnClick);

function clearGallery() {
  galleryRef.innerHTML = "";
  loadMoreBtnRef.classList.add("hidden");
  upBtnRef.classList.add("hidden");
}
function onSearchInput(e) {
  clearGallery();
  apiService.query = e.target.value;
  if (e.target.value.length >= 1) {
    apiService.fetchImages().then((hits) => renderGallery(hits));
  }
}
function onLoadMoreBtnClick(e) {
  apiService.fetchImages().then((hits) => renderGallery(hits));
  scrollGallery();
}
function onUpBtnClick(e) {
  window.scrollTo({
    top: scrollUpHeight,
    behavior: "smooth",
  });
}
window.onload = function (scrollDownHeight) {
  window.scrollTo({
    top: scrollDownHeight,
    behavior: "smooth",
  });
};
function scrollGallery() {
  debounce(window.onload(), 100);
}
function renderGallery(hits) {
  if (hits.length === 0) {
    error({
      text: "Try another letters :)",
      type: error,
      styling: "brighttheme",
      title: false,
      animation: "fade",
      animateSpeed: "slow",
      delay: 1500,
      icon: false,
      closer: false,
      sticker: false,
      width: 15,
    });
  } else {
    const galleryAllCardsMarkup = galleryCardMarkup(hits);
    galleryRef.insertAdjacentHTML("beforeend", galleryAllCardsMarkup);
    loadMoreBtnRef.classList.remove("hidden");
    upBtnRef.classList.remove("hidden");
  }
}
let instance = null;
// LIGHT BOX IT`S ALIVE :)
window.addEventListener("click", getLargeImage);
function getLargeImage(e) {
  if (e.target.nodeName === "IMG") {
    instance = basicLightbox
      .create(`<img class="img" src=${e.target.dataset.path}>`)
      .show();
  }
}
