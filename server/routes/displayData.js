//---displayData.js---//

const express = require('express');
const router = express.Router();

const removeAccents = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


router.post('/productsData', async (req, res) => {
    try {

        console.log("PRODUCTS: ", global.products_data, "\n\n\n");
        console.log("CATEGORIES: ", global.categoryProducts_data, "\n\n\n");
        res.send([global.products_data, global.categoryProducts_data]);
    } catch (err) {
        console.error(err.message);
        res.send("Server Error: Something went wrong in display the data");
    }
});

router.post('/filterSearchData', async (req, res) => {
    try {
        const searchItem = removeAccents(req.body.search.toLowerCase());
        function removeAccentsFromProducts(value) {
            if (value.name) {
                return removeAccents(value.name.toLowerCase())
            }
            else {
                return removeAccents(value.suggestion.toLowerCase())
            }

        }

        const searchItem_keywords = searchItem.split(' ');

        const filteredProducts = global.products_data.filter((product) => {
            return (
                searchItem &&
                product &&
                product.name &&
                searchItem_keywords.every(keyword =>
                    removeAccentsFromProducts(product).includes(keyword)
                )
            );
        })

        const filteredSuggestions = global.suggestions_data.filter((suggestion) => {
            return (
                searchItem &&
                suggestion &&
                suggestion.suggestion &&
                searchItem_keywords.every(keyword =>
                    removeAccentsFromProducts(suggestion).includes(keyword)
                )
            );
        });

        res.send({ filteredProducts, filteredSuggestions });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error: Filter Failed");
    }

});

router.post('/filterIdData', async (req, res) => {
    try {
        const idItem = req.body.id;
        console.log(idItem);

        const filteredProduct = global.products_data.filter((product) => {
            return (
                idItem &&
                product && 
                product._id &&
                product._id == idItem
            );
        });

        res.send({filteredProduct});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error: Filter Failed");
    }
    
})

module.exports = router;