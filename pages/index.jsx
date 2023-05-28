import { memo, useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Card from '@/components/card';
import styles from '@/styles/home.module.css';

const MemoizedCard = memo(Card);

const Home = () => {
  const supabase = useSupabaseClient();
  const [animes, setAnimes] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.rpc('get_animes_with_ratings').select('id, title, type, year, poster');
      setAnimes(data);
    }

    fetchData();
  }, [supabase]);

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Anime</h2>
          <div className={styles.list}>
            {animes.map((anime) => (
              <MemoizedCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
