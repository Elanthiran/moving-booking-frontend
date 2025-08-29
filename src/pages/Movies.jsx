import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Compressor from 'compressorjs';
import {
  setTitle,
  setGenre,
  setImage,
  setError,
  setData,
  setReleaseDate,
  setTrailerUrl,
  setSummary
} from '../Redux/slice/CartSlice';

const Movies = ({ fetchData }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.movies);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    image: '',
    trailerUrl: '',
    releaseDate: '',
    summary: '',
    cast: [{ name: '', image: '' }],
  });

  const compressImage = (file, callback) => {
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(result);
      },
      error(err) {
        console.error('Image compression error:', err);
        dispatch(setError('Image compression failed.'));
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      dispatch(setError('Please upload a valid image under 5MB.'));
      return;
    }

    compressImage(file, (result) => {
      dispatch(setImage(result));
      setFormData((prev) => ({ ...prev, image: result }));
    });
  };

  const handleCastChange = (index, field, value) => {
    const updatedCast = [...formData.cast];
    updatedCast[index][field] = value;
    setFormData((prev) => ({ ...prev, cast: updatedCast }));
  };

  const handleCastImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      dispatch(setError('Please upload a valid cast image under 5MB.'));
      return;
    }

    compressImage(file, (result) => {
      handleCastChange(index, 'image', result);
    });
  };

  const addCastMember = () => {
    setFormData((prev) => ({
      ...prev,
      cast: [...prev.cast, { name: '', image: '' }]
    }));
  };

  const removeCastMember = (index) => {
    const updatedCast = formData.cast.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, cast: updatedCast }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      dispatch(setError('Unauthorized. Please log in.'));
      return;
    }

    try {
      const castArray = formData.cast
        .filter((c) => c.name && c.image)
        .map((c) => ({ name: c.name, image: c.image }));

      const response = await axios.post(
        'https://movie-booking-backend-0oi9.onrender.com/api/customers/dataForPosting',
        {
          title: formData.title,
          genre: formData.genre,
          image: formData.image,
          trailerUrl: formData.trailerUrl,
          releaseDate: formData.releaseDate,
          summary: formData.summary,
          cast: castArray,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setData(response.data));
      dispatch(setTitle(''));
      dispatch(setGenre(''));
      dispatch(setImage(''));
      dispatch(setError(''));
      dispatch(setReleaseDate(''));
      dispatch(setTrailerUrl(''));
      dispatch(setSummary(''));

      setFormData({
        title: '',
        genre: '',
        image: '',
        trailerUrl: '',
        releaseDate: '',
        summary: '',
        cast: [{ name: '', image: '' }],
      });

      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchData?.();
      alert('Movie added successfully!');
    } catch (err) {
      console.error(err);
      dispatch(setError('Failed to submit the form.'));
    }
  };

  return (
    <div className="container-fluid my-4 px-3">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <div className="card shadow p-4">
            <h4 className="mb-4 text-center">Add New Movie</h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Movie Poster</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>

              <div className="row">
                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label">Genre</label>
                  <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label">Trailer URL</label>
                  <input
                    name="trailerUrl"
                    value={formData.trailerUrl}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label">Release Date</label>
                  <input
                    name="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="form-control"
                  rows={3}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cast Members</label>
                {formData.cast.map((member, index) => (
                  <div key={index} className="border rounded p-3 mb-3 bg-light">
                    <div className="row gy-2">
                      <div className="col-12 col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Cast Name"
                          value={member.name}
                          onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={(e) => handleCastImageChange(e, index)}
                        />
                      </div>
                    </div>
                    <div className="mt-2 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeCastMember(index)}
                      >
                        Remove Cast
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={addCastMember}
                >
                  + Add Cast Member
                </button>
              </div>

              <div className="d-grid mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
