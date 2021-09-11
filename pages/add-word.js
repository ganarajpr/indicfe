import styles from '../styles/Home.module.css'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { addWord } from "../queries/word";
import { getSession } from 'next-auth/client';

import Layout from '../components/Layout';
import AccessDenied from '../components/accessDenied';

export default function Word({session}) {

  if (!session) { return  <Layout><AccessDenied/></Layout> }


  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");

  const onSubmit = async (data) => {
    const { word, script, language } = data;
    console.log(word, script, language);
    try{
      setResult(JSON.stringify(data));
      const resp = await addWord(word, script, language);
    } catch (e) {
      setResult("Error setting data" + e.toString());
    }
    
  }

  return (
    <Layout>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("word")} placeholder="Word in Sanskrit" />
      <select {...register("script")}>
        <option value="Devanagari">Devanagari</option>
      </select>
      <select {...register("language")}>
        <option value="Sanskrit">Sanskrit</option>
      </select>
      <p>{result}</p>
      <input type="submit" />
    </form>
      <a href="/">Go Home</a>
  </Layout>
  )
}



export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session
    }
  }
}