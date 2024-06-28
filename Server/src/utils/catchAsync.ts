import { Request, Response, NextFunction } from 'express';

type asyncHandler=(req:Request,res:Response,next:NextFunction)=>Promise<any>;

export default (fn:asyncHandler)=>{
    return (req:Request,res:Response,next:NextFunction)=>fn(req,res,next).catch(next);
}
