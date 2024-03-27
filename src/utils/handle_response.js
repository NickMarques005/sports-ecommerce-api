const HandleError = (res, error=400, messageError="Erro desconhecido") => {
    return res.status(error).json({success: false, error: `(${error}) ${error === 500 ? "Erro interno no servidor" : "Houve um erro"} - ${messageError}`});
}

const HandleSuccess = (res, success=200, message, data) => {
    return res.status(success).json({success: true, message: `(${success}) ${message}`, data: data});
}

module.exports = { HandleError, HandleSuccess };