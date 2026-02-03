
import axios from 'axios';

const listCategories = async () => {
    try {
        const { data } = await axios.get('https://dummyjson.com/products/categories');
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err.message);
    }
};

listCategories();
