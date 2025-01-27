export const getObject = (req: any, res: any) => {
    try {       
        if(req.session && req.session.atrData && req.session.sipData) {
            const atr_Object = req.session.atrData;
            const sip_Object = req.session.sipData; 
          
            const objectId = req.params.DataObjectGroupReferenceId;
            const archiveUnitId = req.params.ArchiveUnitId;
        
            const objectAndUnit:any = {};
        
            atr_Object.dataObjectGroups.forEach((object: any) => {
                if(object.id === objectId){
                    for (const archiveUnit of atr_Object.archiveUnits) {
                        if(archiveUnit.id === archiveUnitId) {
                            objectAndUnit.atr = {archiveUnit, object}; 
                        }
                    }         
                }
            } )

            // console.log(sip_Object)
            
            sip_Object.dataObjectGroups.forEach((object: any) => {                
                if(object.id === objectId){
                    for (const archiveUnit of sip_Object.archiveUnits) {
                        if(archiveUnit.DataObjectGroupReferenceId === objectId) {
                            objectAndUnit.sip = {archiveUnit, object}; 
                        }
                    }          
                }
            } )
        
            res.json(objectAndUnit)
        } else {
             // La session n'est pas active
             req.flash('error', 'Votre session a expiré. Veuillez lancer une nouvelle analyse.');
             res.status(401).json({
                success: false,
                error: 'Session expirée',
                code: 'SESSION_EXPIRED'
            });
        }
    } catch (error) {
        console.log(error)
    }
}