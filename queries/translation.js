import { gql } from "@apollo/client";
import client from "../apollo-client";

export const addTranslation = (translation, script, language, word) => {
    const ADD_TRANSLATION = gql`
        mutation CreateTranslationMutation($createTranslationInput: [TranslationCreateInput!]!) {
            createTranslations(input: $createTranslationInput) {
                translations {
                    text,
                    language  
                }
            }
        }
    `;
    return client.mutate({
        mutation: ADD_TRANSLATION,
        variables: { 
            createTranslationInput: {
                language,
                script,
                text: translation,
                word: {
                  connect: {
                    where: {
                      node: {
                        text: word
                      }
                    }
                  }
                }
            }
        }
    });
};
