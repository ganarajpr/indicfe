// import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>
        Home
        </h3>
        <p>
        This is the home of <a href="/book/RigVeda">Rig Veda</a>
        </p>
      </div>
      <div>
        <div>
        <a href="/add-word">Add Word</a>
        </div>
        <div>
          <a href="/add-translation">Add Translation of Word</a>
        </div>
        <div>
          <a href="/add-line">Add Line</a>
        </div>
        <div>
          <a href="/connect-words-in-line">Connect Words in Line</a>
        </div>
        <div>
          <a href="/line/613fb4e9c1a8e095654e5398">Show Line</a>
        </div>
      </div>
  </div>
  )
}


export async function getServerSideProps() {

  return {
    props: {
    }
 };
}