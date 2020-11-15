import "./styles.css";
import "./index.html";
import {
  error,
  defaultModules,
} from "../node_modules/@pnotify/core/dist/PNotify.js";
import "../node_modules/@pnotify/core/dist/BrightTheme.css";
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
const imageRef = document.querySelector(".image");
const loadMoreBtnRef = document.querySelector(".load-more-btn");
const scrollHeight = document.body.scrollHeight;

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
    apiService.fetchImages().then((hits) => renderGallery(hits));
  }
}
function onLoadMoreBtnClick(e) {
  apiService.fetchImages().then((hits) => renderGallery(hits));
  scrollGallery();
}
function renderGallery(hits) {
  if (hits.length === 0) {
    debounce(
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
      }),
      500
    );
  } else {
    const galleryAllCardsMarkup = galleryCardMarkup(hits);
    galleryRef.insertAdjacentHTML("beforeend", galleryAllCardsMarkup);
    loadMoreBtnRef.classList.remove("hidden");
  }
}
function scrollGallery(scrollHeight) {
  window.addEventListener(
    "load",
    window.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    })
  );
}
