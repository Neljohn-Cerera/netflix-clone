import React, { useEffect, useState } from "react";
import axios from "../instances";
import "../css/row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //nag set tag 2nd parameter kay nagdepende ang value sa gawas sa kne nga component
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(fetchUrl);
        //para  mabal an kung unsa and data na nakuha sa response always use console log after para
        //mabal an ang mga data na gamiton gikan sa api
        console.log(response.data.results);
        setMovies(response.data.results);
        return response;
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    //nag set tag value sa 2nd paramater kay nag depende man ang use effect sa url or the fetchurl
    //so sverytime mag change ang fetch url kay mag run ang kani nga useeffect
  }, [fetchUrl]);

  const options = {
    height: "390",
    width: "100%",
    playerVars: {
      //
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>
      <div className="row__poster">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster_image ${
              isLargeRow && "row__poster_image__large"
            }`}
            src={`${baseUrl}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={options} />}
    </div>
  );
}

export default Row;
