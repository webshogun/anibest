import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/header.module.css';

const Header = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }
        setAvatar(userData?.avatar_url || '');
      }
    };

    fetchUserData();
  }, [user]);


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
      if (showSearch) {
        const { data, error } = await supabase.from('anime').select('*').ilike('title', `%${searchQuery}%`);
  
        if (error) {
          console.error(error);
        } else {
          setSearchResults(data);
        }
      }
    }
  
    fetchSearchResults();
  }, [showSearch, searchQuery]);
  

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
                      <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${result.poster}`} alt={result.title} width={75} height={105} /> 
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
          {user ? (
            <Link className={styles.account} href='/profile'>
              {avatar ? (
                <Image className={styles.avatar} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`} alt={avatar} width={30} height={30} priority={true}  />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </Link>
          ) : (
            <div className={styles.auth}>
              <Link className={styles.login} href='/login'>Sign In</Link>
              <Link className={styles.register} href='/register'>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
   );
}
 
export default Header;