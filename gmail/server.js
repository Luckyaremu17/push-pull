require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import Routes from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
Routes(app)
const port = process.env.PORT || 3001;


app.listen(port, async() => {
  console.log(`server running ${port}`);
})


