// <-- Imports -->
import { Request, Response, NextFunction } from "express";
import * as service from "../services/product.service";

export const getAll = (req: Request, res: Response, next: NextFunction): void => {
    console.log("Get All Products Request Received.");
    
    // We will pass req.query here later when we add frontend filters
    const data = {};

    service.getAll(data, (error: Error | null, results: any[]) => {
        if (error) {
            console.log(error);
            res.status(400).send({ 
                success: false, 
                data: "Bad Request. {{--> " + error.message + " <--}}" 
            });
        } else {
            if (results && results.length > 0) {
                res.status(200).send(results);
            } else {
                res.status(204).send({ 
                    success: false, 
                    data: "No Data Found." 
                });
            }
        }
    });
};