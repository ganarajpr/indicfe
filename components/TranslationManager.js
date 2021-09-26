import styled from "styled-components";
import { Label, Button, Icon, Grid, Comment } from 'semantic-ui-react'
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/client';

const TranslationManager = (props) => {
    const { translation, onDelete } = props;
    const [session] = useSession();

    const handleDeleteTranslation = () => {
        onDelete(translation._id);
    };

    const isDeletable = () => {
        return session?.user?.id === translation.user.id;
    };
    return (        
            <Comment>
                <Comment.Avatar src={translation.user.image} />
                <Comment.Content>
                    <Comment.Author as='a'><i>{translation.translation}</i></Comment.Author>
                    {/* <Comment.Metadata>
                        <div>{translation.createdAt}</div>
                    </Comment.Metadata>
                    <Comment.Text>{translation.translation}</Comment.Text> */}
                    <Comment.Actions>
                    {/* <Comment.Action>Upvote</Comment.Action>
                    <Comment.Action>Downvote</Comment.Action> */}
                        { isDeletable() ? <Comment.Action onClick={handleDeleteTranslation}>Delete</Comment.Action> : null }
                    </Comment.Actions>
                </Comment.Content>
            </Comment>)    
};

export default TranslationManager;