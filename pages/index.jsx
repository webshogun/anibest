import Card from '@/components/card';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/home.module.css'

export async function getStaticProps() {
  const { data: status } = await supabase.from('Anime').select('*').eq('status', 'ongoing');
  const { data: animes } = await supabase.from('Anime').select('*');

  return { 
    props: {
      animes,
      status
    }
  }
}

const Home = ({ animes, status }) => {
  return ( 
    <main className={styles.main}>
      <div className='container'>
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
}
 
export default Home;