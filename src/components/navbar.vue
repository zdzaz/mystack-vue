<template>
    <div id="app">
        <nav class="navbar is-fixed-bottom is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                <img src='../assets/logo.png'>
                </a>
            </div>
            <div class="navbar-menu">
                
                <div class="navbar-start" >
                    <div class="navbar-item has-dropdown-up is-hoverable">
                        <a class="navbar-link">
                        Projects
                        <b-tag v-if="user.project">
                            
                            {{user.project.name}}
                        </b-tag>
                        </a>
                        <div class="navbar-dropdown">
                        <a v-for="project in projects" :key="project.id" @click="switchProject(project)" class="navbar-item">
                            {{project.name}}
                        </a>
                        <hr class="navbar-divider">
                        <a class="navbar-item" @click="projectCreate()">
                            <i class=""><span class="material-icons">add</span></i>&nbsp;&nbsp;&nbsp;Create new project
                        </a>
                        </div>
                    </div>
                    
                    <a class="navbar-item" @click="home()">
                        Dashboard
                    </a>
                    
                    <div class="navbar-item has-dropdown-up is-hoverable">
                        <a class="navbar-link">
                        Servers
                        </a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="serverList()">
                                <i class=""><span class="material-icons">visibility</span></i>&nbsp;&nbsp;&nbsp;List
                            </a>
                            <!-- <a class="navbar-item">
                               <i class="fas fa-edit"></i>&nbsp;&nbsp;&nbsp;Modify
                            </a> -->
                            <a class="navbar-item"  @click="serverCreate()">
                                <i class=""><span class="material-icons">add</span></i>&nbsp;&nbsp;&nbsp;Create
                            </a>
                            <a class="navbar-item"  @click="serverConnection()">
                                <i class=""><span class="material-icons">settings_ethernet</span></i>&nbsp;&nbsp;&nbsp;Connection
                            </a>
                        </div>
                    </div>
                    <div class="navbar-item has-dropdown-up is-hoverable">
                        <a class="navbar-link">
                        Volumes
                        </a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="volumeList()">
                                <i class=""><span class="material-icons">visibility</span></i>&nbsp;&nbsp;&nbsp;List
                            </a>
                            <!-- <a class="navbar-item">
                               <i class="fas fa-edit"></i>&nbsp;&nbsp;&nbsp;Modify
                            </a> -->
                            <a class="navbar-item"  @click="volumeCreate()">
                                <i class=""><span class="material-icons">add</span></i>&nbsp;&nbsp;&nbsp;Create
                            </a>
                        </div>
                    </div>
                    <div class="navbar-item has-dropdown-up is-hoverable">
                        <a class="navbar-link">
                        Images
                        </a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="imageList()">
                                <i class=""><span class="material-icons">visibility</span></i>&nbsp;&nbsp;&nbsp;List
                            </a>
                            <!-- <a class="navbar-item">
                               <i class="fas fa-edit"></i>&nbsp;&nbsp;&nbsp;Modify
                            </a> -->
                            <a class="navbar-item"  @click="imageCreate()">
                                <i class=""><span class="material-icons">add</span></i>&nbsp;&nbsp;&nbsp;Create
                            </a>
                        </div>
                    </div>
                    <div class="navbar-item has-dropdown-up is-hoverable">
                        <a class="navbar-link">
                        Flavors
                        </a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="flavorList()">
                                <i class=""><span class="material-icons">visibility</span></i>&nbsp;&nbsp;&nbsp;List
                            </a>
                            <!-- <a class="navbar-item">
                               <i class="fas fa-edit"></i>&nbsp;&nbsp;&nbsp;Modify
                            </a> -->
                            <a class="navbar-item" style="opacity:50%">
                                <i class=""><span class="material-icons">add</span></i>&nbsp;&nbsp;&nbsp;Create
                            </a>
                        </div>
                    </div>
                    <div class="navbar-item has-dropdown-up is-hoverable">
                        <a class="navbar-link">
                        Heat Orchestration
                        </a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="stackList()">
                                <i class=""><span class="material-icons">visibility</span></i>&nbsp;&nbsp;&nbsp;List Stacks
                            </a>
                            
                            <a class="navbar-item" @click="stackCreate()">
                                <i class=""><span class="material-icons">add</span></i>&nbsp;&nbsp;&nbsp;Create Stack
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    </div>
    
</template>

<script>
export default {
    props:[
        'user',
        'ip',
        'projects',
        'servers'
    ],
    data: () => ({

    }),
    methods:{
        home(){
            this.$router.push("/home");
        },
        projectCreate(){
            this.$router.push("/home/project/create");
        },
        switchProject(newproject){
            if(this.user.project!=newproject){
                this.$emit('switchproject',newproject);
                this.user.project.name = newproject.name;
                this.$forceUpdate();
            }
        },
        serverList(){
            this.$router.push("/home/servers");
        },
        serverCreate(){
            this.$router.push("/home/servers/create");
        },
        serverConnection(){
            this.$router.push("/home/servers/connection");
        },
        volumeList(){
            this.$router.push("/home/volumes");
        },
        volumeCreate(){
            this.$router.push("/home/volumes/create");
        },
        imageList(){
            this.$router.push("/home/images");
        },
        imageCreate(){
            this.$router.push("/home/images/create");
        },
        flavorList(){
            this.$router.push("/home/flavors");
        },
        flavorCreate(){
            this.$router.push("/home/flavors/create");
        },
        stackList(){
            this.$router.push("/home/stacks");
        },
        stackCreate(){
            this.$router.push("/home/stacks/create");
        },

    },
    computed:{
        projectName() {
            console.log('computed')
            return this.user.project.name;
		},
    },
    mounted(){
        
    }
}
</script>