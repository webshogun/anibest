"use client"
import { useState } from "react";
import styles from './toggle.module.css'

const Toggle = () => {
  	const [open, setOpen] = useState(false);
	const [listButtonLabel, setListButtonLabel] = useState('Add to list');
  return ( 
    <>
      <button className={styles.toggle} onClick={() => setOpen(!open)}>
        {listButtonLabel}
      </button>
      {open && (
        <div className={styles.dropdown}>
          {listButtonLabel !== 'planned' && <button className={styles.state}>Planned</button>}
          {listButtonLabel !== 'watched' && <button className={styles.state}>Watched</button>}
          {listButtonLabel !== 'watching' && <button className={styles.state}>Watching</button>}
          {listButtonLabel !== 'abandoned' && <button className={styles.state}>Abandoned</button>}
          {listButtonLabel !== 'Add to list' && <button className={styles.delete}>Delete</button>}
        </div>
      )}
    </>
   );
}
 
export default Toggle;