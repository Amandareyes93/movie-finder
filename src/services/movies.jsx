export const searchMovies = async ({ search }) => {
  const KEY = `cf2cafc0`;
  const API_URL = `https://www.omdbapi.com/?apikey=${KEY}&s=${search}`;

  if (search === '') return null;

  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    const movies = json.Search;

    const mappedMovies = movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));

    return mappedMovies;
  } catch (error) {
    throw new Error('Error searching movies');
  }
};
