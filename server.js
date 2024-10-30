import mysql from 'mysql2/promise';
import express from 'express';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'miniproject'
});

try {
    await connection.connect();
    console.log("Connected to MySQL!");
} catch (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
}

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Rekomendasi Film Terbaik!');
});

//rekomendasi film 2024
app.get('/movies', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT * FROM rekomendasi_film_2024');
        res.json(results);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/create-movies', async (req, res) => {
    const users = req.body;

    try {
        const promises = users.map(user => {
            const {judul, tahunRilis, genre, batasUsia } = user;
            return connection.query('INSERT rekomendasi_film_2024 (judul, tahunRilis, genre, batasUsia) VALUES (?, ?, ?, ?)', [judul, tahunRilis, genre, batasUsia]);  
        });

        await Promise.all(promises);
        res.status(201).json({ message: 'Users created successfully' });
    } catch (err) {
        console.error('Error creating users:', err);
        res.status(500).json({ error: 'Failed to create users' });
    }
});

app.put('/update-movies', async (req, res) => {
    const users = req.body;

    try {
        const promises = movies.map(movie => {
            const { judul, tahunRilis, genre, batasUsia, id } = movie;
            return connection.query(
                'UPDATE rekomendasi_film_2024 SET judul = ?, tahunRilis = ?, genre = ?, batasUsia = ? WHERE id = ?', 
                [judul, tahunRilis, genre, batasUsia, id]
            );
        });

        await Promise.all(promises);
        res.status(200).json({ message: 'Movies updated successfully' });
    } catch (err) {
        console.error('Error updating movies:', err);
        res.status(500).json({ error: 'Failed to update movies' });
    }
});

app.delete('/delete-movies', async (req, res) => {
    const users = req.body;

    try {
        const promises = movies.map(movie => {
            const { id } = movie;
            return connection.query(
                'DELETE FROM rekemondasi_film_2024 WHERE id = ?', 
                [id]
            );
        });

        await Promise.all(promises);
        res.status(200).json({ message: 'Movies deleted successfully' });
    } catch (err) {
        console.error('Error deleting movies:', err);
        res.status(500).json({ error: 'Failed to delete movies' });
    }
});

process.on('SIGINT', async () => {
    await connection.end();
    console.log('MySQL connection closed.');
    process.exit(0);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});