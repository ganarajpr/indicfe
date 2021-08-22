import { gql } from "apollo-server-micro";
const typeDefs = gql`
    type Query {
        getUserByName(name:String!): String
        getUserByEmail(email:String!): String        
    }

    type User {
        userId: String!
        name: String!
        email: String!
        createdAt: DateTime!        
    }

    type Book {
        name: String!
        author: String!
        createdAt: DateTime! 
        creator: User
        chapters: [Chapter!]!
    }

    type Chapter {
        number: Int!
        creator: User
        createdAt: DateTime!
        book: Book
        pages: [Page] 
    }

    type Page {
        number: Int!
        creator: User 
        createdAt: DateTime! 
        paragraphs: [Paragraph!]! 
        chapter: Chapter! 
    }

    type Paragraph {
        number: Int
        creator: User 
        createdAt: DateTime! 
        lines: [Line!]!
        page: Page! 
    }

    type Line {
        number: Int!
        text: String!
        script: String!    
        language: String!
        creator: User 
        createdAt: DateTime!
        words: [Word!]!
        paragraph: Paragraph!
    }

    type Word {
        text: String!
        language: String!
        script: String!
        creator: User
        createdAt: DateTime! 
        line: [Line!]! 
        translation: [Translation!]!
    }

    type Translation {
        text: String!
        language: String!
        script: String!
        creator: User 
        createdAt: DateTime! 
        word: Word!
    }

    type Mutation {
        addWordToLine(word: String!, line: String!): String
    }

`;

export default typeDefs;