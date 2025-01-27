export interface Data {
    atr: {
        archiveUnit: {
            id: string;
            SystemId: string;
            LogBook: Record<string, any>[];
        };
        object: {
            id: string;
            BinaryDataObjectId: string;
            LogBook: {
                EventType: string;
                Outcome: string;
                OutcomeDetailMessage: string;
            }[];
        };
    };
    sip: {
        archiveUnit: {
            id: string;
            DescriptionLevel: string;
            Title: string;
            DataObjectGroupReferenceId: string;
        };
        object: {
            id: string;
            binaryDataObject: {
                id: string;
                DataObjectVersion: string;
                Uri: string;
                MessageDigest: string;
                Algorithm: string;
                Size: string;
                FormatIdentification: {
                    FormatLitteral: string;
                    MimeType: string;
                    FormatId: string;
                };
                FileInfo: {
                    Filename: string;
                    LastModified: string;
                };
            };
        };
    };
}
