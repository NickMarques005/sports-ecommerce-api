const productService = require('../services/product_service');
const { HandleError, HandleSuccess } = require('../utils/handle_response');

const ProductController = {
    getProductData: async (req, res) => {
        try {
            const { products, categories } = await productService.getProductData();
            return HandleSuccess(res, 200, "Dados dos produtos encontrados com sucesso", { products, categories });
        } catch (err) {
            console.error(`Erro ao enviar os produtos: ${err}`);
            return HandleError(res, 500, `Falha em buscar produtos: ${err.message}`);
        }
    },

    filterSearchData: async (req, res) => {
        try {
            const { search } = req.body;
            const { products, suggestions } = await productService.filterSearchData(search);
            return HandleSuccess(res, 200, 'Busca feita com sucesso', { products, suggestions });
        } catch (err) {
            console.error(`Erro ao buscar produtos e sugestões: ${err}`);
            return HandleError(res, 500, `Falha na filtragem de produtos: ${err.message}`);
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            return HandleSuccess(res, 200, "Produto encontrado com sucesso", product);
        } catch (err) {
            console.error(`Erro ao buscar produto: ${err}`);
            return HandleError(res, 500, `Falha ao buscar produto: ${err.message}`);
        }
    }
}

module.exports = ProductController;