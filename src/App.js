import React, {Component} from 'react';
// import loader image
import loader from './images/loader.svg';
import closeIcon from './images/close-icon.svg';
import Gif from './Gif';

// we pick out our props inside the header component, we can pass down functions as props as well as things like numbers, strings, arrays or objects
const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if there are results show clear button, otherwise show title */}

    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={closeIcon} alt="closeIcon" />{' '}
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img src={loader} className="block mx-auto" alt="loader" /> : hintText}
  </div>
);

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

class App extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      // storing searchTerm in state
      searchTerm: '',
      hintText: '',
      // one giphy data block (including mp4) of all results, but set to null for starters
      // giphy: null,
      // array of gifs (= multiple mp4s)
      gifs: []
    };
  }

  // write our async function as an arrow function
  searchGiphy = async searchTerm => {
    // setting loading state to true, when looking for searchTerm/ loading video
    this.setState({
      loading: true
    });

    try {
      const key = 'TlxRGPXd72MUDwF2ljOeHvxwVhDjLKrO';
      // use fetch with our search term embedded into the `q=term` part of the url
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`
      );
      // this grabs the results data from our json code
      const data = await response.json();
      // check if array of results is empty, if yes, error
      if (!data.data.length) {
        throw `sorry, no results for ${searchTerm}`;
      }
      const randomData = randomChoice(data.data);
      console.log(randomData);

      this.setState((prevState, props) => ({
        ...prevState,
        // giphy: randomData,
        // here we use the spread to take the previous gifs, spread them out and add new random gif data to the end
        gifs: [...prevState.gifs, randomData],
        hintText: `Hit enter to search for more ${searchTerm} gifs`,
        loading: false
      }));
    } catch (error) {
      // alert the user something went wrong
      // we’ll change this later on
      alert(error);
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
    }
  };
  // with "create react app" we can write our methods as arrow function, meaning we don't need the constructor (super props ...) & bind for this
  handleChange = event => {
    // const value = event.target.value is same as:
    const {value} = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
    console.log(value);
  };

  handleKeyPress = event => {
    const {value} = event.target;

    if (value.length > 2 && event.key === 'Enter') {
      // alert(`search for ${value}`);
      this.searchGiphy(value);
    }
  };

  // reset state by clearing everything (searchterm, hinttext, loading) out & make it default again (searchTerm: '',hintText: '', gifs: [])

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));

    // grab input and put cursor back in there
    this.textInput.current.focus();
  };

  render() {
    // const searchTerm = this.state.searchTerm same as:
    const {searchTerm, gifs} = this.state;
    // setting variable to check if we have results
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {/* here we loop over array of gif images from our state & we create multiple videos from it*/}
          {this.state.gifs.map(giphy => (
            <Gif {...giphy} />
          ))}

          <input
            className="input grid-item"
            placeholder="type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            // every time input changes, run handleChange function
            // need to include 'this' since we're using a component as a class
            value={searchTerm}
            ref={this.textInput}
          />
        </div>
        {/* pass in all of our state using a spread */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
