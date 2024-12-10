const CONFIG_PERMISSIONS = {
    POST: {
        GET: "getPost",
        CREATE: "createPost",
        UPDATE: "updatePost",
        DELETE: "deletePost"
    },
    USER: {
        GET: "getUser",
        CREATE: "createUser",
        UPDATE: "updateUser",
        DELETE: "deleteUser"
    },
    DEPOSIT: {
        GET: "getDeposit",
        CREATE: "createDeposit",
        UPDATE: "updateDeposit",
        DELETE: "deleteDeposit"
    },
    WITHDRAW: {
        GET: "getWithdraw",
        CREATE: "createWithdraw",
        UPDATE: "updateWithdraw",
        DELETE: "deleteWithdraw"
    },
    PAYMENT: {
        GET: "getPayment",
        CREATE: "createPayment",
        UPDATE: "updatePayment",
        DELETE: "deletePayment"
    },
    ROLE: {
        GET: "getRole",
        CREATE: "createRole",
        UPDATE: "updateRole",
        DELETE: "deleteRole"
    }
}

const CONFIG_ACCOUNT_TYPE = {
    SYSTEM: "SYSTEM",
    GMAIL: "GOOGLE"
}

const CONFIG_ICON = {
    PURCHASE: "fa-solid fa-cart-shopping",
    POST: "fa-solid fa-newspaper",
    DELETE: "fa-solid fa-trash",
    WITHDRAW: "fa-duotone fa-regular fa-money-simple-from-bracket",
    DEPOSIT: "fa-solid fa-money-bill-transfer",
    FOLLOW: "fa-solid fa-users",
    NOTIFY: "fa-solid fa-bell",
    SYSTEM: "fa-solid fa-gear"
}

const sendResponse = (status: string, message: string, data: any) => {
    return {status, message, data}
}

export {CONFIG_ACCOUNT_TYPE, CONFIG_PERMISSIONS, CONFIG_ICON, sendResponse}