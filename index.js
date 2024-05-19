import terminalLink from 'terminal-link';
import ip from 'ip';
// 
import express from "express"
import "dotenv/config"
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser'
// 
import authentication from './Authentication/Auth.js';
import post from './API/post.js';
import get from './API/get.js';
import dlt from './API/delete.js';
import update from './API/update.js';
import counts from './API/counts.js'
import { isAdminAuth } from './Middlewares/AuthenticationMiddleware.js';

const app = express()
const PORT = process.env.PORT || 5000


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
//middlewares
// app.use(cors())
app.use(express.json({limit: '50mb'}))
// app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));


app.get('/', (req, res) => {
  res.send("🚀 Working fine!")
})

app.use(authentication)
app.use(isAdminAuth)
// app.get('/faisal', (res, req) => {
//   res.send('Hello!')
// })
app.use(get)
app.use(counts)
app.use(post)
app.use(dlt)
app.use(update)



app.listen(PORT, () => {
  const localhost = terminalLink('on localhost:', `localhost:${PORT}`);
  const network = terminalLink('On your network:', `${ip.address()}:${PORT}`);
  console.log(`🚀 App is Running\n${localhost}\n${network}`)
})




export default app