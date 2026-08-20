// <-- Imports -->
import db from '../configs/db.config';

export const getAll = (data: any, callback: Function): void => {
    // We will expand this SQL later to handle the Knauf category filters!
    const sqlString = `
                    SELECT      * 
                    FROM        \`products\`;
                    `;

    const options = { 
        sql: sqlString, 
        nestTables: false 
    };

    db.query(options, [], (error: Error | null, results: any, fields: any) => {
            if (error) {
                console.error("DB ERROR:", error);
                return callback(error);
            }
            
            console.log("DB RESULTS:", results);
            return callback(null, results);
        } 
    );
};