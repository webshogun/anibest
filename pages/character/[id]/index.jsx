import Head from 'next/head';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

import styles from '@/styles/character.module.css';

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data:characters } = await supabase.from('Characters').select('*').eq('id', parseInt(id)).single()

  return {
    props: {
      characters
    },
  };
}

const CharacterPage = ({ characters }) => {

  if (!characters) {
    return (
      <p>error</p>
    )
  };

  return (
    <>
      <Head>
        <title>{characters.name}</title>
      </Head>
      <main className=''>
        <div className="container">
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <img className={styles.poster} src={characters.poster} alt={characters.name} />
            </div>
            <div className={styles.right}>
              <div className={styles.top}>
                <h1 className={styles.name}>{characters.name}</h1>
              </div>
              <div className={styles.main}>
                <p className={styles.desc}>{characters.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
};

export default CharacterPage;