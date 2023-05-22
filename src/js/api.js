import axios from 'axios';
import Notiflix from 'notiflix';
const URL =
  'https://pixabay.com/api/?key=36520633-33601e409e13c629bf4b8ecd8&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

async function getImages(request, pageNumber) {
  const response = await axios.get(`${URL}&q=${request}&page=${pageNumber}`);
  const results = response.data;
  console.log('response.data', response.data);

  const { totalHits, hits } = results;

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  return results;
}

export { getImages };
