const Admin = require('../models/admin');
const { SignToken } = require('../utils/handle_token');
const fs = require('fs');
const path = require('path');
const collectionModels = require('../utils/collections');

class AdminService {
    async createAdmin(adminData) {
        const { admin_name, email, password } = adminData;

        if (!admin_name || !email || !password) {
            throw new Error("Campos não preenchidos corretamente");
        }

        const registered = await Admin.findOne({ email });
        if (registered) {
            throw new Error("Admin já está registrado");
        }

        const newAdmin = new Admin({
            name: admin_name,
            email,
            password: password,
        });

        await newAdmin.save();

        return "Admin criado com sucesso!";
    }

    async loginAdmin(adminData) {
        const { email, password } = adminData;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            throw new Error("Admin não encontrado");
        }

        const isPassMatched = await admin.comparePassword(password);
        if (!isPassMatched) return HandleError(res, 400, "Senha incorreta");

        const authData = { admin: { id: admin.id } };
        const token = SignToken(authData);

        return { message: "Conta de admin logada com sucesso", token };
    }

    async addNewItemsViaJSON(data) {
        const { archive, collectionToAdd } = data;

        if (!archive || !collectionToAdd) {
            throw new Error("Preencha os campos corretamente para poder adicionar os itens");
        }

        const forbiddenCollections = ['forms_data', 'admin_data'];
        if (forbiddenCollections.includes(collectionToAdd)) {
            throw new Error("Coleção não permitida");
        }

        if (!collectionModels[collectionToAdd]) {
            throw new Error("Coleção não existe no banco de dados ou não é permitida para alterações");
        }

        const filePath = path.join(__dirname, '..', 'data_example', archive);

        if (!fs.existsSync(filePath)) {
            throw new Error("Arquivo JSON não encontrado");
        }

        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const Model = collectionModels[collectionToAdd];

        let addedItems = [];

        for (const item of jsonData) {
            const itemExists = await Model.findOne({ name: item.name });

            if (!itemExists) {
                const newItem = new Model(item);
                await newItem.save();
                addedItems.push(newItem);
            }
        }

        return { message: `${addedItems.length} itens foram adicionados à coleção ${collectionToAdd}`, addedItems };
    }
}

module.exports = new AdminService();