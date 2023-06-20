// Get HTML elements
const sections = document.querySelectorAll('section');
const openListButton = document.querySelector('button');
const listModal = sections[1];
const favoritesList = document.querySelector('ul');
const closeButton = document.querySelector('span');

// Haal data op uit local storage, als er geen data is wordt het een lege array
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Fetch data
function fetchMoviesData(movieTitles) {
  const movieContainer = sections[0];

  movieTitles.forEach(movieTitle => {
    const apiUrl = `https://www.omdbapi.com/?apikey=d27400bd&t=${movieTitle}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const movieCard = createMovieCard(data);
        movieContainer.appendChild(movieCard);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
}

// Aanmaken van cards met de juiste data
function createMovieCard(movieData) {
  const card = document.createElement('article');

  const thumbnailContainer = document.createElement('section');
  const thumbnail = document.createElement('img');
  thumbnail.src = movieData.Poster;
  thumbnail.alt = movieData.Title;
  thumbnailContainer.appendChild(thumbnail);

  const title = document.createElement('h2');
  title.textContent = movieData.Title;

  const year = document.createElement('p');
  year.textContent = `Year: ${movieData.Year}`;

  const plot = document.createElement('p');
  plot.textContent = movieData.Plot;

  // Favorieten knop (ster)
  const favoriteButton = document.createElement('div');
  favoriteButton.classList.add('star');
  favoriteButton.setAttribute('tabindex', '0');

  // Checkt of er film data in de array is opgeslagen
  const isFavorite = favoriteMovies.some(movie => movie.Title === movieData.Title);
  if (isFavorite) {
    favoriteButton.classList.add('active');
  }

  // Execute functie voor state styling ster element
  favoriteButton.addEventListener('click', () => {
    toggleFavorite(movieData, favoriteButton);
    favoriteButton.classList.add('rotate-animation');
  favoriteButton.addEventListener('animationend', () => {
    favoriteButton.classList.remove('rotate-animation');
  })
  });

  // Execute functie bij Enter keydown event op de card
  favoriteButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      toggleFavorite(movieData, favoriteButton);
      favoriteButton.classList.add('rotate-animation');
  favoriteButton.addEventListener('animationend', () => {
    favoriteButton.classList.remove('rotate-animation');
  })
    }
  });

  // Focus event
  favoriteButton.addEventListener('focus', () => {
    favoriteButton.classList.add('focused');
  });

  // Remove focus class bij blur event
  favoriteButton.addEventListener('blur', () => {
    favoriteButton.classList.remove('focused');
  });


  card.appendChild(thumbnailContainer);
  card.appendChild(title);
  card.appendChild(year);
  card.appendChild(plot);
  card.appendChild(favoriteButton);

  return card;
}

// Toggle state functie & opslaan van data in de array
function toggleFavorite(movieData, favoriteButton) {
  const index = favoriteMovies.findIndex(movie => movie.Title === movieData.Title);

  if (index > -1) {
    favoriteMovies.splice(index, 1);
    favoriteButton.classList.remove('active');
  } else {
    favoriteMovies.push(movieData);
    favoriteButton.classList.add('active');
  }

  // Stringify data en save in local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

openListButton.addEventListener('click', openListModal);
closeButton.addEventListener('click', closeListModal);

// Open modaalvenster en zet de data in de list items
function openListModal() {
  listModal.style.display = 'block';
  favoritesList.innerHTML = '';
  favoriteMovies.forEach(movie => {
    const listItem = document.createElement('li');
    const thumbnailContainer = document.createElement('section');
    const thumbnail = document.createElement('img');

    thumbnail.src = movie.Poster;
    thumbnail.alt = movie.Title;
    thumbnailContainer.appendChild(thumbnail);

    listItem.appendChild(thumbnailContainer);

    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = movie.Title;

    listItem.appendChild(titleParagraph);
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
const movieTitles = ['Black Mirror', 'Django Unchained', 'The Social Dilemma','Stranger Things', 'Breaking Bad', 'Prison Break', 'The Walking Dead', 'Altered Carbon', 'Lost in Space'];
fetchMoviesData(movieTitles);
