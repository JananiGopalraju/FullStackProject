

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MovieCarousel from "./MovieCarousel"; // Correct path to the MovieCarousel component
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://fs-project-backend.vercel.app/api/movies";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [images, setImages] = useState([]);
  const [editMovieId, setEditMovieId] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const fileInputRef = useRef(null);
  const formRef = useRef(null); // Reference for scrolling to the form
  const postRef = useRef(null); // Reference for newly created or updated post

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      setMovies(response.data);
    } catch (error) {
      console.log("Error fetching movies:", error);
    }
  };

  const createOrUpdateMovie = async () => {
    if (!title || !description || !genre || !releaseYear) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseYear", releaseYear);
    images.forEach((image) => formData.append("images[]", image));

    try {
      let response;
      if (editMovieId) {
        response = await axios.put(`${API_URL}/${editMovieId}`, formData);
        setMovies(movies.map((movie) => (movie._id === editMovieId ? response.data : movie)));
      } else {
        response = await axios.post(API_URL, formData);
        setMovies((prevMovies) => [...prevMovies, response.data]);
      }
      resetForm();
      postRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the created/updated post
    } catch (error) {
      console.log("Error saving movie:", error.response ? error.response.data : error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedImages]);
    setPreviewImages((prev) => [
      ...prev,
      ...selectedImages.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGenre("");
    setReleaseYear("");
    setImages([]);
    setEditMovieId(null);
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditClick = (movie) => {
    setEditMovieId(movie._id);
    setTitle(movie.title);
    setDescription(movie.description);
    setGenre(movie.genre);
    setReleaseYear(movie.releaseYear);
    setPreviewImages(movie.images.map((image) => `https://fs-project-backend.vercel.app${image}`));

    setImages([]); // Clear selected files, as we don't have access to them
    formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to form section
  };

  const removePreviewImage = (indexToRemove) => {
    setPreviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id)); // Removing movie after API call
    } catch (error) {
      console.log("Error deleting movie:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-center mb-8 text-primary"
      >
        {editMovieId ? "Edit Movie" : "Add New Movie"}
      </motion.h1>

      <motion.div
        ref={formRef}
        className="card bg-base-100 shadow-lg p-8 space-y-6 max-w-3xl mx-auto rounded-lg border border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Form fields */}
        <div className="form-control">
          <label className="label font-semibold text-lg">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered input-accent w-full"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-lg">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered textarea-accent w-full"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-lg">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="input input-bordered input-accent w-full"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-lg">Release Year</label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            className="input input-bordered input-accent w-full"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-lg">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file-input file-input-bordered file-input-accent w-full"
          />
        </div>

        {previewImages.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative w-24 h-24 rounded overflow-hidden shadow-md">
                <img src={src} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
                <button
                  onClick={() => removePreviewImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={createOrUpdateMovie}
            className="btn btn-primary btn-wide"
          >
            {editMovieId ? "Update Movie" : "Create Movie"}
          </button>
          <button
            onClick={resetForm}
            className="btn btn-primary btn-wide"
          >
            Cancel
          </button>
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold mt-8 text-center text-accent">Movies List</h2>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie._id}
              ref={postRef}
              className="card bg-base-200 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              transition={{ type: "spring", stiffness: 300 }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative">
              <MovieCarousel images={movie.images.map((image) => `https://fs-project-backend.vercel.app${image}`)} />

              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-300">{movie.title}</h3>
                <p className="text-gray-500 mt-1">{movie.genre}</p>
                <p className="text-gray-500">{movie.releaseYear}</p>
                <p className="mt-4 text-gray-400">{movie.description}</p>
                <div className="flex justify-between mt-4">
                  <motion.button
                    onClick={() => handleEditClick(movie)}
                    className="btn btn-outline btn-warning"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteMovie(movie._id)}
                    className="btn btn-outline btn-error"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;

