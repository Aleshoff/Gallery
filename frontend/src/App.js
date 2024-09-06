import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Header from "./components/Header";
import Search from "./components/Search";
import ImageCard from "./components/ImageCard";
import { Container, Row, Col } from "react-bootstrap";
import Welcome from "./components/Welcome";

//const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5050";

function App() {
  const [word, setWord] = useState("");

  const [images, setImiges] = useState([]);
  //console.log(images);

  const getSavedImages = async () => {
    try {
      const result = await axios.get(`${API_URL}/images`);
      setImiges(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect( () => {getSavedImages()}, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    //console.log(word);
    // fetch(
    //   `${API_URL}/new-photo?query=${word}`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setImiges([{ ...data, title: word }, ...images]);
    //   })
    //   .catch((error) => console.log(error));

    
    try {
      const result = await axios.get(`${API_URL}/new-photo?query=${word}`);
      setImiges([{ ...result.data, title: word }, ...images]);
    }
    catch (error) {
      console.log(error);
    }

    setWord("");
  };

  const handleDeleteImage = (id) => {
    setImiges(images.filter((image) => image.id !== id));
  };
  //console.log(word);
  //console.log(UNSPLASH_KEY);
  return (
    <div>
      <Header title="Photo Gallery" />
      <Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit} />
      <Container className="mt-4">
        {images.length ? (
          <Row xs={1} md={2} lg={3}>
            {images.map((image, i) => (
              <Col key={i} className="pb-3">
                <ImageCard image={image} deleteImage={handleDeleteImage} />
              </Col>
            ))}
          </Row>
        ) : (
          <Welcome />
        )}
      </Container>
    </div>
  );
}

export default App;
