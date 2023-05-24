import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Card from '@/components/card';
import styles from '@/styles/home.module.css';

const Home = () => {
  const supabase = useSupabaseClient();
  const [status, setStatus] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: status } = await supabase.from('anime').select('*').eq('status', 'ongoing');
      const { data: animes } = await supabase.from('anime').select('*');
      const { data: ratings } = await supabase.from('rating').select('*');

      setStatus(status);
      setAnimes(animes);
      setRatings(ratings);
    }

    fetchData();
  }, [supabase]);

  const filterAnimesByRating = (animeId) => {
    const filteredRatings = ratings.filter((rating) => rating.anime_id === animeId);
    const totalEvaluation = filteredRatings.reduce((sum, rating) => sum + rating.evaluation, 0);
    const averageEvaluation = totalEvaluation / filteredRatings.length;

    return averageEvaluation;
  };

  const filteredAnimes = animes.filter((anime) => filterAnimesByRating(anime.id));

  const getAverageEvaluation = (animeId) => {
    const filteredRatings = ratings.filter((rating) => rating.anime_id === animeId);
    const totalEvaluation = filteredRatings.reduce((sum, rating) => sum + rating.evaluation, 0);
    return totalEvaluation / filteredRatings.length;
  };

  animes.forEach((anime) => {
    const hasRating = ratings.some((rating) => rating.anime_id === anime.id);
    if (!hasRating) {
      filteredAnimes.push(anime);
    }
  });

  filteredAnimes.sort((a, b) => {
    const averageEvaluationA = getAverageEvaluation(a.id);
    const averageEvaluationB = getAverageEvaluation(b.id);
    return averageEvaluationB - averageEvaluationA;
  });

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
            {filteredAnimes.map((anime) => (
              <Card key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
