import Card from '@/components/card';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/profile.module.css'

const Profile = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [viewedAnime, setViewedAnime] = useState([]);

  useEffect(() => {
    const fetchViewedAnime = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('Favorites')
          .select('animeId')
          .eq('userId', user.id)
          .eq('status', 'watched');

        if (error) {
          console.error('Error fetching viewed anime:', error);
          return;
        }

        if (data.length > 0) {
          const animeIds = data.map((row) => row.animeId);
          const { data: animeData, error: animeError } = await supabase
            .from('Anime')
            .select('*')
            .in('id', animeIds);

          if (animeError) {
            console.error('Error fetching anime details:', animeError);
          } else {
            setViewedAnime(animeData);
          }
        } else {
          setViewedAnime([]);
        }
      }
    };

    fetchViewedAnime();
  }, [user]);
  return ( 
    <main>
      <div className='container'>
        <div className={styles.wrapper}>
          <div>
            <h2 className={styles.heading}>Watched</h2>
            {viewedAnime.length > 0 ? (
              <div className={styles.list}>
                {viewedAnime.map((anime) => (
                  <Card key={anime.id} anime={anime} />
                ))}
              </div>
            ) : (
              <p>No viewed anime found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
   );
}
 
export default Profile;