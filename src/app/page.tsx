'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

interface Movie { Title: string; Year: string; Poster: string; imdbID: string; }

const Home = () => {
    const [query, setQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            router.push('/login');
            return;
        }
    }, [router]);

    const searchMovies = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/api/search`, { params: { query } });
            setMovies(res.data.Search || []);
        } catch (error) {
            console.error(error);
        }
    };

    const addFavorite = async (movie: Movie) => {
        try {
            setFavorites([...favorites, movie]);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFavorite = async (movie: Movie) => {
        try {
            setFavorites(favorites.filter(fav => fav.imdbID !== movie.imdbID));
        } catch (error) {
            console.error(error);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <form className="max-w-lg mx-auto" onSubmit={searchMovies}>
                    <label aria-label="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            value={query}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                            placeholder="Search for movies..."
                            required
                        />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                    </div>
                </form>
                <div className="mt-4">
                    {movies.length > 0 ? (
                        <>
                            <h2 className='tracking-wide font-semibold'>Search Results:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {movies.map(movie => (
                                    <MovieCard
                                        key={movie.imdbID}
                                        movie={movie}
                                        isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
                                        onFavorite={addFavorite}
                                        onRemoveFavorite={removeFavorite}
                                        type='movie'
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className='text-center mt-5 text-gray-600'>No Data Found!</div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Home;
