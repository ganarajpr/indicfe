import { useForm } from "react-hook-form";
import { useState } from "react";
import { getWords } from "../queries/word";
import { getLines, connectWordToLine } from "../queries/line";
export default function Translation({words, lines}) {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");

  const onSubmit = async (data) => {
    const { word, line } = data;
    console.log(word, line);
    try{
      setResult(JSON.stringify(data));
      const resp = await connectWordToLine(word, line);
    } catch (e) {
      setResult("Error setting data" + e.toString());
    }    
  }

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("line")}>
            <option value=""></option>
            {lines.map( (line) => {
                return <option key={line.text} value={line.text}>{line.text}</option>
            } )}
        </select>
        <select {...register("word")}>
            <option value=""></option>
            {words.map( (word) => {
                return <option key={word.text} value={word.text}>{word.text}</option>
            } )}
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
    const { data:linesData } = await getLines();
    return {
        props: { words : data.words, lines: linesData.lines }
    }
}