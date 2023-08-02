const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightbox = document.querySelector('.lightbox');
const closeBtn = lightbox.querySelector('.bx-x');
const downloadImgBtn = lightbox.querySelector('.bx-import');


const apiKey = 'waDI2CLAOCJ5gDFJyKGOUU2eZpcEjVfRomo1fI7CPlueksbb1hw5zobk';

const perPage = 16;
let currentPage = 1;
searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        // console.log(file)
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert('failed to download image!'))
}

const showLightbox = (name, img) =>{
    lightbox.querySelector('img').src = img;
    lightbox.querySelector('span').innerText = name;
    downloadImgBtn.setAttribute('data-img', img)
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'

}

const hideLight = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'Auto'
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick='showLightbox("${img.photographer}","${img.src.large2x}")'>
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class='bx bx-camera'></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick='downloadImg("${img.src.large2x}");event.stopPropagation();'>
                    <i class='bx bx-import'></i>
                </button>
            </div>
        </li>`
    ).join('');
}

const getImages = (apiURL) => {
    // fetching images by API call with authorization header
    loadMoreBtn.innerText ='loading....';
    loadMoreBtn.classList.add('disabled');
    fetch(apiURL, {
        headers: { authorization: apiKey}
    }).then(res => res.json()).then(data => {
        // console.log(data);
        generateHTML(data.photos);
        loadMoreBtn.innerText ='load More';
        loadMoreBtn.classList.remove('disabled');
    }).catch(() => alert('failed to load images!'))
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`)

const loadMoreImages = () =>{
    currentPage++
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL
    getImages(apiURL);
};

const loadSearchImage = (e) => {
    if(e.target.value === '')return searchTerm = null;
    if(e.target.value === '.')return searchTerm = null;

    if(e.key === 'Enter'){
        // console.log('Enter key pressed')
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`)
    }
}

loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImage);
closeBtn.addEventListener('click', hideLight);
downloadImgBtn.addEventListener('click', (e)=> downloadImg(e.target.dataset.img))
