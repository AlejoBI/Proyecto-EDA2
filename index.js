import app from './server/app.js';
import { connectDB } from './server/db.js';

connectDB();
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
}); 