import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addTransaction = async (req, res) => {
    const {amount, category, description, date, type, month, year} = req.body;

    if([amount, category, type, date].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userId = req.user?._id;
    if(!userId) {
        throw new ApiError(401, "Unauthorized! User not logged In");
    }

    const transaction = await Transaction.create({
        amount,
        category,
        description,
        type,
        date,
        month,
        year,
        owner: userId
    });

    return res
        .status(201)
        .json(new ApiResponse(201, transaction, "Transaction added successfully"));
}

const getTransactionById = async(req, res) => { 
    const {transactionId} = req.params;

    const transaction = await Transaction.findOne({_id: transactionId, owner: req.user?._id});
    if(!transaction) throw new ApiError(404, "Not found");

    return res
        .status(200)
        .json(new ApiResponse(200, transaction, "Transaction fetched successfully"));
}

const updateTransaction = async (req, res) => {
    const {transactionId} = req.params;
    const updates = req.body;

    if(!mongoose.isValidObjectId(transactionId)) {
        throw new ApiError(400, 'Invalid transaction Id');
    }

    const transaction = await Transaction.findOneAndUpdate(
        {_id: transactionId, owner: req.user?._id},
        updates,
        {new: true, runValidators: true}
    );

    if(!transaction) throw new ApiError(404, "Transaction Not found");

    return res
        .status(200)
        .json(new ApiResponse(200, transaction, "Transaction updated successfully"));
}

const getMonthlyReport = async (req, res) => {
    
    const { month, year } = req.query;
    const userId = req.user?._id;

    if (!month || !year) {
        throw new ApiError(400, "Month and Year are required");
    }

    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    const report = await Transaction.aggregate([
        {
            $match: {
                owner: userId,
                month: numericMonth,
                year: numericYear
            }
        },
        {
            $sort: { date: 1 }
        },
        {
            $group: {
                _id: { category: "$category", type: "$type"}, // group by category & type
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: { $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0] }
                },
                totalExpense: {
                    $sum: { $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0] }
                },
                breakdown: {
                    $push: {
                        category: "$_id.category",
                        type: "$_id.type",
                        amount: "$totalAmount"
                    }
                }
            }
        },
        {
            $addFields: {
                netAmount: { $subtract: ["$totalIncome", "$totalExpense"] }
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);

    if (!report.length) {
        throw new ApiError(404, "No transactions found for this month & year");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, report[0], "Monthly Report"));
            
};

const getYearlyReport = async (req, res) => {
    const {year} = req.query;
    const userId = req.user?._id;

    if (!year) {
        throw new ApiError(400, "Year are required");
    }
    const numericYear = parseInt(year);

    const report = await Transaction.aggregate([
        {
            $match: {
                owner: userId,
                year: numericYear
            }
        },
        {
            $sort: {
                date: 1
            }
        },
        {
            $group: {
                _id: { category: "$category", type: "$type"}, 
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: {
                        $cond: [{$eq: ["$_id.type", "income"]}, "$totalAmount", 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0]
                    }
                },
                breakdown: {
                    $push: {
                        category: "$_id.category",
                        type: "$_id.type",
                        amount: "$totalAmount",
                    }
                }
            }
        },
        {
            $addFields: {
                netAmount: {$subtract: ['$totalIncome', '$totalExpense']}
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);

    if (!report.length) {
            throw new ApiError(404, "No transactions found for this year");
        }

    return res
        .status(200)
        .json(new ApiResponse(200, report[0], "Yearly Report"));
}

const deleteTransaction = async (req, res) => {
    const {transactionId} = req.params;

    if(!mongoose.isValidObjectId(transactionId)) {
        throw new ApiError(400, 'Invalid transaction Id');
    }

    const deletedTransaction = await Transaction.findOneAndDelete(
        {_id: transactionId, owner: req.user?._id},
    );

    if(!deletedTransaction) throw new ApiError(404, "Transaction Not found");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Transaction deleted successfully"));
}

const getAllTransactions = async (req, res) => {
    const transactions = await Transaction.find({owner: req.user._id}).sort({date: -1});

    if(!transactions) {
        throw new ApiError(404, "No Transactions found!");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, transactions, "All transactions fetched successfully!"));
}

export {
    addTransaction,
    getTransactionById,
    getMonthlyReport,
    getYearlyReport,
    updateTransaction,
    deleteTransaction,
    getAllTransactions
}