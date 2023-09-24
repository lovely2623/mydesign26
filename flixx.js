


const apikey = "54f4d619735ced747ae091f0ee0c5a2e";

const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending : `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-Us`,
}






function init() {
    fetchTrendingMovies();

    fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndbuildMovieSection(apiPaths.fetchTrending,'Trending Now')
    
   .then (list => {
    const randomnum = parseInt(Math.random()* list.length);
    buildBannerSection(list[randomnum]);
   }).catch(err =>{
    console.error(err);
   });
}

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-cont');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
 const div = document.createElement('div');
 div.innerHTML = `
 <h2 class="banner_title"> ${movie.title}</h2>
 <p class="banner_info">Released on ${movie.release_date}</p>
 <p class="banner_overview">${movie.overview && movie.overview.length>200 ? movie.overview.slice(0,200).trim()+'..': movie.overview}</p>
 <div class="action-button-cont">
     <button class="action-button">
         <i class="fa-solid fa-play"></i> Play
     </button>
     <button class="action-button">
         <i class="fa-solid fa-circle-info"></i>  More Info
     </button>
 </div>
 `;
 div.className = "banner-content container";
 bannerCont.append(div);
}


function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
                fetchAndbuildMovieSection(
                    apiPaths.fetchMoviesList(category.id),
                    category.name
                );
            });
        }
        // console.table(movies);
    })
    .catch(err=>console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results);
        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies, categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(list, categoryName){
    

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = list.map(item => {
        return `
    
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            
        `;
    }).join('');

    const moviesSectionHTML = `
        <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    // append html into movies container
    moviesCont.append(div);
}
window.addEventListener('load',function() {
    init();
    window.addEventListener('scroll', function(){
       const header = document.getElementById('header');
        if (this.window.scrollY>5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})