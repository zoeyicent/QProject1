<template>
  <div>  	
	<div v-show="localForm.tampilLayarPertama">
		<ObjGrid 
			:pGridName="this.frmName" 
			@eForm="CommandClick"
			/>
	</div>
	<div v-show="!localForm.tampilLayarPertama" class="text-left q-ma-sm round dense row">
		<div v-if="loadingObject" class="col-xs-12 col-sm-8">
			<ObjADR
				v-if="Obj.Panel === 'Panel1' ? true : false" 
				v-for="(Obj, index) in frmObj" 
				:pObj="Obj" 
				:key="index"
			/>  
			<div class="row">
				<ObjADR class="col-xs-5 col-sm-5"			
					v-for="(Obj, index) in frmObj" :pObj="Obj" :key="index"
					v-if="Obj.Panel === 'Panel2' ? true : false"
				/>  		
			</div>			
			<div class="row">
				<ObjADR class="col-xs-5 col-sm-3"			
					v-for="(Obj, index) in frmObj" :pObj="Obj" :key="index"
					v-if="Obj.Panel === 'Panel3' ? true : false"
				/>  		
			</div>			
		</div>

		<div v-if="loadingObject" class="col-xs-12 col-sm-4">
			<ObjADR
				v-if="Obj.Panel === 'Panel4' ? true : false" 
				v-for="(Obj, index) in frmObj" 
				:pObj="Obj" 
				:key="index"
			/>  
		</div>

	</div>
  </div>

</template>

<script>

	import auth from 'src/auth/auth.vue';
	// import ADRObjs from '../components/ADRObj/main.js';
	import ObjGrid from '../components/ADRObj/ObjGrid.vue';
	import ObjADR from '../components/ADRObj/ObjADR.vue';
	import { mapGetters, mapActions } from 'vuex';
	export default { 
  		// components : {'ObjGrid' : ADRObjs },	
  		components : { ObjGrid, ObjADR },	
  		// components : ADRObjs,	
	    created () { 
	    	this.localFormAction = this.$findTree(this.getMenuTree, this.$route.name).actionForm ;
			auth.loadFormObject(this);
	    	this.CommandClick (this.localFormAction.mode, 'VAEDXLP');
	    },			
		activated () { 
			this.doMenuAction( {Mode: this.localFormAction.mode, Action: this.localFormAction} );
		},		
		deactivated () { 
			this.doMenuAction( {Mode: '', Action: this.localFormAction} );
		},
		computed: {
	      	// ...mapGetters('Grid',['getGridData']),
	      	...mapGetters('Menu',['getMenuTree','getMenuObjectData']),
	      	loadingObject() {
	      		return this.frmObj.length === 0 ? false : true;
	      	},
			localForm () { 
				return this.$localFormAction(this, '');	  

			}
		},	
		methods: {
	      	...mapActions('Menu',['doMenuAction','doMenuSaveData']),
			CommandClick: function (Mode, HakAkses) {

				if (Mode != "") {
					switch(Mode) {
					    case "1": // Add
					    	break;
					    case "2": // Edit					    
					    	auth.fillFormObject(this, Mode);
					    	return;
					    	break;
					    case "3": // Delete
					    	auth.saveData(this, Mode);
					    	return;
					        break;
					    case "4": // Save
					    	auth.saveData(this, this.localFormAction.mode);
					    	return;
					    	break;
					    case "5": // Cancel									
							auth.resetValidation(this);
					        break;
					    case "6": // View
					    	auth.fillFormObject(this, Mode);
					    	return;
					    	break;					        
					}
				}				
				
				auth.clearFormObject(this, Mode);
				this.doMenuAction( {Mode: Mode, Action: this.localFormAction} );
			},
    
		},			
		data () {
			return {
  				frmName: 'TBLPLF',
				frmObj : '', // frmObj berhubungan dengan auth.loadFormObject
				localFormAction: { type: Object },
	      	}
	    }
	}
</script>