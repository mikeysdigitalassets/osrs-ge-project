import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import Login from './Login';

function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      
        <div>
          <div className="list-group list-group-flush">
            <a href="/dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</a>
            <a href="/items" className="list-group-item list-group-item-action bg-light">Items</a>
            <a href="/prices" className="list-group-item list-group-item-action bg-light">Prices</a>
            {user && <a href="/watchlist" className="list-group-item list-group-item-action bg-light">Watch List</a>}
            <div className="ukraine">
              <a href="https://war.ukraine.ua/support-ukraine/">
                <svg 
                  width="100" 
                  height="100" 
                  viewBox="-82.5 0 165 230.5" 
                  fill="#ffd500" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M-81.25 1.25h162.5v172.5a31.25 31.25 0 0 1-18.578029 28.565428L0 228.867475l-62.671971-27.802047A31.25 31.25 0 0 1-81.25 172.5z" fill="#005bbb" stroke="#ffd500" strokeWidth="2.5"/>
                  <path d="M5.985561 78.82382a104.079383 104.079383 0 0 0 14.053598 56.017033 55 55 0 0 1-13.218774 70.637179A20 20 0 0 0 0 212.5a20 20 0 0 0-6.820384-7.021968 55 55 0 0 1-13.218774-70.637179A104.079383 104.079383 0 0 0-5.98556 78.82382l-1.599642-45.260519A30.103986 30.103986 0 0 1 0 12.5a30.103986 30.103986 0 0 1 7.585202 21.063301zM5 193.624749a45 45 0 0 0 6.395675-53.75496A114.079383 114.079383 0 0 1 0 112.734179a114.079383 114.079383 0 0 1-11.395675 27.13561A45 45 0 0 0-5 193.624749V162.5H5z"/>
                  <path id="a" d="M27.779818 75.17546A62.64982 62.64982 0 0 1 60 27.5v145H0l-5-10a22.5 22.5 0 0 1 17.560976-21.95122l14.634147-3.292683a10 10 0 1 0-4.427443-19.503751zm5.998315 34.353887a20 20 0 0 1-4.387889 37.482848l-14.634146 3.292683A12.5 12.5 0 0 0 5 162.5h45V48.265462a52.64982 52.64982 0 0 0-12.283879 28.037802zM42 122.5h10v10H42z"/>
                  <use href="#a" transform="scale(-1 1)"/>
                </svg>
              </a>
              <a href="https://war.ukraine.ua/support-ukraine/">Support Ukraine!</a>
            </div>
          </div>
        </div>
       
    </div>
  );
}

export default Sidebar;
