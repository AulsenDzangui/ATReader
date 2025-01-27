import { ATRData } from "./getATRData.js";
import { SIPData } from "./getSIPData.js";

export const getMixedData = (ATRData: ATRData, SIPData: SIPData) => {
    const mixedDataArray: { id: any; objectId?: any; level: any; title: any; systemId: any; events: any[] | never[]; isItem: boolean; fileInfo?: null; }[] = [];
    const mixedDataArrayForCSVExport: { ID: any; DescriptionLevel: any; Title: any; SystemId: any; OutCome?: any; }[] = [];
    const addedIds = new Set(); // Ensemble pour suivre les IDs ajoutés

    SIPData.archiveUnits.forEach((archiveUnit_SIP: any) => {
        ATRData.archiveUnits.forEach((archiveUnit_ATR: any) => {
            if (archiveUnit_ATR.id === archiveUnit_SIP.id) {
                // Carrefour : vérifier s'il s'agit d'un fichier et non d'un dossier par l'existence d'une référence à un objet                      
                if (archiveUnit_SIP.DataObjectGroupReferenceId) {
                    // console.log(archiveUnit_SIP.DataObjectGroupReferenceId)
                    // Traitement des objets/fichiers uniquement
                    ATRData.dataObjectGroups.forEach((dataObjectGroup_ATR: any) => {
                        const objectId_SIP = archiveUnit_SIP.DataObjectGroupReferenceId;
                        const objectId_ATR = dataObjectGroup_ATR.id;

                        if (objectId_ATR === objectId_SIP) {
                            const mixedData = {
                                id: archiveUnit_SIP.id,
                                objectId: archiveUnit_SIP.DataObjectGroupReferenceId,
                                level: archiveUnit_SIP.DescriptionLevel,
                                title: archiveUnit_SIP.Title,
                                systemId: archiveUnit_ATR.SystemId,
                                events: [...dataObjectGroup_ATR.LogBook, ...archiveUnit_ATR.LogBook],
                                isItem: true,
                            };

                            const mixedDataForCSVExport = {
                                ID: archiveUnit_SIP.id,
                                DescriptionLevel: archiveUnit_SIP.DescriptionLevel,
                                Title: archiveUnit_SIP.Title,
                                SystemId: archiveUnit_ATR.SystemId,
                                OutCome: dataObjectGroup_ATR.LogBook[0]?.Outcome,                                        
                            }

                            // Vérifiez si l'ID a déjà été ajouté
                            const uniqueId = mixedData.systemId;
                            if (!addedIds.has(uniqueId)) {
                                mixedDataArray.push(mixedData);
                                mixedDataArrayForCSVExport.push(mixedDataForCSVExport)
                                addedIds.add(uniqueId); // Ajoutez l'ID à l'ensemble
                            }
                        }
                    });
                } else {
                    // Traitement des dossiers uniquement
                    const mixedData = {
                        id: archiveUnit_SIP.id,
                        level: archiveUnit_SIP.DescriptionLevel,
                        title: archiveUnit_SIP.Title,
                        systemId: archiveUnit_ATR.SystemId,
                        fileInfo: null,
                        events: [],
                        isItem: false,
                    };

                    const mixedDataForCSVExport = {
                        ID: archiveUnit_SIP.id,
                        DescriptionLevel: archiveUnit_SIP.DescriptionLevel,
                        Title: archiveUnit_SIP.Title,
                        SystemId: archiveUnit_ATR.SystemId,
                    }

                    // Vérifiez si l'ID a déjà été ajouté
                    const uniqueId = mixedData.systemId;
                    if (!addedIds.has(uniqueId)) {
                        mixedDataArray.push(mixedData);
                        mixedDataArrayForCSVExport.push(mixedDataForCSVExport);
                        addedIds.add(uniqueId);
                    }
                }
            }
        });
    });

    return { mixedDataArray, mixedDataArrayForCSVExport };
}
