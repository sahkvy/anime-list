let allAnimes = [];

function updateAnimeList(filter = '') {
  const animeList = document.getElementById('animeList');
  animeList.innerHTML = '';

  allAnimes
    .filter(anime => anime.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(anime => {
      const animeItem = document.createElement('div');
      animeItem.classList.add('body_images_item');
      animeItem.innerHTML = `
        <img class="body_image" src="${anime.image}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <button class="edit-btn" onclick="openEditModal(${anime.id}, '${anime.title}', '${anime.image}')">Editar</button>
      `;
      animeList.appendChild(animeItem);
    });
}

function fetchAnimes() {
  fetch('http://localhost:5000/getAnimes')
    .then(response => response.json())
    .then(animes => {
      allAnimes = animes;
      updateAnimeList();
    });
}

document.getElementById('searchInput').addEventListener('input', function () {
  updateAnimeList(this.value);
});

document.getElementById('addAnimeBtn').addEventListener('click', () => {
  document.getElementById('animeModalCreate').style.display = 'block';
  document.getElementById('saveAnimeBtn').setAttribute('data-id', '');
  document.getElementById('animeTitle').value = '';
  document.getElementById('animeImage').value = '';
});

document.getElementById('closeModalBtnCreate').addEventListener('click', () => {
  document.getElementById('animeModalCreate').style.display = 'none';
});

document.getElementById('closeModalBtnUpdate').addEventListener('click', () => {
  document.getElementById('animeModalUpdate').style.display = 'none';
});

document.getElementById('saveAnimeBtn').addEventListener('click', () => {
  const title = document.getElementById('animeTitle').value;
  const imageInput = document.getElementById('animeImage');
  const imageFile = imageInput.files[0];
  const animeId = document.getElementById('saveAnimeBtn').getAttribute('data-id');

  if (title && imageFile) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      const newAnime = { title, image: reader.result };

      fetch(`http://localhost:5000/${animeId ? 'updateAnime' : 'addAnime'}`, {
        method: animeId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: animeId, ...newAnime }),
      })
        .then(response => response.json())
        .then(() => {
          document.getElementById('animeModalCreate').style.display = 'none';
          document.getElementById('animeModalUpdate').style.display = 'none';
          fetchAnimes();
        });
    };
  }
});

function openEditModal(id, title, image) {
  document.getElementById('animeModalUpdate').style.display = 'block';
  document.getElementById('saveAnimeBtn').setAttribute('data-id', id);
  document.getElementById('animeTitle').value = title;
}

function deleteAnime(id) {
  fetch('http://localhost:5000/deleteAnime', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
    .then(response => response.json())
    .then(() => fetchAnimes());
}

window.onload = fetchAnimes;
