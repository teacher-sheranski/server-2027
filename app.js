import express from 'express'

// 1. יצירת שרת אקספרס
const app = express();

// 2. מה לעשות בכל ניתוב
app.get('/', (req, res) => {
    res.send('Hello World')
})

// 3. הרצת השרת
// ?? - null/undefined כמו || עבור
const port = process.env.PORT ?? 4000;
app.listen(port, () => {
    // בפעם הראשונה שהשרת עולה
    console.log(`Server is running on http://localhost:${port}`);
});