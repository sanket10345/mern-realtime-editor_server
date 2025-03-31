const express = require("express");
const router = express.Router();
const { createDocument, getDocument, getDocumentsAgainstUser, updateDocument,getDocumentVersionById } = require("../controllers/document");

router.post("/", createDocument);
router.get("/user/:id", getDocumentsAgainstUser);
router.get("/version/:id", getDocumentVersionById);
router.get("/:id", getDocument);
router.put("/:id", updateDocument);

module.exports = router;
