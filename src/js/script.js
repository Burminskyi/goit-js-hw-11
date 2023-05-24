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
let query = '';
let gallery = new SimpleLightbox('.gallery a', {
  enableKeyboard: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function handleSubmit(event) {
  event.preventDefault();
  hideLoadMoreBtn();

  const searchQuery = refs.form.searchQuery.value.trim();

  if (query !== '' && query === searchQuery) {
    Notiflix.Notify.failure('Введите новый запрос');
    showLoadMoreBtn();
    return;
  }
  pageNumber = 1;
  refs.gallery.innerHTML = '';
  query = searchQuery;
  if (query === '') {
    return;
  }

  try {
    const data = await getImages(query, pageNumber);
    const images = data.hits;
    const totalHits = data.totalHits;

    notifySuccess(totalHits);

    const markup = await createImagesMarkup(images);

    renderGallery(markup);
    showLoadMoreBtn();
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMoreBtnClick(event) {
  pageNumber += 1;
  try {
    const data = await getImages(query, pageNumber);
    const images = data.hits;
    const totalPages = Math.ceil(data.totalHits / 40);

    if (pageNumber > totalPages) {
      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const markup = await createImagesMarkup(images);
    addMoreImages(markup);
  } catch (error) {
    Notiflix.Notify.failure(error.message);

    hideLoadMoreBtn();
  }
}

function createImagesMarkup(images) {
  if (!images) {
    return;
  }
  const markup = images
    .map(image => {
      return `<a class="gallery-link" href="${image.largeImageURL}"><div class="photo-card">
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
</div></a>`;
    })
    .join('');
  return markup;
}

function renderGallery(markup) {
  refs.gallery.innerHTML = markup;
  gallery.refresh();
  afterGalleryRenderScroll();
}

function addMoreImages(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
  afterGalleryRenderScroll();
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('disabled');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('disabled');
}

function notifySuccess(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function afterGalleryRenderScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// !функции на промисах

// function handleSubmit(event) {
//   event.preventDefault();
//   hideLoadMoreBtn();
//   if (query === refs.form.searchQuery.value.trim()) {
//     //   Notiflix.Notify.failure('Введите новый запрос');
//     //   showLoadMoreBtn();
//     return;
//   }
//   pageNumber = 1;
//   refs.gallery.innerHTML = '';
//   query = refs.form.searchQuery.value.trim();
//   if (query === '') {
//     return;
//   }
//   getImages(query, pageNumber)
//     .then(notifySuccess)
//     .then(createImagesMarkup)
//     .then(renderGallery)
//     .then(showLoadMoreBtn)
//     .catch(error => {
//       console.log(error);
//     });
// }

// function onLoadMoreBtnClick(event) {
//   pageNumber += 1;
//   getImages(query, pageNumber)
//     .then(createImagesMarkup)
//     .then(addMoreImages)
//     .catch(error => {
//       hideLoadMoreBtn();
//       console.log(error);
//     });
// }

// function createImagesMarkup({ hits }) {
//   if (!hits) {
//     return;
//   }
//   const markup = hits
//     .map(image => {
//       return `<a class="gallery-link" href="${image.largeImageURL}"><div class="photo-card">
//   <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b><span>${image.likes}</span>
//     </p>
//     <p class="info-item">
//       <b>Views</b><span>${image.views}</span>
//     </p>
//     <p class="info-item">
//       <b>Comments</b><span>${image.comments}</span>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b><span>${image.downloads}</span>
//     </p>
//   </div>
// </div></a>`;
//     })
//     .join('');
//   return markup;
// }

// function notifySuccess({ totalHits, hits }) {
//   Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//   return { hits };
// }
