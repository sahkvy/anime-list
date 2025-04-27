let allAnimes = [];

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

      animeItem.innerHTML = `
        <img class="body_image" src="${imageUrl}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <button class="edit-btn" onclick="openEditModal(${anime.id}, '${anime.title.replace(/'/g, "\\'")}')">Editar</button>
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
      allAnimes = animes;
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
});

document.getElementById('closeModalBtnCreate').addEventListener('click', () => {
  document.getElementById('animeModalCreate').style.display = 'none';
});

document.getElementById('closeModalBtnUpdate').addEventListener('click', () => {
  document.getElementById('animeModalUpdate').style.display = 'none';
});

document.getElementById('saveAnimeBtnCreate').addEventListener('click', () => {
  const title = document.getElementById('animeTitleCreate').value;
  const imageInput = document.getElementById('animeImageCreate');
  const imageFile = imageInput.files[0];

  if (title) {
    const formData = new FormData();
    formData.append('title', title);
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

function openEditModal(id, title) {
  document.getElementById('animeModalUpdate').style.display = 'block';
  document.getElementById('animeIdUpdate').value = id;
  document.getElementById('animeTitleUpdate').value = title;
  document.getElementById('animeImageUpdate').value = '';
}

document.getElementById('saveAnimeBtnUpdate').addEventListener('click', () => {
  const animeId = document.getElementById('animeIdUpdate').value;
  const title = document.getElementById('animeTitleUpdate').value;
  const imageInput = document.getElementById('animeImageUpdate');
  const imageFile = imageInput.files[0];

  if (title && animeId) {
    const formData = new FormData();
    formData.append('title', title);
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

window.onload = fetchAnimes;