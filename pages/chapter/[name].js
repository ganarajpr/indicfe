
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import styles from '../../styles/Home.module.css'

export default function Chapter({ chapter }) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>
        {chapter.name}
        </h3>
        <p>
        {chapter.author}
        </p>
      </div>
      <a href="/">Go Home</a>
  </div>
  )
}



export async function getServerSideProps(context) {
    const chapterName = context.params.name;
    const { data } = await client.query({
      query: gql`
        query Query($chaptersWhere: ChapterWhere) {
          chapters(where: $chaptersWhere) {
            name
            author
          }
        }
      `
    }, {
      $chaptersWhere: chapterName
    });
  
    return {
      props: {
        chapter: data.chapters[0]
      },
   };
}