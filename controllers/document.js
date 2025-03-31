const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Define Document model
const Document = sequelize.define("Document", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false, unique:true },
    content: { type: DataTypes.TEXT, defaultValue:'' },
    status: { type: DataTypes.ENUM("draft", "final"), defaultValue: "draft" }
}, {
    timestamps: true,
    tableName: "documents"
});
const DocumentVersion = sequelize.define('DocumentVersion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    document_id: { type: DataTypes.INTEGER, allowNull: false},
    //user_id: { type: DataTypes.INTEGER, allowNull: false},
    content: { type: DataTypes.TEXT, allowNull: true},
    version_number: { type: DataTypes.INTEGER, allowNull: false,},
    is_current:{type:DataTypes.BOOLEAN,allowNull: false, defaultValue: 0},
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
  }, {
    tableName: 'document_versions', // Change this to the actual table name
    timestamps: false // Since `createdAt` is handled manually, no need for `updatedAt`
  });
// Create Document
exports.createDocument = async (req, res) => {
    try {
       const { userId, title, content } = req.body;
       const document = await Document.create({ user_id: userId, title, content, status: "draft" });
       res.json({ success: true, document });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: error.message });
    }
};

// Get Document by ID

exports.getDocumentsAgainstUser = async(req,res) =>{
    try {
        const { id } = req.params;
        const document = await Document.findAll({
            where: {
              user_id: id
            }
          });
        if (!document) return res.status(404).json({ success: false, message: "Documents not found against a user" });
        res.json({ success: true, document });
     } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
     }    
}
exports.getDocument = async (req, res) => {
    try {
       const { id } = req.params;
       const document = await DocumentVersion.findAll({
        where: {
          document_id: id
        }
      });
       //const document = await Document.findByPk(id);
       if (!document) return res.status(404).json({ success: false, message: "Document not found" });
       res.json({ success: true, document });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: error.message });
    }
};

exports.getDocumentVersionById = async (req, res) => {
  try {
    console.log("getDocumentVersionById------------->")
     const { id } = req.params;
     console.log("getDocumentVersionById------------->",id)
     const document = await DocumentVersion.findOne({
      where: {
        version_number: id,
        user_id:2
      },
      logging: console.log // Debug SQL query
    });
    console.log("getDocumentVersionById------------->",document)
     //const document = await Document.findByPk(id);
     if (!document) return res.status(404).json({ success: false, message: "Document not found" });
     res.json({ success: true, document });
  } catch (error) {
     console.error(error);
     res.status(500).json({ success: false, error: error.message });
  }
};

exports.saveDocumentVersionById = async(req,res) =>{
   try{
      const { userId, content,documentId } = req.body;
      const {id: versionId} = req.params
      console.log("=------------------>",typeof (parseInt(versionId) + 1))
      console.log("=------------------>",parseInt(versionId))
      const document = await DocumentVersion.create({ user_id: userId, content, version_id: parseInt(versionId) + 1 });
   res.json({ success: true});
   }
   catch(error){
      console.error(error);
      res.status(500).json({ success: false, error: error.message });      
   }
};
// Update Document
exports.updateDocument = async (req, res) => {
    try {
       const { id } = req.params;
       const { content, status } = req.body;
       const document = await Document.findByPk(id);
       if (!document) return res.status(404).json({ success: false, message: "Document not found" });
       
       document.content = content;
       if(status) {
           document.status = status;
       }
       await document.save();
       res.json({ success: true, document });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: error.message });
    }
};
