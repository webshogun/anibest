import Link from 'next/link';
import { useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const user = useUser();
  const supabase = useSupabaseClient();

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert('Error communicating with Supabase. Make sure to use a real email address!');
      console.log(error);
    } else {
      alert('Check your email for a Supabase Magic Link to log in!');
    }
  }

  console.log(user)

  async function signOut() {
    await supabase.auth.signOut();
  }

  return ( 
    <>
      {user === null ? (
        <main className={styles.main}>
          <div className='container'>
            <div className={styles.wrapper}>
              <div className={styles.left}>
                <div className={styles.inner}>
                  <h1>Welcome!</h1>
                    <input className={styles.input} type="email" placeholder='example@mail.com' onChange={(e) => setEmail(e.target.value)}/>
                    <input className={styles.input} type="password" placeholder='password'/>
                  <div className={styles.add}>
                    <label className={styles.remember}><input type="checkbox" />Remember me</label>
                    <Link className={styles.remember} href='/remember'>Forgot password?</Link>
                  </div>
                  <button className={styles.login} type="submit" onClick={() => signInWithEmail()}>Login</button>
                  <div className={styles.line}></div>
                  <button className={styles.button}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.33325 6.88163C1.67783 6.11592 2.14151 5.42677 2.65624 4.77165C4.21321 2.7978 6.18706 1.40674 8.56929 0.619756C10.2454 0.0667369 11.964 -0.111931 13.7251 0.0667369C15.933 0.287945 17.9281 1.0409 19.7063 2.36389C20.0296 2.60212 20.3401 2.86161 20.6421 3.12961C20.7527 3.22745 20.74 3.2785 20.6421 3.37209C19.5531 4.45686 18.4683 5.54163 17.3836 6.6349C17.2645 6.75401 17.2006 6.70297 17.1113 6.61789C16.3499 5.92874 15.4778 5.42677 14.4866 5.15451C12.4745 4.59724 10.5559 4.83121 8.75222 5.88195C7.22078 6.77528 6.16153 8.08551 5.50216 9.72756C5.46388 9.81689 5.42985 9.91048 5.39582 10.0041C5.35753 9.98705 5.31499 9.97429 5.28096 9.94876C4.60883 9.42127 3.9367 8.89377 3.26031 8.37053C2.62647 7.86856 1.97986 7.3751 1.33325 6.88163Z" fill="#E94235"/>
                      <path d="M5.39997 14.8835C5.69349 15.6663 6.06784 16.4107 6.58258 17.0744C7.65884 18.4612 9.02862 19.4226 10.7472 19.8139C12.8274 20.2904 14.8055 20.0054 16.6433 18.8738C16.6901 18.844 16.7411 18.8185 16.7922 18.793C16.9028 19.0142 17.1325 19.1035 17.3111 19.2524C17.6047 19.4949 17.9025 19.7288 18.2002 19.9628C18.6682 20.3287 19.1361 20.6902 19.6126 21.0476C19.9784 21.3198 20.306 21.6389 20.7016 21.8643C19.8933 22.6428 18.9702 23.2469 17.9578 23.7191C15.8946 24.6805 13.7165 25.0336 11.4619 24.8379C7.50569 24.4933 4.40453 22.6428 2.1329 19.397C1.83087 18.9631 1.55436 18.5079 1.3374 18.023C1.43524 17.9464 1.52883 17.8698 1.62667 17.7933C2.32007 17.253 3.01773 16.717 3.71113 16.181C4.27266 15.7514 4.83844 15.3175 5.39997 14.8835Z" fill="#35A753"/>
                      <path d="M20.7017 21.8642C20.3061 21.6388 19.9785 21.3197 19.6127 21.0475C19.1363 20.6944 18.6683 20.3285 18.2004 19.9627C17.9026 19.7287 17.6048 19.4948 17.3113 19.2523C17.1326 19.1077 16.9029 19.0141 16.7923 18.7929C17.2815 18.41 17.7537 18.0016 18.1323 17.4996C18.6598 16.7977 19.0086 16.0193 19.1958 15.1599C19.2341 14.9898 19.1916 14.96 19.0299 14.96C16.9327 14.9643 14.8355 14.9643 12.734 14.9643C12.4192 14.9643 12.4575 15.0111 12.4532 14.6792C12.4532 13.2244 12.4532 11.7738 12.449 10.3189C12.449 10.153 12.4873 10.1062 12.6617 10.1062C16.4265 10.1105 20.187 10.1105 23.9518 10.1062C24.1304 10.1062 24.173 10.1743 24.1985 10.3317C24.3814 11.4334 24.4325 12.5437 24.3602 13.6583C24.2028 16.1426 23.4881 18.4398 21.9822 20.4519C21.6036 20.9666 21.1909 21.4516 20.7017 21.8642Z" fill="#4286F4"/>
                      <path d="M5.4 14.8835C4.83847 15.3174 4.27269 15.7513 3.71116 16.1852C3.01351 16.7212 2.32011 17.2614 1.62671 17.7974C1.52887 17.874 1.43528 17.9506 1.33744 18.0272C1.04816 17.5082 0.843973 16.9552 0.648289 16.3979C0.47813 15.9172 0.359018 15.4152 0.24416 14.9175C0.15908 14.5389 0.0995244 14.156 0.0654925 13.7689C-0.0153334 12.8926 -0.0280954 12.012 0.0654925 11.1399C0.18035 10.0977 0.405812 9.07676 0.792926 8.09834C0.958831 7.6857 1.10772 7.26455 1.33318 6.87744C1.97979 7.3709 2.6264 7.86437 3.26875 8.36209C3.94513 8.88533 4.61726 9.41708 5.2894 9.94032C5.32343 9.96584 5.36597 9.9786 5.40425 9.99562C5.27238 10.421 5.14901 10.8464 5.09371 11.2846C5.03416 11.7738 4.95333 12.2673 5.00012 12.765C5.05968 13.3988 5.14476 14.0242 5.32343 14.6367C5.34895 14.7261 5.41702 14.7899 5.4 14.8835Z" fill="#FABB06"/>
                    </svg>
                  </button>
                  <span className={styles.text}>Don’t have an account? <Link className={styles.link} href='/register'>Join AniBest</Link></span>
                </div>
              </div>
              <img className={styles.image} src="/images/auth.jpg" alt="" />
            </div>
          </div>
        </main>
      ) : (
        <>
          <p>hello {user.email}</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      )}
    </>
  )
}
 
export default Login;