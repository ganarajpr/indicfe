import { gql } from "@apollo/client";
import client from "../apollo-client";

export const addWord = (word, script, language) => {
    const ADD_WORD = gql`
        mutation CreateWordsMutation($createWordsInput: [WordCreateInput!]!) {
            createWords(input: $createWordsInput) {
                words {
                    text,
                    language  
                }
            }
        }
    `;
    return client.mutate({
        mutation: ADD_WORD,
        variables: { 
            createWordsInput : {
                text:word,
                script,
                language
            }
        }
    });
};

export const getWords = () => {
    const GET_WORDS = gql`
        query Query {
            words {
                text,
                language,
                translation {
                    text,
                    language
                }
            }
        }
    `;
    return client.query({
        query: GET_WORDS
    });
}