import express from 'express'
import { connectDB } from './config/db.js';
import productRouter from './routes/product.router.js';
import userRouter from './routes/user.router.js';
import { printMsg } from './middlewares/custom.middleware.js';
import { errorHandler } from './middlewares/errors.middleware.js';

// 1. יצירת שרת אקספרס
const app = express();

connectDB();

// הגדרות על השרת

// מקבל באדי מסוג אוביקט גייסון - { ... }
app.use(express.json());
// מקבל באדי מסוג טופס, אם רוצים להעלות תמונה/קובץ - FormData
app.use(express.urlencoded({ extended: true }));


// 2. מה לעשות בכל ניתוב
app.get('/', (req, res) => {
    res.send('Hello World')
});

// יפעיל רק על מה שבא אח"כ
app.use(printMsg);

app.use('/products', productRouter);
app.use('/users', userRouter);

// catch - יתפוס את כל השגיאות
// חייב להיות בסוף
app.use(errorHandler);

// 3. הרצת השרת
// ?? - null/undefined כמו || עבור
const port = process.env.PORT ?? 4000;
app.listen(port, () => {
    // בפעם הראשונה שהשרת עולה
    console.log(`Server is running on http://localhost:${port}`);
});