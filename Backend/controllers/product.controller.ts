// <-- Imports -->
import { Request, Response, NextFunction } from "express";
import * as service from "../services/product.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Get All Products Request Received.");
    
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

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const results = await service.getById(id);

        if (results) {
            res.status(200).send(results);
        } else {
            res.status(404).send({ 
                success: false, 
                data: "Product not found." 
            });
        }
    } catch (error: any) {
        console.error(error);
        res.status(400).send({ 
            success: false, 
            data: error.message 
        });
    }
};

export const getBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = {};
        const results = await service.getBrands(data);

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