import { getImages } from './api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let pageNumber = 0;

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  pageNumber = 1;
  refs.gallery.innerHTML = '';
  const query = refs.form.searchQuery.value;
  getImages(query, pageNumber).then(renderGallery).then(showLoadMoreBtn);
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.gallery.innerHTML = markup;
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('disabled');
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onLoadMoreBtnClick(event) {
  pageNumber += 1;
  console.log(pageNumber);
  const query = refs.form.searchQuery.value;
  getImages(query, pageNumber).then(addMoreImages);
}

function addMoreImages(images) {
  const markup = images
    .map(image => {
      return ` <a class="gallery-link" href="${image.largeImageURL}"><div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
