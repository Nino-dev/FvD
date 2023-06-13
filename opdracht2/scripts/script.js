// Get HTML elements
const sections = document.querySelectorAll('section');
const openListButton = document.querySelector('button');
const listModal = sections[1];
const favoritesList = document.querySelector('ul');
const closeButton = document.querySelector('span');

// Array waar de favorieten worden opgeslagen
const favoriteMovies = [];

// Fetch data
function fetchMoviesData(movieTitles) {

  const movieContainer = sections[0];

  movieTitles.forEach(movieTitle => {
    const apiUrl = `https://www.omdbapi.com/?apikey=d27400bd&t=${movieTitle}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Create card element voor iedere film
        const movieCard = createMovieCard(data);
        // Card elementen in de parent container gezet
        movieContainer.appendChild(movieCard);
      })
      .catch(error => {
        // Error handling
        console.error('Error:', error);
      });
  });
}

// Aanmaken van cards met de juiste data
function createMovieCard(movieData) {

  const card = document.createElement('article');
  const thumbnail = document.createElement('img');

  thumbnail.src = movieData.Poster;
  thumbnail.alt = movieData.Title;
  card.appendChild(thumbnail);

  const title = document.createElement('h2');
  title.textContent = movieData.Title;

  const year = document.createElement('p');
  year.textContent = `Year: ${movieData.Year}`;

  const plot = document.createElement('p');
  plot.textContent = movieData.Plot;

  // Favorieten knop (ster)
  const favoriteButton = document.createElement('div');
  favoriteButton.classList.add('star');

  // Toggle state styling
  favoriteButton.addEventListener('click', () => {
    toggleFavorite(movieData, favoriteButton);
  });

  card.appendChild(title);
  card.appendChild(year);
  card.appendChild(plot);
  card.appendChild(favoriteButton);

  return card;
}

// Functie voor de state
function toggleFavorite(movieData, starElement) {
  const index = favoriteMovies.findIndex(movie => movie.Title === movieData.Title);

  if (index > -1) {
    favoriteMovies.splice(index, 1);
    starElement.classList.remove('active');
  } else {
    favoriteMovies.push(movieData);
    starElement.classList.add('active');
  }
}

openListButton.addEventListener('click', openListModal);
closeButton.addEventListener('click', closeListModal);

// Open modaalvenster en zet de data in de list items
function openListModal() {
  listModal.style.display = 'block';
  favoritesList.innerHTML = '';
  favoriteMovies.forEach(movie => {
    const listItem = document.createElement('li');
    listItem.textContent = movie.Title;
    favoritesList.appendChild(listItem);
  });
}

// Close modaalvenster
function closeListModal() {
  listModal.style.display = 'none';
}

// Modaalvenster hidden by default
closeListModal();

// Executen van functie en definieren van movieTitle(s)
const movieTitles = ['Avengers Endgame', 'Django Unchained', 'The Social Dilemma'];
fetchMoviesData(movieTitles);
