import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getLineByBookAndContext } from "../line/_core";


const parseBookAndContext = (url) => {
    const embedUrl = new URL(url);
    const [_,__, book, bookContext] = embedUrl.pathname.split('/');
    return {
        book,
        bookContext
    };
};

const getEmbedResponse = async (url) => {
    const {book, bookContext} = parseBookAndContext(url);
    const resp = {
        "version": "1.0",
        "type": "rich",
        "width": 240,
        "height": 160,
        "title": `${book} ${bookContext}`,
        "provider_name": "smrthi",
        "provider_url": "http://www.smrthi.com/",
        "html":
		`<object width=\"425\" height=\"344\">
			<param name=\"movie\" value=\"https://www.youtube.com/v/M3r2XDceM6A&fs=1\"></param>
			<param name=\"allowFullScreen\" value=\"true\"></param>
			<param name=\"allowscriptaccess\" value=\"always\"></param>
			<embed src=\"https://www.youtube.com/v/M3r2XDceM6A&fs=1\"
				type=\"application/x-shockwave-flash\" width=\"425\" height=\"344\"
				allowscriptaccess=\"always\" allowfullscreen=\"true\"></embed>
		</object>`,

    };
    return resp;
};

async function handler(req, res) {
    const { url } = req.query;
    try {
        const response = await getEmbedResponse(url);
        return res.json(response);
    } catch(e) {
        return res.status(404).send('NOT FOUND');
    }
}

export default corsWrapper(handler);


```
<blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Now what is this? After Yoga is Exercises, Deepavali is just Festival of Lights, Pranayam is Rhythmic Breathing, Mahabharata is just a Story which is non-Hindu and predates Hinduism apparently 😳 <br><br>There&#39;s got to be a
     limit to <a href="https://twitter.com/hashtag/Hindumisia?src=hash&amp;ref_src=twsrc%5Etfw">#Hindumisia</a> 
     <a href="https://twitter.com/hashtag/Hinduphobia?src=hash&amp;ref_src=twsrc%5Etfw">#Hinduphobia</a>
      <a href="https://t.co/4VtqRVozPb">https://t.co/4VtqRVozPb</a>
    </p>&mdash; Rati #ProtectWithPen (@ratihegde) <a href="https://twitter.com/ratihegde/status/1453191079272988672?ref_src=twsrc%5Etfw">October 27, 2021</a>
</blockquote>
 <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
```