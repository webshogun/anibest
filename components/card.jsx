import Link from 'next/link';
import styles from '@/styles/card.module.css';

const Card = ({ anime }) => {
  return ( 
    <Link className={styles.card} href='/anime/[id]/?menu=info' as={`/anime/${anime.id}/?menu=info`}>
      <img className={styles.poster} src={anime.poster} alt={anime.title} />
      <h2 className={styles.title}>{anime.title}</h2>
      <div className={styles.add}>
        <span className={styles.type}>{anime.type}</span>
        <span className={styles.year}>{anime.year}</span>
      </div>
    </Link>
   );
}
 
export default Card;