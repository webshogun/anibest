import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/header.module.css';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
  };

  const handleSearchResultClick = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  useEffect(() => {
    async function fetchSearchResults() {
      const { data, error } = await supabase
        .from('Anime')
        .select('*')
        .ilike('title', `%${searchQuery}%`);

      if (error) {
        console.error(error);
      } else {
        setSearchResults(data);
      }
    }

    fetchSearchResults();
  }, [searchQuery]);

  return ( 
    <header className={styles.header}>
      <div className='container'>
        <div className={styles.wrapper}>
          <Link className={styles.logo} href='/'>AniBest</Link>
          {showSearch ? (
            <div className={styles.inner}>
              <form className={styles.search}>
                  <input className={styles.input} type="text" placeholder="Пошук" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}/>
                  <button className={styles.button} onClick={handleSearchClose}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 13L13 1M1 1L13 13" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
              </form>
              {searchResults.length > 0 && (
                <div className={styles.results}>
                  {searchResults.map((result) => (
                    <Link className={styles.result} key={result.id} href={`/anime/${result.id}/?menu=info`} onClick={handleSearchResultClick}>
                      <img className={styles.poster} src={result.poster} alt={result.title} />
                      <div className={styles.info}>
                        <p className={styles.title}>{result.title}</p>
                        <div className={styles.add}>
                          <span className={styles.type}>{result.type}</span>
                          <span className={styles.year}> {result.year}</span>
                          <span className={styles.status}> {result.status}</span>
                        </div>
                        <div className={styles.genres}>
                          {result.genres?.map((genre) => (
                            <span className={styles.genre}>{genre}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                )}
            </div>
          ) : (
            <ul className={styles.menu}>
              <li className={styles.item}>
                <Link className={styles.link} href='/anime'>Catalog</Link>
              </li>
              <li className={styles.item}>
              <span className={styles.link} onClick={handleSearchClick}>Search</span>
              </li>
              <li className={styles.item}>
                <Link className={styles.link} href='/calendar'>Calendar</Link>
              </li>
            </ul>
          )}
          <div className={styles.auth}>
            <Link className={styles.login} href='/login'>Sign In</Link>
            <Link className={styles.register} href='/register'>Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
   );
}
 
export default Header;