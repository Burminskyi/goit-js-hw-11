import axios from 'axios';
import Notiflix from 'notiflix';
const URL =
  'https://pixabay.com/api/?key=36520633-33601e409e13c629bf4b8ecd8&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

async function getImages(request, pageNumber) {
  const response = await axios.get(`${URL}&q=${request}&page=${pageNumber}`);
  const results = response.data;

  const { totalHits, hits } = results;

  if (totalHits === 0) {
    const errorMessage =
      'Sorry, there are no images matching your search query. Please try again.';
    Notiflix.Notify.failure(errorMessage);
    throw new Error(errorMessage);
  }

  return results;
}

export { getImages };
