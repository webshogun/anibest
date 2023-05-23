import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Card from '@/components/card';
import styles from '@/styles/home.module.css'

const Home = () => {
  const supabase = useSupabaseClient();
  const [status, setStatus] = useState([]);
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: status } = await supabase.from('Anime').select('*').eq('status', 'ongoing');
      const { data: animes } = await supabase.from('Anime').select('*');

      setStatus(status);
      setAnimes(animes);
    }

    fetchData();
  }, [supabase]);

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Now on screens</h2>
          <div className={styles.list}>
            {status.map((anime) => (
              <Card key={anime.id} anime={anime} />
            ))}
          </div>
          <h2 className={styles.heading}>Anime</h2>
          <div className={styles.list}>
            {animes.map((anime) => (
              <Card key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;