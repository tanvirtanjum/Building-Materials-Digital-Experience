// <-- Imports -->
import { queryAsync } from '../utils/dbHelper.util';

export const getAll = async (data: any): Promise<any[]> => {
    const sqlString = `
                    SELECT  id,
                            name,
                            parent_id,
                            (
                                SELECT  name
                                FROM    categories AS C2
                                WHERE   C1.parent_id = C2.id
                            ) AS parent_name
                    FROM    categories AS C1
                    ORDER BY    name ASC;
                    `;

    try {
        const results = await queryAsync(sqlString);
        
        console.log("DB RESULTS:", results);
        return results;
        
    } catch (error) {
        console.error("DB ERROR:", error);
        throw error; 
    }
};