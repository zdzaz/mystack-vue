<template>
<span>
  <span v-if="!loading&&!loadingApp">
    <section class="hero is-light is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Dashboard
          </h1>
        </div>
      </div>
    </section>

    <div class="container" style="margin-top:30px">
      <div class="columns">
          <div class="column">
              <b class="is-size-4	">Per Instance Usage</b> 
          </div>
      </div>
      <section>
        <div v-if="barChart" id="chart">
          <apexchart type="bar" height="500" :options="chartOptions" :series="series"></apexchart>
        </div>
      </section>
      <div class="columns" style="margin-top:30px">
          <div class="column">
              <b class="is-size-4	">Project Usage</b> 
          </div>
      </div>
      <section>
          <div class="columns">
            <div class="column">
              <apexchart width="300" :options="chartOptionsInstance" :series="seriesInstance"></apexchart>
            </div>
            <div class="column">
              <apexchart width="300" :options="chartOptionsProcessRAM" :series="seriesProcessRAM"></apexchart>
            </div>
            <div class="column">
              <apexchart width="300" :options="chartOptionsProcessCores" :series="seriesProcessCores"></apexchart>
            </div>
          </div>
      
          <div class="columns">
            <div class="column">
              <apexchart width="300" :options="chartOptionsNetworkFixed" :series="seriesNetwork"></apexchart>
            </div>
            <div class="column">
            </div>
            <div class="column">
              <apexchart width="300" :options="chartOptionsNetworkFloating" :series="seriesNetworFIP"></apexchart>
            </div>
            <div class="column">
            </div>
            <div class="column">
              <apexchart width="300" :options="chartOptionsVolumes" :series="seriesVolumes"></apexchart>
            </div>
          </div>
          
      </section>
    </div>
  </span>
  <span v-else>
  </span>
</span>
  
</template>

<script>



export default {
  name: 'home',
  props:[
    'ip',
    'user',
    'loadingApp'
  ],
  data: () => ({
    loading:false,
    barChart:false,
    quota_set:{},
    current:0,
    project_usage:{},
    // BAR GRAPH
    series: [{name: 'Hours Active',data:[]},{name: 'Memory (MB)',data:[]},{name: 'vCPUs',data:[]},{name: 'Storage (GB)',data:[]}],
    chartOptions: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
      },
      theme: {
        palette: 'palette4' // upto palette10
      }
    },
    // RADIAL CHARTS 
    seriesInstance:[],
    chartOptionsInstance: {
      colors:["#20E647"],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
            background: "#ffffff"
          }
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ['Instances'],
    },
    // RAM % CORES
    seriesProcessRAM:[],
    chartOptionsProcessRAM: {
      colors:["#f70039"],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
            background: "#ffffff"
          }
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ['RAM Usage'],
    },

    seriesProcessCores:[],
    chartOptionsProcessCores: {
      colors:["#0004f7"],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
            background: "#ffffff"
          }
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ['Core Usage'],
    },
    
    // IP NETWORKS
    seriesNetwork:[],
    chartOptionsNetworkFixed: {
      colors:["#f700a4"],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
            background: "#ffffff"
          }
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ['Networks'],
    },

    seriesNetworFIP:[],
    chartOptionsNetworkFloating: {
      colors:["#f7e600"],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
            background: "#ffffff"
          }
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ['Floating IPs'],
    },

    seriesVolumes:[],
    chartOptionsVolumes: {
      colors:["#f90010"],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
            background: "#ffffff"
          }
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ['Volumes'],
    },
    

  }),
  methods:{
    getQuotas(){
      this.loading = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/os-quota-sets/'+this.user.project.id+'/detail',
        {
          headers: { 
              'x-auth-token': this.user.token
          }
        }).then(response => {
            this.quota_set = response.data.quota_set;
            this.loading = false;
            this.buildLimits();
        }).catch(error => {
            console.log(error)
            this.$toasted.error("No limits could be reached", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loading = false;
        });
    },
    getQuotasNetwork(){
      this.loading = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/quotas/'+this.user.project.id+'/details.json',
        {
          headers: { 
              'x-auth-token': this.user.token
          }
        }).then(response => {
            this.quota_set_network = response.data.quota;
            this.seriesNetwork.push(this.quota_set_network.network.used * 100 / this.quota_set_network.network.limit)
            this.seriesNetworFIP.push(this.quota_set_network.floatingip.used * 100 / this.quota_set_network.floatingip.limit)
            this.loading = false;
        }).catch(error => {
            console.log(error)
            this.$toasted.error("No network quotas could be reached", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loading = false;
        });
    },
    getQuotasVolume(){
      this.loading = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/volume/v3/'+this.user.project.id+'/limits',
        {
          headers: { 
              'x-auth-token': this.user.token
          }
        }).then((response) => {
            this.seriesVolumes.push(response.data.limits.absolute.totalVolumesUsed * 100 / response.data.limits.absolute.maxTotalVolumes)
            this.loading = false;
        }).catch(() => {
            
        });
    },
    buildLimits(){
      // RADIAL
      this.seriesInstance.push(this.quota_set.instances.in_use * 100 / this.quota_set.instances.limit);
      this.seriesProcessRAM.push(this.quota_set.ram.in_use * 100 / this.quota_set.ram.limit);
      this.seriesProcessCores.push(this.quota_set.cores.in_use * 100 / this.quota_set.cores.limit);
    },

    // BAR CHART
    getPerformanceInstances(){
      this.loading = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/os-simple-tenant-usage/'+this.user.project.id,
        {
          headers: { 
              'x-auth-token': this.user.token
          }
        }).then(response => {
            this.project_usage = response.data.tenant_usage;
            this.buildProjectUsage();
            this.loading = false;
        }).catch(() => {
            this.$toasted.error("No project usage could be retrieved", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
                this.loading = false;
        });
    },
    // BAR
    buildProjectUsage(){
      this.project_usage.server_usages.forEach(server => {
        this.chartOptions.xaxis.categories.push(server.name)
        // Horas Up
        this.series[0].data.push(server.uptime/3600)
        // Memory
        this.series[1].data.push(server.memory_mb)
        // Memory
        this.series[2].data.push(server.vcpus)
        // Volume
        this.series[3].data.push(server.local_gb)
        
      });
      this.barChart=true;
    },

  },
  
  mounted(){
    this.getQuotas();
    this.getQuotasVolume();
    this.getQuotasNetwork()
    this.getPerformanceInstances();
  },
}
</script>

