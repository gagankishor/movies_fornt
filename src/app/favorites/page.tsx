'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../../components/MovieCard';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

interface Movie {
    _id: string;
    Title: string;
    Year: string;
    Poster: string;
    imdbID: string;
}

interface Favorite {
    _id: string;
    Title: string;
    Year: string;
    Poster: string;
    imdbID: string;
}
const Favorites = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLoading(false);
                setFavorites(res.data);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                } else {
                    console.error('Failed to fetch favorites:', error);
                }
            }
        };
        fetchFavorites();
    }, [router]);

    const removeFavorite = async (movie: Movie) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/favorites/remove', { _id: movie._id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFavorites(favorites.filter(fav => fav._id !== movie._id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {favorites.map((favorite) => (
                            <MovieCard
                                key={favorite._id}
                                movie={favorite} // Pass Favorite type
                                type="favorites"
                                isFavorite={true}
                                onFavorite={() => {}}
                                onRemoveFavorite={removeFavorite}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
