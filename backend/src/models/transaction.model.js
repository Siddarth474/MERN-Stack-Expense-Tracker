import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const transactionSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: ['income', 'expense']
        },
        date: {
            type: Date,
            default: Date.now
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        month: {
            type: Number,
            min: 1,
            max: 12
        },
        year: {
            type: Number
        }
    },
    {timestamps: true}
);

transactionSchema.pre('save', function (next) {
    if (!this.month) {
        const d = new Date(this.date);
        this.month = d.getMonth() + 1;
    }
    if (!this.year) {
        const d = new Date(this.date);
        this.year = d.getFullYear();
    }
    next();
});

transactionSchema.plugin(mongooseAggregatePaginate);

export const Transaction = mongoose.model('Transaction', transactionSchema);