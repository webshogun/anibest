import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';
import Card from '@/components/card';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/catalog.module.css';

const Catalog = () => {
  const supabase = useSupabaseClient();
  const [animes, setAnimes] = useState([]);
  const router = useRouter();
  const { type = '', status = '', genre = '' } = router.query;

  useEffect(() => {
    async function fetchData() {
      const { data: animes } = await supabase.from('Anime').select('*');

      setAnimes(animes);
    }

    fetchData();
  }, [supabase]);

  const selectedFilters = useMemo(() => ({
    type,
    status,
    genre,
  }), [type, status, genre]);

  const updateFilter = (filter, value) => {
    const filters = { ...selectedFilters, [filter]: value };
    const query = Object.entries(filters).filter(([, value]) => Boolean(value)).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    router.push(`/anime${query ? `?${query}` : ''}`);
  };

  const filteredAnime = useMemo(() => {
    return animes.filter(({ type, status, genres }) => {
      return Object.entries(selectedFilters).reduce((acc, [key, value]) => {
        if (value && key !== 'genre' && key !== 'status') {
          return acc && type === value;
        } else if (value && key === 'genre') {
          return acc && genres?.includes(value);
        } else if (value && key === 'status') {
          return acc && status?.includes(value);
        } else {
          return acc;
        }
      }, true);
    });
  }, [animes, selectedFilters]);

  return ( 
    <>
      <Head>
        <title>Catalog</title>
      </Head>
      <main className=''>
        <div className='container'>
          <div className={styles.wrapper}>
            <div className={styles.main}>
              <div className={styles.list}>
                {filteredAnime.map((anime) => (
                  <Card key={anime.id} anime={anime} />
                ))}
              </div>
            </div>
            <div className={styles.filter}>
              <h2 className={styles.heading}>Type</h2>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.type === "TV Series"} onChange={(e) => updateFilter('type', e.target.checked ? "TV Series" : "")} />TV Series</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.type === "Film"} onChange={(e) => updateFilter('type', e.target.checked ? "Film" : "")} />Film</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.type === "OVA"} onChange={(e) => updateFilter('type', e.target.checked ? "OVA" : "")} />OVA</label>
              <h2 className={styles.heading}>Status</h2>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.status === "completed"} onChange={(e) => updateFilter('status', e.target.checked ? "completed" : "")} />Completed</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.status === "ongoing"} onChange={(e) => updateFilter('status', e.target.checked ? "ongoing" : "")} />Ongoing</label>
              <h2 className={styles.heading}>Genre</h2>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Action"} onChange={(e) => updateFilter('genre', e.target.checked ? "Action" : "")} />Action</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Adventure"} onChange={(e) => updateFilter('genre', e.target.checked ? "Adventure" : "")} />Adventure</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Comedy"} onChange={(e) => updateFilter('genre', e.target.checked ? "Comedy" : "")} />Comedy</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Drama"} onChange={(e) => updateFilter('genre', e.target.checked ? "Drama" : "")} />Drama</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Fantasy"} onChange={(e) => updateFilter('genre', e.target.checked ? "Fantasy" : "")} />Fantasy</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Horror"} onChange={(e) => updateFilter('genre', e.target.checked ? "Horror" : "")} />Horror</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Romance"} onChange={(e) => updateFilter('genre', e.target.checked ? "Romance" : "")} />Romance</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Sci-Fi"} onChange={(e) => updateFilter('genre', e.target.checked ? "Sci-Fi" : "")} />Sci-Fi</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Sports"} onChange={(e) => updateFilter('genre', e.target.checked ? "Sports" : "")} />Sports</label>
              <label className={styles.item}><input type="checkbox" checked={selectedFilters.genre === "Superhero"} onChange={(e) => updateFilter('genre', e.target.checked ? "Superhero" : "")} />Superhero</label>
            </div>
          </div>
        </div>
      </main>
    </>
   );
}
 
export default Catalog;