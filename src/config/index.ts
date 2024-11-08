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
    GMAIL: "GMAIL"
}

export {CONFIG_ACCOUNT_TYPE, CONFIG_PERMISSIONS}