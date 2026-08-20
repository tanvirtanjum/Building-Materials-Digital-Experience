// <-- Imports -->
import db from '../configs/db.config';

export const getAll = (data: any, callback: Function): void => {
    // We will expand this SQL later to handle the Knauf category filters!
    const sqlString = `
                    SELECT 
                        p.id,
                        p.name,
                        p.short_description,
                        p.brand_division,
                        p.image_url,
                        GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
                    FROM 
                        products p
                    LEFT JOIN 
                        product_category_mapping pcm ON p.id = pcm.product_id
                    LEFT JOIN 
                        categories c ON pcm.category_id = c.id
                    GROUP BY 
                        p.id
                    ORDER BY 
                        p.id ASC;
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

export const getById = (id: string, callback: Function): void => {
    // 1. Get Variants
    db.query("SELECT * FROM product_variants WHERE product_id = ?", [id], (err1: any, variants: any) => {
        if (err1) return callback(err1);
        
        // 2. Get Attributes
        db.query("SELECT * FROM technical_attributes WHERE product_id = ?", [id], (err2: any, attributes: any) => {
            if (err2) return callback(err2);

            // 3. Get Documents
            db.query("SELECT * FROM documents WHERE product_id = ?", [id], (err3: any, documents: any) => {
                if (err3) return callback(err3);

                // 4. NEW: Get Hierarchical Categories
                const catQuery = `
                    SELECT 
                        c.name AS sub_category, 
                        parent.name AS main_category
                    FROM product_category_mapping pcm
                    JOIN categories c ON pcm.category_id = c.id
                    LEFT JOIN categories parent ON c.parent_id = parent.id
                    WHERE pcm.product_id = ?
                `;
                
                db.query(catQuery, [id], (err4: any, categories: any) => {
                    if (err4) return callback(err4);

                    // Combine and send everything to the frontend
                    callback(null, {
                        variants: variants,
                        attributes: attributes,
                        documents: documents,
                        hierarchicalCategories: categories
                    });
                });
            });
        });
    });
};