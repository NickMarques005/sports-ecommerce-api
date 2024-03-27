const { HandleError, HandleSuccess }= require('../utils/handle_response');
const { removeAccents, removeAccentsFromProducts } = require('../utils/handle_text_formats');
const Products = require('../models/product');
const Categories = require('../models/category');
const Suggestions = require('../models/suggestion');

const ProductController = {
    getProductData: async (req, res) => {
        try {

            const productsData = await Products.find();
            const categoriesData = await Categories.find();

            if(!productsData || !categoriesData) return HandleError(res, 404, "Dados não encontrados");
            
            return HandleSuccess(res, 200, "Dados dos produtos encontrados com sucesso", {productsData, categoriesData})
        } catch (err) {
            console.error(`Houve um erro ao enviar os produtos: ${err}`);
            return HandleError(res, 500, "Falha em buscar produtos");
        }
    },

    filterSearchData: async (req, res) => {
        try {
            const {search} = req.body;

            if(!search) return HandleError(res, 400, "A busca está vazia");

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
            })
    
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
    
            return HandleSuccess(res, 200, 'Busca feita com sucesso', { products: filteredProducts, suggestions: filteredSuggestions})
        }
        catch (err) {
            console.error(`Houve um erro ao buscar produtos e sugestões: ${err}`);
            return HandleError(res, 500, "A filtragem de produtos falhou")
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`Id do produto: ${id}`);
            
            const filteredProduct = await Products.findById(id);
            if(!filteredProduct)
            {
                return HandleError(res, 404, "Produto não encontrado");
            }

            return HandleSuccess(res, 200, "Produto encontrado com sucesso", filteredProduct);
    
        } catch (err) {
            console.error(`Houve um erro ao buscar produto: ${err}`);
            return HandleError(res, 500, "Falha ao buscar produto");
        }
    },
}

module.exports = ProductController;