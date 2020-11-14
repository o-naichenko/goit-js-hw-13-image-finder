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

console.log(searchInputRef);

searchInputRef.addEventListener("input", debounce(callback, 500));

function callback(e) {
  apiService.query = e.target.value;
  console.log(apiService.query);
  galleryRef.innerHTML = "";
  if (e.target.value.length >= 1) {
    apiService.fetchImages().then((r) => renderGallery(...[r.hits]));
  }
}

function renderGallery(info) {
  const galleryAllCardsMarkup = galleryCardMarkup(info);
  console.log(galleryAllCardsMarkup);
  galleryRef.insertAdjacentHTML("beforeend", galleryAllCardsMarkup);
}
