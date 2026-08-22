// <-- Imports -->
import { queryAsync } from '../utils/dbHelper.util';

export const getAll = async (data: any): Promise<any[]> => {
    const sqlString = `
                    SELECT  p.id,
                            p.name,
                            p.short_description,
                            p.brand_division,
                            p.image_url,
                            GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
                    FROM    products p
                    LEFT JOIN   product_category_mapping pcm 
                                ON p.id = pcm.product_id
                    LEFT JOIN   categories c 
                                ON pcm.category_id = c.id
                    GROUP BY    p.id
                    ORDER BY    p.id ASC;
                    `;

    try {
        const results = await queryAsync(sqlString);
        console.log("DB RESULTS (getAll):", results.length, "items found.");
        
        return results; 
        
    } catch (error) {
        console.error("DB ERROR (getAll):", error);
        throw error;
    }
};


export const getById = async (id: number): Promise<any> => {
    try {
        const sqlString = `SELECT   * 
                           FROM     products 
                           WHERE    id = ?;`;
        const productResult = await queryAsync(sqlString, [id]);
        
        if (!productResult || productResult.length === 0) {
            return null; 
        }

        const product = productResult[0];

        const variantQuery = `SELECT    * 
                              FROM      product_variants 
                              WHERE     product_id = ?;`;
        const attributeQuery = `SELECT  * 
                                FROM    technical_attributes 
                                WHERE   product_id = ?;`;
        const documentQuery = `SELECT   * 
                               FROM     documents 
                               WHERE    product_id = ?;`;
        const catQuery = `
            SELECT  c.name AS sub_category, 
                    parent.name AS main_category
            FROM    product_category_mapping pcm
            JOIN    categories c ON pcm.category_id = c.id
            LEFT JOIN   categories parent 
                        ON c.parent_id = parent.id
            WHERE   pcm.product_id = ?;`;

        const [variants, attributes, documents, categories] = await Promise.all([
            queryAsync(variantQuery, [id]),
            queryAsync(attributeQuery, [id]),
            queryAsync(documentQuery, [id]),
            queryAsync(catQuery, [id])
        ]);

        product.variants = variants;
        product.attributes = attributes;
        product.documents = documents;
        product.hierarchicalCategories = categories;

        return product;

    } catch (error) {
        console.error("DB ERROR (getById):", error);
        throw error;
    }
};

export const getBrands = async (data: any): Promise<string[]> => {
    const sqlString = `SELECT   DISTINCT 
                                brand_division 
                       FROM     products 
                       WHERE    brand_division IS NOT NULL 
                                AND brand_division != ''
                       ORDER BY brand_division ASC;`;

    try {
        const results = await queryAsync(sqlString);
        
        const flatBrands = results.map((row: any) => row.brand_division);
        
        console.log("DB RESULTS (getBrands):", flatBrands);
        return flatBrands;
        
    } catch (error) {
        console.error("DB ERROR (getBrands):", error);
        throw error;
    }
};