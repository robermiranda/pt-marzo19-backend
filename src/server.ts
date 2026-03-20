import express from 'express';
import type { Application } from 'express';
//import cors from 'cors'
import users from './routes/users.ts'
import path from 'path';
import { fileURLToPath } from 'url';

const app: Application = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, '../dist')))
// enable cors for all domains, only for dev stage
// app.use(cors())
// jusn in production
// app.use(cors({
//   origin: 'https://mi-sitio-web.com'
// }));
// this is use for body params in http post request
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
})

app.use('/users', users)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
