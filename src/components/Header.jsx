import React from 'react';
<<<<<<< HEAD
import Search from "./Search";

function Header({onItemSelected}) {
=======

function Header() {
>>>>>>> origin/master
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/">OSRS GE</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
<<<<<<< HEAD
          <Search onItemSelected={onItemSelected}/>
        </form>  
=======
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
>>>>>>> origin/master
      </div>
    </nav>
  );
}

export default Header;