import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import styles from '@/styles/character.module.css';



const CharacterPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const supabase = useSupabaseClient();
  const [character, setCharacter] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (id) {
        const { data: character } = await supabase.from('Characters').select('*').eq('id', parseInt(id)).single();

        setCharacter(character);
      }
    }

    fetchData();
  }, [id]);

  if (!character) {
    return (
      <p>error</p>
    )
  };

  return (
    <>
      <Head>
        <title>{character.name}</title>
      </Head>
      <main className=''>
        <div className="container">
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <img className={styles.poster} src={character.poster} alt={character.name} />
            </div>
            <div className={styles.right}>
              <div className={styles.top}>
                <h1 className={styles.name}>{character.name}</h1>
              </div>
              <div className={styles.main}>
                <p className={styles.desc}>{character.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
};

export default CharacterPage;