<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">      
      Sorry, nothing here...<br>
      Menu<br>
      {{ localFormAction.JudulSubMenu }}}<br>
      <strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="$router.push('/')"
    >Go back</q-btn>
  </div>
</template>


<script>

  import { mapGetters, mapActions } from 'vuex';
  export default { 
      // name: 'Page404',  
      created () { 
        console.log('TBLCMT created ','created'); 
        this.localFormAction = this.$findTree(this.getMenuTree, this.$route.name).actionForm ;
        this.CommandClick ('', 'VAEDXLP');
      },
      activated () { 
        console.log('Page 404 activated', this.$route.name) 
        // this.localFormAction = this.$findTree(this.getMenuTree, this.$route.name).actionForm ;
        this.CommandClick ('', 'VAEDXLP');
      },    
      deactivated () { 
        this.CommandClick ('', 'VAEDXLP');
        console.log('Page 404 deactivated', 'active') 
      },    
      computed: {    
        ...mapGetters('Menu',['getMenuTree']), 
        localForm () {
            console.log('Page 404 computed ','computed'); 
            this.CommandClick (this.localFormAction.mode, 'VAEDXLP');
          return this.localFormAction
        }
      },          
      methods: {
        ...mapActions('Menu',['doMenuAction']),
        CommandClick: function (Mode, HakAkses) {

          if (Mode != "") {
            var FlagTombol = true;
            switch(Mode) {
                case "1": // Add
                case "2": // Edit
                case "3": // Delete
                  FlagTombol = false;
                    break;
                case "4": // Save
                case "5": // View
                  FlagTombol = true;
                    // code block
                    break;
            }
          }
          this.doMenuAction( {Mode: Mode, Action: this.localFormAction} );
        },          
        btnClick() {
          this.$router.go(-1);
          // this.$router.push('/');
          // console.log(this.$router);
        }
      },      
      data () {
        return {
          localFormAction: { type: Object },
        }
      }
  }
</script>

