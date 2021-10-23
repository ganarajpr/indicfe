import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import _ from 'lodash';

export default function WordTranslations (props) {
    const { words, translations } = props;

    const acceptableWords = words?.filter( word => {
        return word !== '|' && word !== '||' &&  !/\s/.test(word);
    });

    const wordTranslationMap = _.reduce( translations, (acc,n) => {
        if(acc[`${n.text}`] && acc[n.text].length) {
            acc[n.text].push(n.translation);
        } else {
            acc[n.text] = [n.translation];
        }
        return acc;
    }, {});

    return ( <>
        <Grid sx={{ flexGrow: 1, pl: 2 }} container spacing={{ xs: 2, md: 3 }} 
            columns={{ xs: 4, md: 12 }}>
            {acceptableWords && acceptableWords.map( (word) => {
                if(wordTranslationMap[word]) {
                    return (<Grid item xs={3} md={4} key={word}>
                        <Typography variant="span" component="span">
                            {word} =        
                        </Typography>
                        <Typography variant="span" component="span">
                            &nbsp;{wordTranslationMap[word]}       
                        </Typography>
                    </Grid>
                    );
                }
            })}
      </Grid>
      </>
    )
  }