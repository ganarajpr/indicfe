import LanguageContext from '../shared/LanguageContext';
import { useContext } from "react";
import Sanscript from '@sanskrit-coders/sanscript';

export default function LanguageText ({children, source}) {
    const { language } = useContext(LanguageContext);
    let out = children;
    if(language && language !== source ) {
        out = Sanscript.t(children,source,language);
    }
    return (
        <>
            {out}
        </>
    );
}