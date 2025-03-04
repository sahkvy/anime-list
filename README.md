# Projeto de Animes Assistidos

Este projeto consiste em uma aplicação simples de gerenciamento de animes assistidos, com backend em Flask e frontend em HTML, CSS e JavaScript. A aplicação permite que os usuários visualizem, adicionem, editem e excluam animes de uma lista.

## Estrutura de Pastas

A estrutura de pastas do projeto é a seguinte:

anime-list/ ├── Backend/ ├── uploads
            │            └── app.py
            │
            ├── Frontend/ ├── images
            │             ├── index.html
            │             ├── reset.css
            │             ├── script.js
            │             ├── styles.css
            │
            ├── README.md 
            └── requirements.txt

## Como rodar o projeto

### Pré-requisitos

- Python 3.x
- MySQL
- Dependências do Python
- Servidor local para rodar o frontend (pode ser qualquer servidor estático)

### 1. Instalar dependências do backend

No diretório `Backend`, instale as dependências utilizando o `pip`. Primeiro, crie um ambiente virtual (opcional, mas recomendado):

```bash
python -m venv venv
source venv/bin/activate  # Para sistemas Unix
venv\Scripts\activate     # Para Windows
```
## Em seguida, instale as dependências:

```bash
pip install -r requirements.txt
```

### 2. Configurar o Banco de Dados

Certifique-se de ter o MySQL instalado e em execução.
Crie um banco de dados chamado anime_db:

```bash
CREATE DATABASE anime_db;
```

Crie a tabela anime_list para armazenar os animes:

```bash
CREATE TABLE anime_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);
```

Configure suas credenciais do banco de dados no arquivo app.py (caso as padrão não funcionem):

```bash
db = mysql.connector.connect(
    host="localhost",
    user="root",             
    password="1234567890",   
    database="anime_db"
)
```

### 3. Rodar o Backend

No diretório Backend, execute o servidor Flask:

```bash
python app.py
```
Isso iniciará o backend na URL http://localhost:5000.


### 4. Rodar o Frontend

Para o frontend, você pode apenas abrir o arquivo index.html em seu navegador. Caso queira servir o frontend em um servidor local, basta usar qualquer servidor estático. Por exemplo, com Python:

```bash
python -m http.server 8000
```
Isso irá disponibilizar o frontend na URL http://localhost:8000.

Pode utilizar o live code (extensão do VSCode) se preferir.

### Funcionalidades

* Exibir Animes: O frontend consome a API do backend para listar todos os animes armazenados no banco de dados.
* Adicionar Anime: Ao clicar em "Adicionar Anime", um modal aparece para o usuário inserir o título e a imagem do anime. A imagem é salva no diretório uploads.
* Editar Anime: Ao clicar em "Editar", o título e a imagem do anime podem ser modificados.
* Excluir Anime: O anime pode ser removido da lista com a opção de excluir.

### Importante

O backend ainda está em desenvolvimento. A integração com o Flask está em andamento, assim como a configuração de CORS para permitir que o frontend e o backend se comuniquem corretamente.

Atualmente, a implementação do backend está utilizando o Flask, com endpoints RESTful para obter, adicionar, atualizar e excluir animes:

* GET /getAnimes: Retorna todos os animes cadastrados.
* POST /addAnime: Adiciona um novo anime.
* PUT /updateAnime/<id>: Atualiza um anime existente.
* DELETE /deleteAnime/<id>: Exclui um anime.

No momento, o código está configurado para rodar localmente com um banco MySQL. O CORS está ativado para permitir que o frontend (que roda em um servidor diferente) se conecte ao backend sem restrições de origem cruzada.

### Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.