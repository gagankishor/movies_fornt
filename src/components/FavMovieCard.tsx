'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MovieCardProps {
    movie: {
        Title: string;
        Year: string;
        Poster: string;
        imdbID: string;
    };
    isFavorite: boolean;
    onFavorite: (movie: MovieCardProps['movie']) => void;
    onRemoveFavorite: (movie: MovieCardProps['movie']) => void;
    type: string;
}

const FavMovieCard: React.FC<MovieCardProps> = ({ movie, isFavorite, onFavorite, onRemoveFavorite, type }) => {
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAddToFavorites = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to add favorites.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/favorites/add', movie, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onFavorite(movie);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError('Failed to add movie to favorites');
                router.push('/login');
            } else {
                setError('Failed to add movie to favorites');
                console.error('Error adding to favorites:', error);
            }
        }
    }, [movie, onFavorite, router]);

    const handleRemoveFromFavorites = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to remove favorites.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/favorites/remove', { imdbID: movie.imdbID }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onRemoveFavorite(movie);
        } catch (error) {
            setError('Failed to remove movie from favorites');
            console.error('Error removing from favorites:', error);
        }
    }, [movie, onRemoveFavorite]);

    return (
        <div className="border p-4 rounded shadow">
            <div className="h-[350px] relative">
                <Image
                    src={movie.Poster}
                    alt={movie.Title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded mb-4"
                />
            </div>
            <h2 className="text-lg font-bold mt-2 leading-8">{movie.Title}</h2>  
            <p>{movie.Year}</p>
            {type !== 'favorites' && !isFavorite && (
                <button
                    onClick={handleAddToFavorites}
                    className="w-full text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 text-center mt-2"
                >
                    Add to Favorites
                </button>
            )}
            {type !== 'favorites' && isFavorite && (
                <button
                    onClick={handleRemoveFromFavorites}
                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 text-center mt-2"
                >
                    Remove from Favorites
                </button>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default FavMovieCard;
