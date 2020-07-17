import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Typeahead.css";

class Typeahead extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  static propTypes = {
    list: PropTypes.instanceOf(Array).isRequired,
  };
  state = {
    currentFocus: -1,
    filteredOptions: [],
    showOptions: false,
    userInput: "",
  };
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showOptions: false, filteredOptions: [] });
    }
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  inputOnChange = (e) => {
    const { list } = this.props;
    const userInput = e.currentTarget.value;
    const regex = new RegExp(`^${userInput}`, `i`);
    const filteredOptions = list.sort().filter((v) => regex.test(v));

    this.setState({
      currentFocus: -1,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value,
    });
    if (userInput === "") {
      this.setState({ filteredOptions: [] });
    }
  };

  onClick = (e) => {
    this.setState({
      currentFocus: -1,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText,
    });
    return;
  };
  onKeyDown = (e) => {
    const {
      currentFocus,
      filteredOptions,
      showOptions,
      userInput,
    } = this.state;
    if (showOptions && userInput !== "") {
      if (e.keyCode === 13) {
        this.setState({
          currentFocus: -1,
          showOptions: false,
          userInput: filteredOptions[currentFocus],
          filteredOptions: [],
        });
      } else if (e.keyCode === 9 && e.shiftKey) {
        e.preventDefault();
        if (currentFocus === 0) {
          this.refs.search.focus();
        }
        this.setState({ currentFocus: currentFocus - 1 });
      } else if (e.keyCode === 9) {
        e.preventDefault();
        if (currentFocus === filteredOptions.length - 1) {
          return;
        }
        this.setState({ currentFocus: currentFocus + 1 });
      } else if (e.keyCode === 27) {
        this.setState({ showOptions: false });
      }
    }
  };
  renderOptions = () => {
    const {
      filteredOptions,
      showOptions,
      userInput,
      currentFocus,
    } = this.state;
    let optionList;

    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options">
            {filteredOptions.map((optionName, index) => {
              let className;

              //Add variables for substring and span
              let resultSubstring = optionName.substring(0, userInput.length);
              let remainingLetters = optionName.substring(userInput.length);
              let result;

              if (
                //Check that the entered text is equal to beginning of result currently being mapped over
                resultSubstring.toLowerCase() === userInput.toLowerCase()
              ) {
                className = "matching-substring";
                result = (
                  <>
                    {resultSubstring}
                    <span className="remaining-substring">
                      {remainingLetters}
                    </span>
                  </>
                );
              }
              if (index === currentFocus) {
                className = "option-active";
              }
              return (
                <li
                  className={className}
                  key={optionName}
                  onClick={this.onClick}
                >
                  {result}
                </li>
              );
            })}
          </ul>
        );
      }
    }
    return optionList;
  };
  render() {
    const {
      inputOnChange,
      onKeyDown,
      state: { userInput },
    } = this;
    return (
      <>
        <div className="wrapper" ref={this.setWrapperRef}>
          <div className="container">
            <div className="search">
              <input
                type="text"
                ref="search"
                placeholder="search color"
                className="search-box"
                onChange={inputOnChange}
                onKeyDown={onKeyDown}
                value={userInput}
              />
              <input type="submit" value="" className="search-btn" />
            </div>
            {this.renderOptions()}
          </div>
        </div>
      </>
    );
  }
}

export default Typeahead;
