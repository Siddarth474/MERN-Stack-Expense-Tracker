import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err, req, res, next) => {

    if(err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, err.data, err.message));
    }

    return res
        .status(500)
        .json(new ApiResponse(err.statusCode, err.data, err.message || "Internal Server Error"));
}