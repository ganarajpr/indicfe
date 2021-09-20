import styled from "styled-components";
import { Label, Button, Icon, Grid, Comment } from 'semantic-ui-react'
import { useState } from 'react';

const TranslationManager = (props) => {
    const { translation, onDelete, word } = props;

    const handleDeleteTranslation = () => {
        onDelete(word._id, translation.text);
    };
    return (        
            <Comment>
                <Comment.Avatar src={translation.user.image} />
                <Comment.Content>
                    <Comment.Author as='a'>{translation.user.name}</Comment.Author>
                    <Comment.Metadata>
                    <div>{translation.createdAt}</div>
                    </Comment.Metadata>
                    <Comment.Text>{translation.text}</Comment.Text>
                    <Comment.Actions>
                    {/* <Comment.Action>Upvote</Comment.Action>
                    <Comment.Action>Downvote</Comment.Action> */}
                    <Comment.Action onClick={handleDeleteTranslation}>Delete</Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
            </Comment>)    
};

export default TranslationManager;