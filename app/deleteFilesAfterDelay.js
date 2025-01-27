var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs/promises';
// Fonction pour supprimer les fichiers après un délai
export const deleteFilesAfterDelay = (filename, delay) => {
    if (!filename) {
        console.error("Le nom du fichier est indéfini. Aucune suppression effectuée.");
        return; // Sortir de la fonction si le nom du fichier est indéfini
    }
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = 'uploads/' + filename;
        try {
            yield fs.unlink(filePath);
            console.log(`Fichier ${filename} supprimé après ${delay / 1000} secondes`);
        }
        catch (error) {
            console.error("Erreur lors de la suppression du fichier :", error);
        }
    }), delay);
};
// Fonction de nettoyage périodique
export const cleanUpOldFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fs.readdir('uploads');
        for (const file of files) {
            const filePath = 'uploads/' + file;
            const stats = yield fs.stat(filePath);
            const now = Date.now();
            // const expirationTime = 24 * 60 * 60 * 1000; // 24 heures
            const expirationTime = 10 * 1000; // 10 secondes
            if (now - stats.mtimeMs > expirationTime) {
                yield fs.unlink(filePath);
                console.log(`Fichier ${file} supprimé après expiration.`);
            }
        }
    }
    catch (error) {
        console.error("Erreur lors du nettoyage des fichiers :", error);
    }
});
