const Products = require('../models/product');
const Categories = require('../models/category');
const Suggestions = require('../models/suggestion');
const { removeAccents, removeAccentsFromProducts } = require('../utils/handle_text_formats');

class ProductService {
    async getProductData() {
        try {
            const products = await Products.find();
            const categories = await Categories.find();

            if (!products || !categories) {
                throw new Error("Dados não encontrados");
            }

            return { products, categories };
        } catch (err) {
            throw new Error(`Falha ao buscar produtos: ${err.message}`);
        }
    }

    async filterSearchData(search) {
        try {
            if (!search) {
                throw new Error("A busca está vazia");
            }

            const searchItem = removeAccents(search.toLowerCase());
            const searchItem_keywords = searchItem.split(' ');

            const productsData = await Products.find();
            const suggestionsData = await Suggestions.find();

            const filteredProducts = productsData.filter((product) => {
                return (
                    searchItem &&
                    product &&
                    product.name &&
                    searchItem_keywords.every(keyword =>
                        removeAccentsFromProducts(product).includes(keyword)
                    )
                );
            });

            const filteredSuggestions = suggestionsData.filter((suggestion) => {
                return (
                    searchItem &&
                    suggestion &&
                    suggestion.suggestion &&
                    searchItem_keywords.every(keyword =>
                        removeAccentsFromProducts(suggestion).includes(keyword)
                    )
                );
            });

            return { products: filteredProducts, suggestions: filteredSuggestions };
        } catch (err) {
            throw new Error(`Falha ao filtrar produtos: ${err.message}`);
        }
    }

    async getProductById(id) {
        try {
            console.log(`Id do produto: ${id}`);

            const filteredProduct = await Products.findById(id);
            if (!filteredProduct) {
                throw new Error("Produto não encontrado");
            }

            return filteredProduct;
        } catch (err) {
            throw new Error(`Falha ao buscar produto: ${err.message}`);
        }
    }
}

module.exports = new ProductService();