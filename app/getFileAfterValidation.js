var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { checkFiles } from "./checkFiles.js";
export const getFileAfterValidation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // Initialisation des fichiers ATR et Manifest
        let atrFile = null;
        let manifestFile = null;
        // Parcours des fichiers reçus pour identifier ATR et Manifest
        for (const file of req.files) {
            try {
                const isValidatedATR = yield checkFiles(file.path, "ArchiveTransferReply");
                const isValidatedManifest = yield checkFiles(file.path, "ArchiveTransfer");
                if (isValidatedATR) {
                    atrFile = file;
                }
                else if (isValidatedManifest) {
                    manifestFile = file;
                }
            }
            catch (error) {
                if (error) {
                    reject(new Error('Erreur lors de la validation des fichiers : ' + error));
                    return res === null || res === void 0 ? void 0 : res.redirect('/');
                }
            }
        }
        // Vérification si les fichiers sont trouvés
        if (!atrFile || !manifestFile) {
            reject("Fichier ATR ou Manifeste non conforme au SEDA 2.1 ou 2.2");
            return;
        }
        // Résoudre la promesse avec les fichiers trouvés
        resolve({ atrFile, manifestFile });
    }));
});
