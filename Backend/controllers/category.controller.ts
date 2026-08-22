// <-- Imports -->
import { Request, Response, NextFunction } from "express";
import * as service from "../services/category.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = {};
        
        const results = await service.getAll(data);

        if (results && results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(204).send({ 
                success: false, 
                data: "No Data Found." 
            });
        }
    } catch (error: any) {
        console.error(error);
        res.status(400).send({ 
            success: false, 
            data: `Bad Request. {{--> ${error.message} <--}}` 
        });
    }
};