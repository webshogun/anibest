import Head from "next/head";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import styles from "@/styles/character.module.css";

const CharacterPage = ({ supabase }) => {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (id) {
        const { data: character } = await supabase
          .from("characters")
          .select("*")
          .eq("id", parseInt(id))
          .single();

        setCharacter(character);
      }
    }

    fetchData();
  }, [id]);

  if (!character) {
    return <p>error</p>;
  }

  return (
    <>
      <Head>
        <title>{character.name}</title>
      </Head>
      <main className="">
        <div className="container">
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <Image
                className={styles.poster}
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/characters/${character.poster}`}
                alt={character.name}
                width={250}
                height={355}
                priority={true}
              />
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
  );
};

export default CharacterPage;
