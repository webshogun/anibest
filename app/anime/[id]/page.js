import { pool } from '@/lib/postgresql';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Toggle from '@/components/toggle/toggle';

async function getData(id) {
	const animeQuery = `SELECT a.*, a.date::text, ARRAY_AGG(g.name) AS genres FROM animes AS a JOIN anime_genres AS ag ON a.id = ag.anime_id JOIN genres AS g ON ag.genre_id = g.id WHERE a.id = $1 GROUP BY a.id`;
	const animeValues = [parseInt(id)];
	const { rows: anime } = await pool.query(animeQuery, animeValues);

	return anime[0];
}

export default async function Home({ params }) {
	const { id } = params;
	const { title, average, type, status, series, date, time, studio, description, genres, status_result, rating_result } = await getData(id);

	return (
		<>
			<main>
				<div className='container'>
					<div className={styles.wrapper}>
						<div className={styles.sidebar}>
							<Image
								className={styles.poster}
								src={`https://rxreujotawizwpepiyil.supabase.co/storage/v1/object/public/anime/${title}`}
								alt={title}
								width={250}
								height={355}
								priority={true}
							/>
              <Toggle />
							<ul className={styles.info}>
								<li className={styles.item}>
									Type:{' '}
									<Link className={styles.link} href={`/anime?type=${type}`} as={`/anime?type=${type}`}>
										{type}
									</Link>
								</li>
								<li className={styles.item}>
									Status:{' '}
									<Link className={styles.link} href={`/anime?status=${status}`} as={`/anime?status=${status}`}>
										{status}
									</Link>
								</li>
								{type === 'TV Series' && (
									<li className={styles.item}>
										Series: <span className={styles.link}>{series}</span>
									</li>
								)}
								<li className={styles.item}>
									Year: <span className={styles.link}>{new Date(date).getFullYear()}</span>
								</li>
								<li className={styles.item}>
									Time: <span className={styles.link}>{time}m</span>
								</li>
								<li className={styles.item}>
									Studio:{' '}
									<Link className={styles.link} href={`/studio/${studio}`} as={`/studio/${studio}`}>
										{studio}
									</Link>
								</li>
							</ul>
						</div>
						<div className={styles.content}>
							<div className={styles.header}>
								<h1 className={styles.title}>{title}</h1>
								<div className={styles.average}>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#C1FF3D' className={styles.icon}>
										<path
											fillRule='evenodd'
											d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
											clipRule='evenodd'
										/>
									</svg>
									<span>{average}</span>
								</div>
							</div>
							<div className={styles.tabs}>
								<nav className={styles.menu}>
									<Link href={`/anime/[id]/?menu=info`} as={`/anime/${id}/?menu=info`}>
										Information
									</Link>
									<Link href={`/anime/[id]/?menu=episodes`} as={`/anime/${id}/?menu=episodes`}>
										Series
									</Link>
									<Link href={`/anime/[id]/?menu=characters`} as={`/anime/${id}/?menu=characters`}>
										Characters
									</Link>
									<Link href={`/anime/[id]/?menu=authors`} as={`/anime/${id}/?menu=authors`}>
										Authors
									</Link>
								</nav>
								<>
									<p className={styles.desc}>{description}</p>
									<div className={styles.genres}>
										{genres?.map((genre) => (
											<Link
												className={styles.genre}
												href={`/anime?genre=${genre}`}
												as={`/anime?genre=${genre}`}
												key={genre}
											>
												{genre}
											</Link>
										))}
									</div>
									<div className={styles.ratings}>
										<div className={styles.rating}>
											<h3 className={styles.heading}>On people's lists</h3>
											<div className={styles.table}>
												{status_result?.map((item) => (
													<div className={styles.row} key={item.status}>
														<div className={styles.status}>
															<span>{item.status}</span>
														</div>
														<div className={styles.bar}>
															<div className={styles.result} style={{ width: `${item.percentage}%` }}></div>
														</div>
														<span className={styles.percentage}>{item.percentage}%</span>
														<span className={styles.count}>{item.votes}</span>
													</div>
												))}
											</div>
										</div>
										<div className={styles.rating}>
											<h3 className={styles.heading}>User ratings</h3>
											<div className={styles.table}>
												{rating_result?.map((item) => (
													<div key={item.evaluation} className={styles.row}>
														<span className={styles.status}>{item.evaluation}</span>
														<div>
															<div className={styles.bar}>
																<div className={styles.result} style={{ width: `${item.percentage}%` }}></div>
															</div>
														</div>
														<span className={styles.percentage}>{item.percentage}%</span>
														<span className={styles.count}>{item.votes}</span>
													</div>
												))}
											</div>
										</div>
									</div>
								</>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
