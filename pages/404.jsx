import Link from 'next/link';
import styles from '@/styles/404.module.css';

const Error = () => {
  return ( 
    <main className={styles.main}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            <p className={styles.text}>Page not found</p>
            <Link className={styles.link} href='/'>Back to home</Link>
          </div>
        </div>
      </div>
    </main>
   );
}
 
export default Error;