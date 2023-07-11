import Head from 'next/head';
import Card from '@/components/card/card';
import { pool } from '@/lib/postgresql';
import styles from './page.module.css';

async function getData() {
	const query = `SELECT id, title, type, date::text FROM animes`;
	const { rows: ongoing } = await pool.query(query);

	return ongoing
}

export default async function Home() {
	const ongoing = await getData();
	return (
		<>
			<Head>
				<title>AniBest</title>
			</Head>
			<main className={styles.main}>
				<div className='container'>
					<div className={styles.wrapper}>
						<h2 className={styles.heading}>Now on screens</h2>
						<div className={styles.list}>
							{ongoing.map((anime) => (
								<Card key={anime.id} anime={anime} />
							))}
						</div>
					</div>
				</div>
			</main>
		</>
	);
};
