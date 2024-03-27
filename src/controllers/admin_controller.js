const Admin = require('../models/admin');
const { HandleError, HandleSuccess } = require('../utils/handle_response');
const { SignToken } = require('../utils/handle_token');

const AdminController = {
    createAdmin: async (req, res) => {
        try {
            const { admin_name, email, password } = req.body;

            if (!admin_name || !email || !password) return HandleError(res, 400, "Falha ao cadastrar admin: Campos não preenchidos corretamente. Tente novamente");

            const registered = await Admin.findOne({ email: email });
            if (registered) return HandleError(res, 400, "Admin já está registrado");
        
            const newAdmin = new Admin({
                name: admin_name,
                email: email,
                password: password,
            });

            console.log("New Admin: ", newAdmin);

            await newAdmin.save();

            return HandleSuccess(res, 200, "Admin criado com sucesso!");
        }
        catch (err) {
            console.error(`Houve um erro ao criar admin: ${err}`);
            return HandleError(res, 500, "Falha na criação de admin");
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const adminData = await Admin.findOne({ email: email });
            if (!adminData) return HandleError(res, 404, "Admin não encontrado");

            const isPassMatched = await adminData.comparePassword(password);
            if (!isPassMatched) return HandleError(res, 400, "Senha incorreta");

            const authData = {
                admin: {
                    id: adminData.id,
                }
            }

            const token = SignToken(authData);

            return HandleSuccess(res, 200, "Conta de admin logada com sucesso", { token: token });
        }
        catch (err) {
            console.error(`Houve um erro ao logar como admin: ${err}`);
            return HandleError(res, 500, "Falha ao logar como admin");
        }
    },
    updateAllProducts: async (req, res) => {
        try {
            const collection = await getCollection();

            const updateResult = await collection.updateMany({}, { $set: { subcategory: "" } });

            if (!updateResult) return HandleError(res, 400, "Houve um erro ao atualizar produtos");

            const updateMessage = `${updateResult.modifiedCount} updated documents`;

            return HandleSuccess(res, 200, updateMessage);
        } catch (err) {
            console.error(`Houve um erro na atualização de produtos: ${err}`);
            return HandleError(res, 500, "Falha na atualização dos produtos no banco de dados");
        }
    },
};

module.exports = AdminController;