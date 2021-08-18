
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import styles from '../../styles/Home.module.css'

export default function Book({ book }) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>
        {book.name}
        </h3>
        <p>
        {book.author}
        </p>
      </div>
      <a href="/">Go Home</a>
  </div>
  )
}



export async function getServerSideProps(context) {
    const bookName = context.params.name;
    const { data } = await client.query({
      query: gql`
        query Query($booksWhere: BookWhere) {
          books(where: $booksWhere) {
            name
            author
          }
        }
      `
    }, {
      $booksWhere: bookName
    });
  
    return {
      props: {
        book: data.books[0]
      },
   };
}