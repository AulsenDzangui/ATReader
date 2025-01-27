var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import multer from 'multer';
import path from 'path';
import { deleteFilesAfterDelay } from "./deleteFilesAfterDelay.js";
import { getATRData } from "./getATRData.js";
import { getFileAfterValidation } from "./getFileAfterValidation.js";
import { getMixedData } from "./getMixedData.js";
import { getSIPData } from "./getSIPData.js";
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const filetypes = /xml/; // Types de fichiers acceptés
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Type de fichier non autorisé.'));
    }
});
const uploadFiles = upload.array('files[]');
export const analyzer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    uploadFiles(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res.status(400).send(err.message);
            }
            yield _analyzer(req, res);
        });
    });
});
const _analyzer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Vérifiez si une erreur a été générée par Multer
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    }
    // Vérification de l'existence de req.files
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("Aucun fichier n'a été téléchargé.");
    }
    // Vérification de l'intégrité des fichiers
    for (const file of req.files) {
        if (!file || !file.path) {
            return res.status(400).send("Un ou plusieurs fichiers sont invalides.");
        }
    }
    try {
        const { atrFile, manifestFile } = yield getFileAfterValidation(req, res);
        // Traitement des fichiers dès leur réception
        const atrPath = atrFile.path; // Chemin du fichier ATR téléchargé
        const manifestPath = manifestFile.path; // Chemin du fichier Manifest téléchargé   
        const ATRData = yield getATRData(atrPath);
        const SIPData = yield getSIPData(manifestPath);
        const { mixedDataArray, mixedDataArrayForCSVExport } = getMixedData(ATRData, SIPData);
        // Enregistrement des données dans la session
        req.session.data = mixedDataArrayForCSVExport;
        req.session.atrData = ATRData;
        req.session.sipData = SIPData;
        // Enregistrement des données pour l'effacement ultérieurement
        req.session.userFiles = [atrFile.filename, manifestFile.filename];
        const filesInfos = {
            atrFilename: atrFile.filename,
            atrOriginalname: atrFile.originalname,
            atrSize: atrFile.size,
            sipFilename: manifestFile.filename,
            sipOriginalname: manifestFile.originalname,
            sipSize: manifestFile.size,
        };
        res.render('results', { mixedDataArray, generalInfos: ATRData.generalInfos, filesInfos });
    }
    catch (error) {
        req.flash('error', error);
        req.files.forEach((file) => {
            deleteFilesAfterDelay(file.filename, 1000);
        });
        console.error(error);
        res.redirect('/');
    }
});
