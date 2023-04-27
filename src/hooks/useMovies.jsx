/* eslint-disable no-debugger */
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { searchMovies } from '../services/movies';
import debounce from 'just-debounce-it';

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search);

  const getMovies = useCallback(async ({ search }) => {
    debugger;
    if (previousSearch.current === search) return;

    try {
      setLoading(true);
      setError(null);

      previousSearch.current = search;
      const newMovies = await searchMovies({ search });
      setMovies(newMovies);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sortedMovies = useMemo(() => {
    return sort ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
  }, [movies, sort]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 300),
    [getMovies]
  );

  useEffect(() => {
    if (!search) return;

    debouncedGetMovies(search);
  }, [debouncedGetMovies, getMovies, search]);

  return { movies: sortedMovies, getMovies, loading, error };
}
