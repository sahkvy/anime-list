function updateAnimeList() {
  const animeList = document.getElementById('animeList');
  animeList.innerHTML = '';

  fetch('http://localhost:5000/getAnimes')
    .then(response => response.json())
    .then(animes => {
      animes.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('body_images_item');
        animeItem.innerHTML = `
          <img class="body_image" src="${anime.image}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        `;
        animeList.appendChild(animeItem);
      });
    })
    .catch(error => console.error('Error fetching animes:', error));
}

document.getElementById('addAnimeBtn').addEventListener('click', () => {
  document.getElementById('animeModal').style.display = 'block';
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('animeModal').style.display = 'none';
});

document.getElementById('saveAnimeBtn').addEventListener('click', () => {
  const title = document.getElementById('animeTitle').value;
  const imageInput = document.getElementById('animeImage');
  const imageFile = imageInput.files[0];

  if (title && imageFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    fetch('http://localhost:5000/addAnime', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Anime added successfully') {
          document.getElementById('animeTitle').value = '';
          imageInput.value = '';
          document.getElementById('animeModal').style.display = 'none';
          updateAnimeList();
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error adding anime:', error);
      });
  } else {
    alert('Please fill in all fields!');
  }
});

window.onload = function () {
  updateAnimeList();
};

document.getElementById('searchInput').addEventListener('input', function () {
  const searchQuery = this.value.toLowerCase();
  const items = document.querySelectorAll('.body_images_item');

  items.forEach(item => {
    const title = item.querySelector('h3').textContent.toLowerCase();
    item.style.display = title.includes(searchQuery) ? 'block' : 'none';
  });
});
