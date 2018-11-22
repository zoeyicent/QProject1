<template>
  <div class="docs-table">
  <!-- 
  	v-if akan merender ulang (re-create object ulang) 
  	kalau sudah re-create
  		akan mentrigger computed dan lain sebagainya
  -->
  	<div v-show="myForm.Properties.layout==='1'">
		<ObjGrid :frmID="frmID" />
  	</div>
  	<div v-show="myForm.Properties.layout==='2'" class="text-left q-ma-xs round dense row">
		<q-collapsible indent 
			icon="view_column" 
			label="Finding Info" 
			class="full-width" opened>
			<div class="row">
				<div class="col-xs-12 col-md-6">
		  			<div class="row">
						<ObjADR 
							class="col-xs-12 col-md-5"
							v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
							:pObj="Obj" :pFrmObj="'frm'+frmID"
							:key="index"
							v-if="Obj.Panel === 'Panel1' ? true : false"
						/>  	
		  			</div>
		  			<div class="row">
						<ObjADR 
							class="col-xs-12 col-md-5"
							v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
							:pObj="Obj" :pFrmObj="'frm'+frmID"
							:key="index"
							v-if="Obj.Panel === 'Panel2' ? true : false"
						/>  	
		  			</div>
					<ObjADR 
						class="col-xs-12 col-md-5"
						v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
						:pObj="Obj" :pFrmObj="'frm'+frmID"
						:key="index"
						v-if="Obj.Panel === 'Panel3' ? true : false"
					/>    			
		  		</div>  		

				<div class="col-xs-12 col-md-6">	
					<ObjADR 
						class="col-xs-12 col-md-5"
						v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
						:pObj="Obj" :pFrmObj="'frm'+frmID"
						:key="index"
						v-if="Obj.Panel === 'Panel41' ? true : false"
					/> 		
		  		</div>
	  		</div>  		
		</q-collapsible>  


		<q-collapsible indent 
			icon="view_column" 
			label="Solution Info" 
			class="full-width" opened>
  			<div class="row">
				<div class="col-xs-12 col-md-6">	
					<ObjADR 
						class="col-xs-12 col-md-5"
						v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
						:pObj="Obj" :pFrmObj="'frm'+frmID"
						:key="index"
						v-if="Obj.Panel === 'Panel5' ? true : false"
					/>			
		  		</div>

				<div class="col-xs-12 col-md-6">	
					<ObjADR 
						class="col-xs-12 col-md-5"
						v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
						:pObj="Obj" :pFrmObj="'frm'+frmID"
						:key="index"
						v-if="Obj.Panel === 'Panel6' ? true : false"
					/>			
		  		</div>	
	  		</div>
		</q-collapsible>  


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
	    	});

	    },
		// mounted() { console.log('INF_TRFIND mounted', 'Test 1222222') },	
		// beforeMount () { console.log('INF_TRFIND beforeMount', 'Test 22222') },		
		// updated() { console.log('INF_TRFIND updated', 'Test 123') },	
		// beforeUpdate () { console.log('INF_TRFIND beforeUpdate', 'Test 456') },			
		// activated () { console.log('INF_TRFIND activated', 'active') },
		// deactivated () { console.log('INF_TRFIND deactivated', 'active') },
		computed: {
	      	...mapGetters('App',['getAppForms']),
			myForm() {
				console.log('Masuk myForm INF_TRFIND');
				return this.getAppForms[this.frmID];
				// return [];
			},			
		},		
							
		methods: {
			// ...mapMutations('App',['setAppForms_Data']),
			// ...mapActions('App',['doAppLoadObject']),
			CommandClick: function (mode) {
				if (mode != "") {
					switch(mode) {
					    case "1": // Add
							auth.messaging.noPermision(this);
					    	break;
					    case "2": // Edit
							auth.messaging.noPermision(this);
							break;
					    case "6": // View
					    console.log('masuk sini')
					    	auth.fillFormObject({form: this, mode: mode});
					    	break;
					    case "3": // Delete
							auth.messaging.noPermision(this);
					    	return;
					        break;
					    case "4": // Save
							auth.messaging.noPermision(this);
					    	return;
					    	break;
					    case "5": // Cancel		
							auth.actionForm({form: this, mode: mode});	
					        break;
					}					
				}
			},

		},			
		data () {
			return {
  				frmID: 'INF_TRFINDXXXX'
	      	}
	    }
	}
</script>