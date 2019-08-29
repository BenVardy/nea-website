import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

let app = express();
dotenv.config();

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'development') {
    console.log('Serving static files');
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}

app.listen(port, () => console.log(`Server listening on port ${port}`));
