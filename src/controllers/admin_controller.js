const { default: mongoose } = require('mongoose');
const Admin = require('../models/admin');
const { HandleError, HandleSuccess } = require('../utils/handle_response');
const { SignToken } = require('../utils/handle_token');
const fs = require('fs');
const path = require('path');
const collectionModels = require('../utils/collections');

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
    addNewItemsViaJSON: async (req, res) => {
        try {
            const { archive, collectionToAdd } = req.body;

            if(!archive || !collectionToAdd) return HandleError(res, 400, "Preencha os campos corretamente para poder adicionar os itens");

            const forbiddenCollections = ['forms_data', 'admin_data'];
            if(forbiddenCollections.includes(collectionToAdd)) return HandleError(res, 400, "Coleção não permitida");

            if(!collectionModels[collectionToAdd]) return HandleError(res, 400, "Coleção não existe no banco de dados ou não é permitida para alterações");
            
            const filePath = path.join(__dirname, '..', 'data_example', archive);

            if(!fs.existsSync(filePath)) return HandleError(res, 404, "Archive JSON não encontrado");

            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const Model = collectionModels[collectionToAdd];

            let addedItems = [];

            for(const item of data)
            {
                const itemExists = await Model.findOne({ name: item.name});

                if(!itemExists){
                    const newItem = await new Model(item);
                    await newItem.save();
                    addedItems.push(newItem);
                }
            }

            return HandleSuccess(res, 200, `${addedItems.length} itens foram adicionados à coleção ${collectionToAdd}`, {addedItems});
        } catch (err) {
            console.error(`Houve um erro na atualização de produtos: ${err}`);
            return HandleError(res, 500, "Falha na atualização dos produtos no banco de dados");
        }
    },
};

module.exports = AdminController;