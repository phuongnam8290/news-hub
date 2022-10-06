"use strict";

// For test purpose only
let token = "393760497be8cde1b3ed5045c146adb1";
let headlineUrl = `https://gnews.io/api/v4/top-headlines?token=${token}&lang=en`

retrieveData(headlineUrl);

function retrieveData(url) {
  let collection = document.getElementById("news-collection");
  hideElement(collection);

  let loadingIndicator = document.getElementById("loading-indicator");
  showElement(loadingIndicator);

  let xhr = new XMLHttpRequest();

  xhr.open("GET", url);

  xhr.addEventListener("load", function() {
    if(xhr.status === 200) {
      collection.innerHTML = "";
      let data = JSON.parse(xhr.responseText);
      let articles = data.articles;

      if (articles.length === 0) {
        collection.innerHTML = renderEmptyBlock()
      } else {
        articles.forEach(function(article) {
          let imgUrl = article.image;
          let url = article.url;
          let title = article.title;
          let description = article.description;
          let src = article.source.name;
          let srcUrl = article.source.url;
          let publishDate = new Date(article.publishedAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          }).replaceAll("/", "-");
  
          let newsBlock = renderNewsBlock(imgUrl, url, title, description, src, srcUrl, publishDate);
          collection.innerHTML += newsBlock;
        })
      }

      hideElement(loadingIndicator);
      showElement(collection);
    } else {
      collection.innerHTML = renderError();
    }
  })

  xhr.send()
}

function renderNewsBlock(imgUrl, url, title, description, src, srcUrl, publishDate) {
  let template = `<div class="col-sm-6 col-md-4">
    <div class="card">
      <img class="card-img-top"
          src="${imgUrl}"
          alt="News Image"></img>
      <div class="card-body">
        <h5 class="card-title">
          <a href="${url}" target="_blank">
            ${title}
          </a>
        </h5>
        <p class="card-text">
          ${description}
        </p>
      </div>
      <div class="card-footer d-flex justify-content-between">
        <div class="source">
          <a href="${srcUrl}" target="_blank">
            ${src}
          </a>
        </div>
        <div class="publish-date">
          ${publishDate}
        </div>
      </div>
    </div>
  </div>`;

  return template;
}

function renderEmptyBlock() {
  return `<div class="col-12 d-flex flex-column justify-content-cente align-items-center" id="empty">
    <img src="img/empty.png" alt="Empty result">
    <p>Sorry, but nothing matched your search criteria.</p>
  </div>`
}

function renderError() {
  return `<div class="col-12 d-flex flex-column justify-content-cente align-items-center" id="error">
    <span>
      <i class="fa-solid fa-triangle-exclamation fa-10x"></i>
    </span>
    <p>Oops... something went wrong</p>
  </div>`
}

function showElement(element) {
  element.classList.add("d-flex");
  element.classList.remove("d-none");
}

function hideElement(element) {
  element.classList.add("d-none");
  element.classList.remove("d-flex");
}

// Show search modal when click/input to search input
let searchInputHeader = document.querySelector("header .search");
searchInputHeader.addEventListener("click", showSearchModal);
searchInputHeader.addEventListener("keypress", showSearchModal);

// Hide search modal when click x button or click outside of its 
let closeBtn = document.querySelector(".search-modal .close-btn");
closeBtn.addEventListener("click", hideSearchModal);

let searchModalOverlay = document.querySelector(".modal-overlay");
searchModalOverlay.addEventListener("click", function(event) {
  // If user click outside search modal
  if(event.target === searchModalOverlay) {
    hideSearchModal();
  };
})

function showSearchModal() {
  searchModalOverlay.classList.replace("d-none", "d-flex");

  let searchInputModal = document.querySelector(".search-modal input[type=text]");
  
  // Set focus to search input in modal after element has been rendered
  setTimeout(() => {
    searchInputModal.focus();
  }, 100);
}

function hideSearchModal() {
  searchModalOverlay.classList.replace("d-flex", "d-none");

  // Clear text in search input in header
  searchInputHeader.children.item(1).value = "";
}

// Retrive search data from API
let searchForm = document.querySelector(".search-modal-body form");
searchForm.addEventListener("submit", search);

function search(event) {
  event.preventDefault();

  let formData = new FormData(event.target);

  // Search query need to be encoded before add to url
  let searchQuery = encodeURIComponent(`${formData.get("search")}`);
  let language = formData.get("language");
  let sortBy = formData.get("sort");

  let searchUrl = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=${language}&sortby=${sortBy}&token=${token}`;
  console.log(searchUrl);
  retrieveData(searchUrl);
  hideSearchModal();
}