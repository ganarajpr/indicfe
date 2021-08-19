import styles from '../styles/Home.module.css'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { addTranslation } from "../queries/translation";
import { getWords } from "../queries/word";
export default function Translation({words}) {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");

  const onSubmit = async (data) => {
    const { word, script, language, translation } = data;
    console.log(word, script, language, translation);
    try{
      setResult(JSON.stringify(data));
      const resp = await addTranslation(translation, script, language, word);
    } catch (e) {
      setResult("Error setting data" + e.toString());
    }
    
  }

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
    <select {...register("word")}>
        <option value=""></option>
         {words.map( (word) => {
             return <option key={word.text} value={word.text}>{word.text}</option>
         } )}
    </select>
      <input {...register("translation")} placeholder="Translation in English" />
      <select {...register("script")}>
        <option value="Roman">Roman</option>
      </select>
      <select {...register("language")}>
        <option value="English">English</option>
      </select>
      <p>{result}</p>
      <input type="submit" />
    </form>
      <a href="/">Go Home</a>
  </div>
  )
}



export async function getServerSideProps(context) {
    const { data } = await getWords();
    return {
        props: { words : data.words}
    }
}