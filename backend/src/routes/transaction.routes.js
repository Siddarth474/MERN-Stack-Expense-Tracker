import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addTransaction,
    deleteTransaction,
    getAllTransactions,
    getMonthlyReport,
    getTransactionById,
    getYearlyReport,
    updateTransaction,
 
} from "../controllers/transaction.controller.js";

const router = Router();

router.use(verifyJWT);

router.route('/add').post(addTransaction);
router.route('/:transactionId')
        .get(getTransactionById)
        .patch(updateTransaction)
        .delete(deleteTransaction);

router.route('/report/monthly').get(getMonthlyReport);
router.route('/report/yearly').get(getYearlyReport);
router.route('/').get(getAllTransactions); 

export default router;