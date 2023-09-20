import { Notify } from "notiflix";
import "notiflix/dist/notiflix-3.2.6.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImgs } from "./js/img_api";
// import InfiniteScroll from 'infinite-scroll';



const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

let page;
let valueForSearch = '';

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadClick);

const lightbox = new SimpleLightbox('.gallery a');
        
function creatGallery(arr, container) {
  const markupImg = arr.map(({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads }) => `
        <a class="link-item-card" href=${largeImageURL}>
            <div class="photo-card">
                <img class="img-card"src=${webformatURL} width=250  alt=${tags} loading="lazy" />
                <div class="info">
                    <p class="info-item">
                    <b>Likes: ${likes}</b>
                    </p>
                    <p class="info-item">
                    <b>Views: ${views}</b>
                    </p>
                    <p class="info-item">
                    <b>Comments: ${comments}</b>
                    </p>
                    <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                    </p>
                </div>
            </div>
        </a>

`)
  container.insertAdjacentHTML("beforeend", markupImg);
}

async function onSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.target.elements;
  valueForSearch = searchQuery.value.trim();

  gallery.innerHTML = '';
  page = 1;

    if (!valueForSearch) {
    loadMoreBtn.style.display = 'none';
    Notify.info('Please enter your request.');
    return;
  }

  try {
      const { hits, totalHits } = await fetchImgs(valueForSearch, page);
      
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    creatGallery(hits, gallery);
    lightbox.refresh();
    searchForm.reset();
    Notify.success(`"Hooray! We found ${totalHits} images.`);

    if (totalHits > 40) {
      loadMoreBtn.style.display = 'block';
    } else {
      hideLoadBtn();
      }
      
  } catch (error) {
      Notify.failure('Ooops...Something went wrong!');
  }
}

async function onLoadClick() {
  page += 1;

  try {
    const { hits, totalHits } = await fetchImgs(valueForSearch, page);

    creatGallery(hits, gallery);
    lightbox.refresh();
    scrollPage();

    if (totalHits <= page * 40) {
      hideLoadBtn();
    }
  } catch (error) {
      Notify.failure('Ooops...Something went wrong!');
  }
}

function hideLoadBtn() {
  loadMoreBtn.style.display = 'none';
  Notify.info("We're sorry, but you've reached the end of search results!");
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}