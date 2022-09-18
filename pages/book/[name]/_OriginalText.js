import Sanscript from '@sanskrit-coders/sanscript';
import Verse from '../../../components/Verse';
import { useSession } from 'next-auth/client';
import LanguageContext from '../../../shared/LanguageContext';
import { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { updateLine } from '../../../fetches/line';
import PencilButton from '../../../components/PencilButton';
const defaultValues = {
    originalText: "" 
};

export default function OriginalText({ line, words }) {
    const [lineState, setLine] = useState({});
    const [editMode, setEditMode] = useState(false);
    const { language } = useContext(LanguageContext);
    const [session] = useSession();
    const { handleSubmit, reset, register, 
        formState, setValue } = useForm({ defaultValues });
    
    const getLines = () => {
        return lineState.lines?.map( (line) => {
            return (<Verse line={line} script={lineState.script} words={lineState.words} key={line}></Verse>)
        });
    };
    useEffect( () => {
        const lines = line.text.split('\n');
        setLine({lines, ...line}); 
        setValue('originalText', Sanscript.t(line.text, line.script, 'itrans')); 
    }, [line]);

    const onOriginalEdit = (e) => {
        const val = e.target.value;
        setValue('originalText', val);
        const text = Sanscript.t(val, 'itrans', lineState.script);
        const lines = text.split('\n');
        setLine({lines, ...line});
    };

    
  const getEditing = (editMode) => {
        if(!editMode) {
            return;
        }
        
        const onSubmit = async (data) => {
            const line = await updateLine(lineState._id, Sanscript.t(data.originalText, 'itrans', lineState.script));
            const lines = line.text.split('\n');
            setLine({lines, ...line}); 
            reset({originalText: Sanscript.t(line.text, line.script, 'itrans')});
            setEditMode(false); 
        };

      return (<form
          className="grid grid-flow-row justify-items-stretch"
                noValidate
                onSubmit={handleSubmit(onSubmit)}>
            <textarea
                    id="originalText"
                    label="Original text"
                    variant="standard"
                    multiline
                    required
                    className="border-2 border-gray-300 rounded-lg p-2 mt-5"
                    {
                        ...formState.errors.originalText ? {error:true} : null
                    }
                    helperText={formState.errors?.originalText?.message}
                    placeholder="Original text of the verse"
                    rows={8}
                    {...register("originalText", {
                        required: {
                            value: true,
                            message: 'Original text is required'
                        }
                    })
                    }
                    onChange={onOriginalEdit} 
                />
            <button className="bg-pink-900 hover:bg-pink-800 text-white mt-5 p-4 rounded-md" type="submit" variant="contained" size="large" fullWidth>Submit</button>
            </form>);
    };

    return (<div className="grid grid-flow-row place-items-center">
        <div className='text-lg'>
            {getLines()}
            
            {getEditing(editMode)}            
        </div>
        {
                session?.user?.authorised &&
                !editMode && (<PencilButton className="bg-pink-900 w-14 h-14 mt-4 hover:bg-pink-800 grid grid-flow-col justify-center content-center rounded-md text-white" onClick={() => setEditMode(true)}>
                    
                </PencilButton>) 
        }
    </div>)
}
