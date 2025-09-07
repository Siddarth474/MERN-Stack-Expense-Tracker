import { createContext, useEffect, useState } from "react";
import useLocalStorage from "../utils/CustomHook";

export const ExpenseApi = createContext();

const ExpenseApiProvider = (props) => {
    const [step, setStep] = useState(1);
    const [transactionInfo, setTransactionInfo] = useState({
        category: '',
        amount: '',
        description: '',
        type: "expense",
        date: '',
    });
    const [isEdit, setIsEdit] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [username, setUsername] = useLocalStorage("username", "");
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", true);

    const contextValue = {
        step, setStep,
        transactionInfo, setTransactionInfo,
        isEdit, setIsEdit,
        toggle, setToggle,
        username, setUsername,
        darkMode, setDarkMode
    }

    return (
        <ExpenseApi.Provider value={contextValue}>
            {props.children}
        </ExpenseApi.Provider>
    )
}

export default ExpenseApiProvider;