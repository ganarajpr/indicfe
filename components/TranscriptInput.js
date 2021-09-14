import { Button, Input, Select, Icon } from 'semantic-ui-react';
import { useState } from 'react';
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
            const val = Sanscript.t(textInput,inputMethod, outputMethod);
            props.onChange(val);
            console.log(val, textInput);
        }
        catch(e) {
            console.log(e);
        }
    }

    const onInputOptionChange = (e) => {
        setInputMethod(e.target.value);
        dispatchChange();
    };
    const onOutputOptionChange = (e) => {
        setOutputMethod(e.target.value);
        dispatchChange();

    };    
    const onTextChange = (e) => {
        setTextInput(e.target.value);
        console.log(e.target.value);
        dispatchChange();
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