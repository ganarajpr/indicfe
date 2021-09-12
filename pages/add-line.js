import { useForm } from "react-hook-form";
import { useState } from "react";
// import { addLine } from "../queries/line";
import { addLine } from '../fetches/line';
import { getSession } from 'next-auth/client';
import Layout from '../components/Layout';
import AccessDenied from '../components/accessDenied';

export default function Line({session}) {

  if (!session) { return  <Layout><AccessDenied/></Layout> }
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");

  const onSubmit = async (data) => {
    const { line, script, language } = data;
    console.log(line, script, language);
    try{
      setResult(JSON.stringify(data));
      const resp = await addLine(line, script, language);
    } catch (e) {
      setResult("Error setting data" + e.toString());
    }
    
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea {...register("line")} placeholder="Line" />
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
  </div>
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