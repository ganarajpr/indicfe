import { useState, useEffect } from "react";
import _ from "lodash";
import { getLine } from "../../../fetches/line";
import LanguageText from "../../../components/LanguageText";

export default function ShowLine({ line }) {
    const [lineState, setLine] = useState({});
    useEffect(() => {
        const lines = line.text.split("\n");
        setLine({ lines, ...line });
    }, [line]);

    const getLines = () => {
        return lineState.lines?.map((line) => {
            return (
              <p
                className="text-center text-gray-700 text-4xl font-serif py-2"
                    key={line}
              >
                {line}
                </p>
            );
        });
    };

    return (
        <div className="my-4 w-full grid">
            <div className="grid grid-flow-col justify-center gap-2 mb-4">
                <img className="w-14 self-center" src="/smrthi-symbol.png" />
                <p
                    className="text-4xl inline justify-center self-center text-slate-700"
                    data-test="bookLocation"
                >
                    <LanguageText source="hk">{line.book}</LanguageText>
                    {" " + line.bookContext}
                </p>
            </div>
            <div className="grid grid-flow-row">
            {getLines()}
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { name, bookContext } = context.params;
    const line = await getLine(name, bookContext);
    return {
        props: {
            line,
        },
    };
}
