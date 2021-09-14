import { Button, Input, Select, Icon } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import Sanscript from '@sanskrit-coders/sanscript';
export default function TranscriptInput (props) {
    const inputOptions = [
        { key: 'hk', text: 'Harvard Kyoto', value: 'hk' },
        { key: 'iast', text: 'IAST', value: 'iast' },
        { key: 'velthuis', text: 'Velthuis', value: 'velthuis' },
      ];
    const outputOptions = [
        { key: 'devanagari', text: 'Devanagari', value: 'devanagari' },
        { key: 'kannada', text: 'Kannada', value: 'kannada' },
        { key: 'tamil', text: 'Tamil', value: 'tamil' },
      ];
    const [inputMethod, setInputMethod] = useState('hk');
    const [textInput, setTextInput] = useState('');
    const [outputMethod, setOutputMethod] = useState('devanagari');

    const dispatchChange = () => {
        try{
            console.log(textInput, inputMethod, outputMethod);
            const val = Sanscript.t(textInput,inputMethod, outputMethod);
            props.onChange(val);
        }
        catch(e) {
            console.log(e);
        }
    }
    useEffect(() => {
        dispatchChange(); // using camelCase for variable name is recommended.
      }, [textInput, inputMethod, outputMethod]);

    const onInputOptionChange = (e, {value}) => {
        console.log(e, 'input option', value);
        setInputMethod(value);
    };
    const onOutputOptionChange = (e, {value}) => {
        setOutputMethod(value);
    };    
    const onTextChange = (e) => {
        setTextInput(e.target.value);
    };
    return (
        <Input type='text' placeholder='Add Word...'>
            <Select compact options={inputOptions} defaultValue='hk' onChange={onInputOptionChange}/>
            <input onChange={onTextChange}/>
            <Select compact options={outputOptions} defaultValue='devanagari' onChange={onOutputOptionChange}/>
            <Button icon>
                <Icon name='plus' />
            </Button>
      </Input>
    )
  }