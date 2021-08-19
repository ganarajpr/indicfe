import { gql } from "@apollo/client";
import client from "../apollo-client";

export const addLine = (line, script, language) => {
    const ADD_LINE = gql`
        mutation CreateLineMutation($createLineInput: [LineCreateInput!]!) {
            createLines(input: $createLineInput) {
                lines {
                    text,
                    language  
                }
            }
        }
    `;
    return client.mutate({
        mutation: ADD_LINE,
        variables: { 
            createLineInput: {
                language,
                script,
                text: line,
                number: 1
            }
        }
    });
};

export const connectWordToLine = (word, line) => {
    const CONNECT_LINE_WITH_WORD = gql`
        mutation Mutation($updateLinesWhere: LineWhere, $updateLinesConnect: LineConnectInput) {
            updateLines(where: $updateLinesWhere, connect: $updateLinesConnect) {
                lines {
                    text
                }
            }
        }
    `;
    return client.mutate({
        mutation: CONNECT_LINE_WITH_WORD,
        variables: { 
            updateLinesWhere: {
                text: line
            },
            updateLinesConnect: {
                words: {
                  where: {
                    node: {
                      text: word
                    }
                  }
                }
            }
        }
    });
};

export const getLines = () => {
    const GET_LINES = gql`
        query Query {
            lines {
                text,
                language
            }
        }
    `;
    return client.query({
        query: GET_LINES
    });
}
