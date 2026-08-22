import db from '../configs/db.config';

export const queryAsync = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err: any, results: any) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};