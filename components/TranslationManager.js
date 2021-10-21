import { useSession } from 'next-auth/client';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Typography } from "@mui/material";
const TranslationManager = (props) => {
    const { translation, onDelete } = props;
    const [session] = useSession();

    const handleDeleteTranslation = () => {
        onDelete(translation._id);
    };

    const isDeletable = () => {
        return session?.user?.id === translation.user.id;
    };
    const chipLabel = (<>
        <Typography variant="p" component="span" sx={{fontStyle: "bold"}}>
            {translation.text} = 
        </Typography>
        <Typography variant="p" component="span" sx={{fontStyle: "italic"}}>
            &nbsp;{translation.translation}
        </Typography>
    </>);
    return (
        <Stack direction="row" spacing={1}>
          <Chip label={chipLabel} variant="outlined"  onDelete={isDeletable() ? handleDeleteTranslation : null } />
        </Stack>
      ); 
};

export default TranslationManager;