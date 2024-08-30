import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;

function App() {
  const [word, setWord] = useState('');
  
  const handleSearchSubmit = (event) => {
  event.preventDefault();
  console.log(word);
  fetch(`https://api.unsplash.com/photos/random/?query=${word}&client_id=${UNSPLASH_KEY}`)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
  };
  //console.log(word);
  //console.log(UNSPLASH_KEY);
  return (
    <div >
      <Header title="Photo Gallery"/>
      <Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit}/>
    </div>
  );
}

export default App;