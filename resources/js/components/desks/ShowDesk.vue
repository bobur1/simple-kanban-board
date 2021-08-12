<template>
    <div class="container">
        <h1>Kanban board</h1>

        <div class="alert alert-danger" role="alert" v-if="errored">
            Error while loading data!
        </div>

        <div class="row main">
            <div class="col-lg-4" v-for="(desk_list, index) in desk_lists" :key="desk_list.id">
                <div class="card mt-3">
                    <div class="card-body">
                        <form @submit.prevent="updateDeskList(desk_list.id, desk_list.name)"
                              v-if="desk_list_input_id == desk_list.id"
                              class="d-flex justify-content-between align-items-center">
                            <input type="text" v-model="desk_list.name" class="form-control"
                                   :class="{ 'is-invalid': $v.desk_lists.$each[index].name.$error }"
                                   placeholder="Enter the name of the list">
                            <div class="invalid-feedback" v-if="!$v.desk_lists.$each[index].name.required">
                                Required field!
                            </div>
                            <div class="invalid-feedback" v-if="!$v.desk_lists.$each[index].name.maxLength">
                                Max. Characters: {{$v.desk_lists.$each[index].name.$params.maxLength.max}}
                            </div>
                            <button type="button" @click="updateDeskList(desk_list.id, desk_list.name)"
                                    class="close ml-2" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </form>
                        <h4 v-else class="card-title d-flex justify-content-between align-items-center"
                            style="cursor: pointer;" @click="desk_list_input_id = desk_list.id">{{desk_list.name}}<i
                                class="fas fa-pen-alt" style="font-size: 15px;"></i></h4>
                        <button type="button" class="btn btn-danger mt-3" @click="deleteDeskList(desk_list.id)">Delete list
                        </button>
                        <div class="card mt-3 bg-light" v-for="card in desk_list.cards" :key="card.id">
                            <div class="card-body">
                                <h4 class="card-title d-flex justify-content-between align-items-center mb-3"
                                    style="cursor: pointer;">{{card.name}}</h4>
                                <!-- Button trigger modal -->
                                <button type="button" @click="getCard(card.id)" class="btn btn-primary"
                                        data-toggle="modal" data-target="#exampleModal">
                                    Open
                                </button>
                                <button type="button" class="btn btn-secondary" @click="deleteCard(card.id)">Delete
                                </button>
                            </div>
                        </div>
                        <form @submit.prevent="addNewCard(desk_list.id)" class="mt-3">
                            <div class="form-group">
                                <input type="text" v-model="card_names[desk_list.id]" class="form-control"
                                       :class="{ 'is-invalid': $v.card_names.$each[desk_list.id].$error }"
                                       placeholder="Enter the name of the card">
                                <div class="invalid-feedback" v-if="!$v.card_names.$each[desk_list.id].required">
                                    Required field!
                                </div>
                                <div class="invalid-feedback" v-if="!$v.card_names.$each[desk_list.id].maxLength">
                                    Max. Characters:
                                    {{$v.card_names.$each[desk_list.id].$params.maxLength.max}}
                                </div>
                            </div>
                        </form>
                        <!-- Modal -->
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                             aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <form @submit.prevent="updateCardName" v-if="show_card_name_input"
                                              class="d-flex justify-content-between align-items-center">
                                            <input type="text" v-model="current_card.name" class="form-control"
                                                   :class="{ 'is-invalid': $v.current_card.name.$error }"
                                                   placeholder="Enter the name of the card">
                                            <div class="invalid-feedback" v-if="!$v.current_card.name.required">
                                                Required field!
                                            </div>
                                            <div class="invalid-feedback" v-if="!$v.current_card.name.maxLength">
                                                Max. Characters:
                                                {{$v.current_card.name.$params.maxLength.max}}
                                            </div>
                                            <button type="button" @click="updateCardName" class="close ml-2"
                                                    aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </form>

                                        <h5 class="modal-title" style="cursor: pointer" id="exampleModalLongTitle"
                                            v-if="!show_card_name_input" @click="show_card_name_input = true">
                                            {{current_card.name}}<i class="fas fa-pen-alt ml-2"
                                                                    style="font-size: 15px;"></i></h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <draggable class="drag-area" :list="current_card.tasks" :options="{animation:200, group:'status'}" >
                                        <div class="form-check d-flex justify-content-between"
                                             v-for="(task, index) in current_card.tasks">
                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1"
                                                   value="option1">
                                            <form @submit.prevent="updateTask(current_card.tasks[index])"
                                                  v-if="task_input_name_id == task.id">
                                                <input type="text" v-model="current_card.tasks[index].name"
                                                       v-if="task_input_name_id == task.id" class="form-control"
                                                       placeholder="Enter the name of the task">
                                            </form>
                                            <label v-else class="form-check-label"
                                                   for="inlineCheckbox1">{{task.name}}</label>
                                            <span @click="task_input_name_id = task.id"
                                                  v-if="task_input_name_id != task.id"><i class="fas fa-pen-alt ml-2"
                                                                                          style="font-size: 13px;"></i></span>
                                            <button type="button" @click="deleteTask(task.id)" class="close ml-3"
                                                    aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        </draggable>
                                        <form @submit.prevent="addNewTask" class="mt-3">
                                            <div class="form-group">
                                                <input type="text" v-model="new_task_name" class="form-control"
                                                       :class="{ 'is-invalid': $v.new_task_name.$error }"
                                                       placeholder="Enter the name of the task">
                                                <div class="invalid-feedback" v-if="!$v.new_task_name.required">
                                                    Required field!
                                                </div>
                                                <div class="invalid-feedback" v-if="!$v.new_task_name.maxLength">
                                                    Max. Characters:
                                                    {{$v.new_task_name.$params.maxLength.max}}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mt-3">
                    <div class="card-body">
                        <form @submit.prevent="addNewDeskList">
                            <div class="form-group">
                                <input type="text" v-model="desk_list_name" class="form-control"
                                       :class="{ 'is-invalid': $v.desk_list_name.$error }"
                                       placeholder="Enter the name of the list">
                                <div class="invalid-feedback" v-if="!$v.desk_list_name.required">
                                    Required field!
                                </div>
                                <div class="invalid-feedback" v-if="!$v.desk_list_name.maxLength">
                                    Max. Characters: {{$v.desk_list_name.$params.maxLength.max}}
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Add list</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center" v-if="loading">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden"></span>
            </div>
        </div>
    </div>
</template>
<script>
    import {required, maxLength} from 'vuelidate/lib/validators'
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
        },
        props: [
            'deskId'
        ],
        data() {
            return {
                name: null,
                desk_list_name: null,
                errored: false,
                loading: true,
                desk_lists: true,
                desk_list_input_id: null,
                card_names: [],
                current_card: [],
                show_card_name_input: false,
                new_task_name: '',
                task_input_name_id: null
            }
        },
        methods: {
            updateTask(task) {
                axios.post('/api/V1/tasks/' + task.id, {
                    _method: 'PATCH',
                    name: task.name,
                    is_done: task.is_done,
                    card_id: task.card_id
                })
                    .then(response => {
                        this.task_input_name_id = null
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            deleteTask(id) {
                axios.post('/api/V1/tasks/' + id, {
                    _method: 'DELETE'
                })
                    .then(response => {
                        this.$v.$reset()
                        this.getCard(this.current_card.id)
                    })
                    .catch(error => {
                        console.log(error)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            addNewTask() {
                this.$v.new_task_name.$touch()
                if (this.$v.new_task_name.$anyError) {
                    return;
                }
                axios.post('/api/V1/tasks', {
                    name: this.new_task_name,
                    card_id: this.current_card.id,
                })
                    .then(response => {
                        this.new_task_name = ''
                        this.$v.$reset()
                        this.getCard(this.current_card.id)
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            updateCardName() {
                this.$v.current_card.name.$touch()
                if (this.$v.current_card.name.$anyError) {
                    return;
                }
                this.show_card_name_input = false
                axios.post('/api/V1/cards/' + this.current_card.id, {
                    _method: 'PATCH',
                    name: this.current_card.name,
                    desk_list_id: this.current_card.desk_list_id,
                })
                    .then(response => {
                        show_card_name_input: false
                        this.$v.$reset()
                        this.getDeskLists()
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            getCard(id) {
                axios.get('/api/V1/cards/' + id)
                    .then(response => {
                        this.current_card = response.data.data
                    })
            },
            deleteCard(id) {
                axios.post('/api/V1/cards/' + id, {
                    _method: 'DELETE'
                })
                    .then(response => {
                        this.getDeskLists()
                    })
                    .catch(error => {
                        console.log(error)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            addNewCard(desk_list_id) {
                this.$v.card_names.$each[desk_list_id].$touch()
                if (this.$v.card_names.$each[desk_list_id].$anyError) {
                    return;
                }
                axios.post('/api/V1/cards', {
                    name: this.card_names[desk_list_id],
                    desk_list_id
                })
                    .then(response => {
                        this.$v.$reset()
                        this.getDeskLists()
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            getDeskLists() {
                axios.get('/api/V1/desk-lists')
                    .then(response => {
                        this.desk_lists = response.data.data
                        this.card_names = []
                        this.desk_lists.forEach(el => {
                            this.card_names[el.id] = ''
                        });
                    })
                    .catch(error => {
                        console.log(error)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            addNewDeskList() {
                this.$v.desk_list_name.$touch()
                if (this.$v.desk_list_name.$anyError) {
                    return;
                }
                axios.post('/api/V1/desk-lists', {
                    name: this.desk_list_name
                })
                    .then(response => {
                        this.$v.$reset()
                        this.desk_list_name = ''
                        this.desk_lists = []
                        this.getDeskLists()
                    })
                    .catch(error => {
                        console.log(error)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            deleteDeskList(id) {
                if (confirm('Are you sure you want to delete the list?')) {
                    axios.post('/api/V1/desk-lists/' + id, {
                        _method: 'DELETE'
                    })
                        .then(response => {
                            this.desk_lists = []
                            this.getDeskLists()
                        })
                        .catch(error => {
                            console.log(error)
                            this.errored = true
                        })
                        .finally(() => {
                            this.loading = false
                        })
                }
            },
            updateDeskList(id, name) {
                this.$v.desk_lists.$touch()
                if (this.$v.desk_lists.$anyError) {
                    return;
                }
                this.desk_list_input_id = null
                axios.post('/api/V1/desk-lists/' + id, {
                    _method: 'PUT',
                    name
                })
                    .then(response => {
                        this.desk_list_input_id = null
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            downloadDatabase () {
                Axios.get('/api/V1/download-database', { responseType: 'blob' })
                    .then(response => {
                        const blob = new Blob([response.data], { type: 'application/pdf' })
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = label
                        link.click()
                        URL.revokeObjectURL(link.href)
                    }).catch(console.error)
            }
        },
        mounted() {
            this.getDeskLists()
        },
        validations: {
            name: {
                required,
                maxLength: maxLength(255)
            },
            desk_list_name: {
                required,
                maxLength: maxLength(255)
            },
            card_names: {
                $each: {
                    required,
                    maxLength: maxLength(255)
                }
            },
            current_card: {
                name: {
                    required,
                    maxLength: maxLength(255)
                }
            },
            new_task_name: {
                required,
                maxLength: maxLength(255)
            },
            desk_lists: {
                $each: {
                    name: {
                        required,
                        maxLength: maxLength(255)
                    }
                }
            }
        },
    }
</script>
