import { checkFiles } from "./checkFiles.js";

export interface FileValidationResult {
    atrFile: any;
    manifestFile: any;
}

export const getFileAfterValidation = async (req: { files: any; }, res: any) => {
    return new Promise(async (resolve, reject): Promise<FileValidationResult | undefined> => {
        // Initialisation des fichiers ATR et Manifest
        let atrFile = null;
        let manifestFile = null;

        // Parcours des fichiers reçus pour identifier ATR et Manifest
        for (const file of req.files) {
            try {
                const isValidatedATR = await checkFiles(file.path, "ArchiveTransferReply");
                const isValidatedManifest = await checkFiles(file.path, "ArchiveTransfer");

                if (isValidatedATR) {
                    atrFile = file;
                } else if (isValidatedManifest) {
                    manifestFile = file;
                }
            } catch (error) {
               if(error) {
                reject(new Error('Erreur lors de la validation des fichiers : ' + error));
                return res?.redirect('/');
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
    });
}