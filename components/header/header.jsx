import Link from 'next/link';
import styles from './header.module.css';

const Header = () => {
	return (
		<>
			<header className={styles.header}>
				<div className='container'>
					<div className={styles.wrapper}>
						<Link className={styles.logo} href='/'>
							AniBest
						</Link>

						<nav className={styles.menu}>
							<Link className={styles.link} href='/anime'>
								Catalog
							</Link>
							<span className={styles.link}>
								Search
							</span>
							<Link className={styles.link} href='/calendar'>
								Calendar
							</Link>
						</nav>

						<div className={styles.auth}>
							<Link className={styles.login} href='/login'>
								Sign In
							</Link>
							<Link className={styles.register} href='/register'>
								Sign Up
							</Link>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
