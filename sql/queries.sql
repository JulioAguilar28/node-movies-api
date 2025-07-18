-- Creación de la base de datos
DROP DATABASE IF EXISTS moviesdb;
CREATE DATABASE moviesdb;

-- Usar la base de datos
USE moviesdb;

-- Crear la tabla de movies
CREATE TABLE movies (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  title VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  director VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  poster TEXT,
  rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movies_genres (
  movies_id BINARY(16) REFERENCES movies(id),
  genres_id INT REFERENCES genres(id),
  PRIMARY KEY (movies_id, genres_id)
);

INSERT INTO genres (name) VALUES
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance');

INSERT INTO movies (title, year, director, duration, poster, rate) VALUES
('The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
('The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
('Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8);

INSERT INTO movies_genres (movies_id, genres_id) VALUES
((SELECT id FROM movies WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM movies WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genres WHERE name = 'Crime')),
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE title = 'Awesome movie'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Awesome movie'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Crime'));

SELECT BIN_TO_UUID(id) id, title, year, director, poster, rate FROM movies;

SELECT BIN_TO_UUID(id) id, title, year, director, poster, rate FROM movies WHERE id = UUID_TO_BIN('7bf5610e-b8c0-11ef-b09c-0aa2127308d1');

DELETE FROM movies WHERE id = UUID_TO_BIN('9b3573ec-b8c0-11ef-b09c-0aa2127308d1');

INSERT INTO movies_genres (movies_id, genres_id) VALUES
((SELECT id FROM movies WHERE title = 'Awesome movie'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Awesome movie'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Crime'));

-- Get movies by action genre
SELECT G.id as genre_id, G.name as genre, M.title
FROM movies_genres MG
INNER JOIN genres G ON G.id = MG.genres_id
INNER JOIN movies M ON MG.movies_id = M.id
WHERE G.name LIKE 'action';
