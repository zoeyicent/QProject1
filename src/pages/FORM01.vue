<template>
  <div class="docs-table"
   v-if="myForm.Properties === undefined ? false : true">
  <!-- 
  	v-if akan merender ulang (re-create object ulang) 
  	kalau sudah re-create
  		akan mentrigger computed dan lain sebagainya
  -->
  	<div v-show="myForm.Properties.layout==='1'">
		<ObjGrid :frmID="frmID" />
  	</div>
  	<div v-show="myForm.Properties.layout==='2'" class="text-left q-ma-md round dense row">
  		<div class="col-xs-12 col-md-6">
			<ObjADR 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				v-if="Obj.Panel === 'Panel1' ? true : false"
			/>  	
  		</div>
  	</div>
  </div>
</template>

<script>

	import auth from 'src/auth/auth.vue';
	import ADRObjs from '../components/ADRObj/main.js';
	// import { mapGetters, mapMutations, mapActions } from 'vuex';
	import { mapGetters } from 'vuex';
	export default { 
  		components : ADRObjs,	
	    created () { 
	    	auth.setupForm({
	    		form: this,						// --> local this
	    		formId: 'frmID',  				// --> local variabel name 
	    		CommandClick: this.CommandClick
	    	}).then(() => {	    		
                this.myForm = this.getAppForms[this.frmID];
	    	});
	    },
		// mounted() { console.log('FORM01 mounted', 'Test 1222222') },	
		// beforeMount () { console.log('FORM01 beforeMount', 'Test 22222') },		
		// updated() { console.log('FORM01 updated', 'Test 123') },	
		// beforeUpdate () { console.log('FORM01 beforeUpdate', 'Test 456') },			
		// activated () { console.log('FORM01 activated', 'active') },
		// deactivated () { console.log('FORM01 deactivated', 'active') },
		computed: {
	      	...mapGetters('App',['getAppForms']),
			// myForm() {
			// 	console.log('Masuk myForm FORM01');
			// 	return this.getAppForms[this.frmID];
			// 	// return [];
			// },			
		},	
		methods: {
			// ...mapMutations('App',['setAppForms_Data']),
			// ...mapActions('App',['doAppLoadObject']),
			CommandClick: function (mode) {
				if (mode != "") {
					switch(mode) {
					    case "1": // Add
							auth.actionForm({form: this, mode: mode});	
					    	// alert('masuk sini');
					    	break;
					    case "2": // Edit
					    case "6": // View
					    	auth.fillFormObject({form: this, mode: mode});
					    	break;
					    case "3": // Delete
					    	auth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    		mode: '3'
					    	});
					    	return;
					        break;
					    case "4": // Save
					    	// console.log('Begin Saving Data')
					    	auth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    	})
					    	// console.log('End Saving Data')
					    	return;
					    	break;
					    case "5": // Cancel		
							auth.actionForm({form: this, mode: mode});	
					        break;			        
					}					
				}
			}
		},			
		data () {
			return {
  				frmID: 'FORM01XXXX',
                myForm: {}
	      	}
	    }
	}
</script>