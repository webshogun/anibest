import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/card.module.css";

const Card = ({ anime }) => {
  const date = new Date(anime.release_date);
  const year = date.getFullYear();

  return (
    <Link
      className={styles.card}
      href={`/anime/[id]/?menu=info`}
      as={`/anime/${anime.id}/?menu=info`}
    >
      <div className={styles.wrapper}>
        <Image
          className={styles.poster}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${anime.title}`}
          alt={anime.title}
          width={150}
          height={215}
          loading="lazy"
        />
      </div>
      <h2 className={styles.title}>{anime.title}</h2>
      <div className={styles.add}>
        <span className={styles.type}>{anime.type}</span>
        <span className={styles.year}>{year}</span>
      </div>
    </Link>
  );
};

export default Card;
