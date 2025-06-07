let allAnimes = [];

function setupStarRating(containerId, inputId) {
  const container = document.querySelector(`#${containerId} .star-rating`);
  const stars = container.querySelectorAll('.star');
  const ratingInput = document.getElementById(inputId);

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.getAttribute('data-value'));
      ratingInput.value = value;

      stars.forEach(s => {
        const sValue = parseInt(s.getAttribute('data-value'));
        s.classList.toggle('active', sValue <= value);
      });
    });
  });
}

function initializeStarRatings() {
  setupStarRating('animeModalCreate', 'animeRatingCreate');
  setupStarRating('animeModalUpdate', 'animeRatingUpdate');
}

function updateAnimeList(filter = '') {
  const animeList = document.getElementById('animeList');
  animeList.innerHTML = '';

  allAnimes
    .filter(anime => anime.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(anime => {
      const animeItem = document.createElement('div');
      animeItem.classList.add('body_images_item');

      let imageUrl = anime.image;
      if (imageUrl.includes("b'") || imageUrl.includes("'")) {
        imageUrl = imageUrl.replace(/b'/g, '').replace(/'/g, '');
      }

      const rating = anime.rating || 0;
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= rating ? '★' : '☆';
      }

      animeItem.innerHTML = `
        <img class="body_image" src="${imageUrl}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <div class="rating">${starsHtml} (${rating}/5)</div>
        <button class="edit-btn" onclick="openEditModal(${anime.id}, '${anime.title.replace(/'/g, "\\'")}', ${rating})">Editar</button>
      `;
      animeList.appendChild(animeItem);
    });
}

function fetchAnimes() {
  fetch('http://localhost:5000/getAnimes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(animes => {
      allAnimes = animes.map(anime => ({
        ...anime,
        rating: anime.rating || 0
      }));
      updateAnimeList();
    })
    .catch(error => {
      console.error('Error fetching animes:', error);
    });
}

document.getElementById('searchInput').addEventListener('input', function () {
  updateAnimeList(this.value);
});

document.getElementById('addAnimeBtn').addEventListener('click', () => {
  document.getElementById('animeModalCreate').style.display = 'block';
  document.getElementById('animeTitleCreate').value = '';
  document.getElementById('animeImageCreate').value = '';
  document.getElementById('animeRatingCreate').value = 0;
  document.querySelectorAll('#animeModalCreate .star').forEach(star => {
    star.classList.remove('active');
  });
});

document.getElementById('closeModalBtnCreate').addEventListener('click', () => {
  document.getElementById('animeModalCreate').style.display = 'none';
});

document.getElementById('closeModalBtnUpdate').addEventListener('click', () => {
  document.getElementById('animeModalUpdate').style.display = 'none';
});

document.getElementById('saveAnimeBtnCreate').addEventListener('click', () => {
  const title = document.getElementById('animeTitleCreate').value;
  const rating = document.getElementById('animeRatingCreate').value;
  const imageInput = document.getElementById('animeImageCreate');
  const imageFile = imageInput.files[0];

  if (title) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('rating', rating);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    fetch('http://localhost:5000/addAnime', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(() => {
        document.getElementById('animeModalCreate').style.display = 'none';
        fetchAnimes();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error adding anime: ' + error.message);
      });
  } else {
    alert('Title is required');
  }
});

function openEditModal(id, title, rating) {
  document.getElementById('animeModalUpdate').style.display = 'block';
  document.getElementById('animeIdUpdate').value = id;
  document.getElementById('animeTitleUpdate').value = title;
  document.getElementById('animeRatingUpdate').value = rating;
  document.getElementById('animeImageUpdate').value = '';

  const stars = document.querySelectorAll('#animeModalUpdate .star');
  stars.forEach(star => {
    const value = parseInt(star.getAttribute('data-value'));
    star.classList.toggle('active', value <= rating);
  });
}

document.getElementById('saveAnimeBtnUpdate').addEventListener('click', () => {
  const animeId = document.getElementById('animeIdUpdate').value;
  const title = document.getElementById('animeTitleUpdate').value;
  const rating = document.getElementById('animeRatingUpdate').value;
  const imageInput = document.getElementById('animeImageUpdate');
  const imageFile = imageInput.files[0];

  if (title && animeId) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('rating', rating);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    fetch(`http://localhost:5000/updateAnime/${animeId}`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(() => {
        document.getElementById('animeModalUpdate').style.display = 'none';
        fetchAnimes();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error updating anime: ' + error.message);
      });
  }
});

document.getElementById('deleteAnimeBtn').addEventListener('click', () => {
  const animeId = document.getElementById('animeIdUpdate').value;
  if (animeId) {
    if (confirm('Tem certeza que deseja deletar este anime?')) {
      fetch(`http://localhost:5000/deleteAnime/${animeId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          document.getElementById('animeModalUpdate').style.display = 'none';
          fetchAnimes();
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error deleting anime: ' + error.message);
        });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initializeStarRatings();
  fetchAnimes();
});