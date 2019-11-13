import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import calcapi from './calcapi';

dotenv.config();

let app = express();

app.use('/api', calcapi);

let port = process.env.port || 3001;

if (process.env.NODE_ENV !== 'development') {
    console.log('Serving static files');
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
} else {
    // If in dev move make the port 3001
    port = 3001;
}

app.listen(port, () => console.log(`Server listening on port ${port}`));
