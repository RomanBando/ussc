import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

connection.query(`
    CREATE TABLE IF NOT EXISTS data (
        ID_COUNT INT AUTO_INCREMENT PRIMARY KEY,
        TEXTBOX1_TEXT VARCHAR(200) NOT NULL,
        TEXTBOX2_TEXT VARCHAR(500) NOT NULL
    );
`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table created or already exists');
    }
});

// Регулярные выражения для различных форматов телефонных номеров
const cityPhoneNumberRegex = /^\d{7}$/;
const cityPhoneNumberWithAreaCodeRegex = /^\d{10}$/;
const mobilePhoneNumberRegex = /^(8|7)\d{10}$/;
const mobilePhoneNumberWithPlusRegex = /^\+7\d{10}$/;

app.post('/save_data', (req, res) => {
    const textbox1Text = req.body.textbox1;
    const textbox2Text = req.body.textbox2;

    if (!textbox1Text || !textbox2Text) {
        return res.status(400).json({ error: 'Заполните все текстовые поля' });
    }

    if (!cityPhoneNumberRegex.test(textbox1Text) &&
        !cityPhoneNumberWithAreaCodeRegex.test(textbox1Text) &&
        !mobilePhoneNumberRegex.test(textbox1Text) &&
        !mobilePhoneNumberWithPlusRegex.test(textbox1Text)) {
        return res.status(400).json({ error: 'Некорректный формат телефонного номера' });
    }

    connection.query('INSERT INTO data (TEXTBOX1_TEXT, TEXTBOX2_TEXT) VALUES (?, ?)', [textbox1Text, textbox2Text], (err, result) => {
        if (err) {
            console.error('Error saving data to the database:', err);
            res.status(500).json({ error: 'Ошибка при сохранении данных в базе данных' });
        } else {
            res.json({ success: 'Данные успешно сохранены', id: result.insertId });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});