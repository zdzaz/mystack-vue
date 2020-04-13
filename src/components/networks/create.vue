<template>
    <span>
    <span v-if="!loading">
        <template>
        <fab :actions="fabActions"
            @alert="createNetwork"
        ></fab>
        </template>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Create Network
                </h1>
                </div>
            </div>
        </section>
        <section>
            <div class="container" style="padding-top:30px">
                <!-- GERAL -->
                <b-collapse
                    class="card highlight0"
                    animation="slide"
                    :open="isOpen == index"
                    @open="isOpen = index">
                    <div
                        slot="trigger"
                        slot-scope="props"
                        class="card-header"
                        role="button">
                        <p class="card-header-title highlight1">
                            Geral
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :icon="props.open ? 'menu-down' : 'menu-up'">
                            </b-icon>
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <div class="columns">
                                <b-field label="Name" label-position='' class="column">
                                    <b-input v-model="network.name" placeholder="my-new-network" required></b-input>
                                </b-field>
                                <b-field label="MTU" label-position='' class="column">
                                    <b-input v-model="network.mtu" type="number" required></b-input>
                                </b-field>
                                <b-field label="DNS Domain" label-position='' class="column">
                                    <b-input v-model="network.dns_domain"></b-input>
                                </b-field>
                            </div>
                            <div class="columns">
                                <b-field style="margin-top:30px"  class="column" expanded>
                                    <b-radio-button v-model="network.admin_state_up"
                                        native-value=true>
                                        Admin State UP
                                    </b-radio-button>
                                    <b-radio-button v-model="network.admin_state_up"
                                        native-value=false
                                        >
                                        Admin State DOWN
                                    </b-radio-button>
                                </b-field>
                                <b-field disabled label="QoS Policy pick" label-position='' class="column" >
                                    <b-select placeholder="Select a QoS Policy" v-model="selectedPolicy" expanded>
                                        <option
                                            v-for="policy in policies"
                                            :value="policy.id"
                                            :key="policy.id"
                                            >
                                            {{ policy.name == '' ? policy.id : policy.name }}
                                        </option>
                                    </b-select>
                                </b-field>
                            </div>
                            
                            
                        </div>
                    </div>
                </b-collapse>
            </div>
        </section>
    </span>
        <span v-else>
            <img class="loading" src="../../assets/loading.png">
        </span>
    </span>
        
</template>

<script>
import fab from 'vue-fab'

export default {
    name: 'create',
    components: {
        fab
    },
    props:[
        'ip',
        'user',
        'volumes',
        'images',
    ],
    data: () => ({
        loading:false,
        isOpen: 0,
        index:0,
        fabActions: [
            {
                name: 'alert',
                icon: 'done_all'
            },
        ],
        network:{},
        selectedImage:null,
        policies:[],
        selectedPolicy:null
    }),
    methods: {
        createNetwork(){
            this.loading = true;

            var data = {};
            data = { "network":this.network};
            if(data.network.admin_state_up == "true"){
                data.network.admin_state_up = true;
            } else{
                data.network.admin_state_up = false;
            }

            data.network.qos_policy_id = this.selectedPolicy;

            console.log(data)
            
            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/networks',data,
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                console.log(response)
                this.loading = false;
                this.$emit('getNetworksAgain');
                this.$toasted.success("Network created!", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
                this.$router.push("/home/networks")
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Could not create network", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
                this.loading = false;
            });
        },
        error(error_message){
            this.$toasted.error(error_message, { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
        },
        getQoS(){
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/qos/policies',
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                this.qos_policies = response.data.policies;
                this.loading = false;
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Could not get QoS policies", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
                this.loading = false;
            });
        }
    },

    computed: {
        
    },
    mounted(){
        this.getQoS();
    }
}

</script>


<style>
    .highlight0 {
        background:#bbb8ba48;
    }
    .highlight1 {
        background:#57525648;
    }
    .highlight2 {
        background:#d0f30dce;
    }
    .highlight3 {
        background:#2fe41756;
    }
    .highlight4 {
        background:#0c58e642;
    }
    .highlight5 {
        background:#f10e0e73;
    }
    .highlight6 {
        background:#00ccff7a;
    }

    div.sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        padding: 50px;
        font-size: 20px;
    }

</style>
