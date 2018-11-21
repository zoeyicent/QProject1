<template>
  <div class="docs-table">  	
  	eeeeeeeeeeeeeeeee

  </div>
</template>

<script>

	import auth from 'src/auth/auth.vue';
	// import ADRObjs from '../components/ADRObj/main.js';
	import { mapGetters, mapActions } from 'vuex';
	export default { 
  		// components : ADRObjs,	
	    created () { 
	    	// console.log('TBLMNU created ','created'); 
	    },
		// mounted() { console.log('TBLMNU mounted', 'Test 1222222') },	
		// beforeMount () { console.log('TBLMNU beforeMount', 'Test 22222') },		
		// updated() { console.log('TBLMNU updated', 'Test 123') },	
		// beforeUpdate () { console.log('TBLMNU beforeUpdate', 'Test 456') },			
		activated () { 
			// console.log('TBLMNU activated', 'active') 
		},		
		deactivated () { 
			// console.log('TBLMNU deactivated', 'active') 
		},		
		computed: {
	      	// ...mapGetters('App',['getMenuTree','getMenuObjectData']),
		},	
		methods: {
	      	// ...mapActions('App',['doGridCoba']),
		},			
		data () {
			return {
  				frmName: 'TBLMNU',
	      	}
	    }
	}
</script>