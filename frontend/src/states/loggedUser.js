import { reactive } from 'vue'

const loggedUser = reactive({
    token: undefined,
    email: undefined,
    id: undefined,
    self: undefined
})

function setLoggedUser (data) {
    loggedUser.token = data.token;
    loggedUser.email = data.email;
    loggedUser.id = data.id;
    loggedUser.self = data.self;
}

function clearLoggedUser () {
    loggedUser.token = undefined;
    loggedUser.email = undefined;
    loggedUser.id = undefined;
    loggedUser.self = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser } 