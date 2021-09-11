import initMiddleware from "./init-middleware";   
import Cors from 'cors';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  })
)

export default function corsWrapper(handler) {
    return async function corsHandler(req,res) {
        await cors(req, res);
        return handler(req,res);
    }    
}