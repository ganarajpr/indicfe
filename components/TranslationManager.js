import styled from "styled-components";
import { Label, Button, Icon, Grid, Comment } from 'semantic-ui-react'
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/client';

const TranslationManager = (props) => {
    const { translation, onDelete, word } = props;
    const [session] = useSession();

    const handleDeleteTranslation = () => {
        onDelete(word._id, translation.text);
    };

    const isDeletable = () => {
        return session?.user?.id === translation.createdBy;
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
                    { isDeletable() ? <Comment.Action onClick={handleDeleteTranslation}>Delete</Comment.Action> : null }
                    </Comment.Actions>
                </Comment.Content>
            </Comment>)    
};

export default TranslationManager;